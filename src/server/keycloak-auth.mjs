import jwt from 'jsonwebtoken'
import logger from './logger.mjs'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const {
  KEYCLOAK_ENABLED,
  KEYCLOAK_AUTH_SERVER_URL,
  KEYCLOAK_REALM,
  KEYCLOAK_CLIENT_ID,
  KEYCLOAK_CLIENT_SECRET
} = process.env

export const isKeycloakEnabled = KEYCLOAK_ENABLED === 'true'

logger.info('Keycloak configuration status:', {
  enabled: isKeycloakEnabled,
  serverUrl: KEYCLOAK_AUTH_SERVER_URL,
  realm: KEYCLOAK_REALM,
  clientId: KEYCLOAK_CLIENT_ID
})

// Load custom 403 Access Denied template matching CMCCIST style from file
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const forbiddenHtmlPath = path.join(__dirname, 'forbidden.html')
export let forbiddenHtml = '<h3>Forbidden: Access denied. You must be a tenant-admin or tenant-superadmin to access this tool.</h3>'

try {
  forbiddenHtml = fs.readFileSync(forbiddenHtmlPath, 'utf8')
} catch (error) {
  logger.error(`Failed to read forbidden.html template: ${error.message}`)
}

// In-memory cache for Keycloak public keys
const keyCache = new Map()

/**
 * Checks if the decoded token contains either 'tenant-admin' or 'tenant-superadmin'
 * in the active_tenant.roles array.
 */
function hasAccessRole (decoded) {
  const activeTenant = decoded && decoded.active_tenant
  const roles = activeTenant && activeTenant.roles
  if (!Array.isArray(roles)) {
    return false
  }
  return roles.includes('tenant-admin') || roles.includes('tenant-superadmin')
}

/**
 * Retrieves the public key for verifying the signature of a given JWT token.
 * Fetches and caches keys from Keycloak's JWKS endpoint if there's a cache miss.
 */
async function getPublicKey (token) {
  try {
    const decoded = jwt.decode(token, { complete: true })
    if (!decoded || !decoded.header || !decoded.header.kid) {
      throw new Error('Invalid token format or missing kid header')
    }

    const { kid } = decoded.header
    if (keyCache.has(kid)) {
      return keyCache.get(kid)
    }

    // Cache miss: fetch active keys from Keycloak JWKS endpoint
    const certsUrl = `${KEYCLOAK_AUTH_SERVER_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/certs`
    logger.info(`Fetching Keycloak certificates from: ${certsUrl}`)

    const response = await fetch(certsUrl)
    if (!response.ok) {
      throw new Error(`Failed to fetch JWKS from Keycloak: ${response.statusText}`)
    }

    const { keys } = await response.json()
    if (!keys || !Array.isArray(keys)) {
      throw new Error('Invalid JWKS response format')
    }

    // Clear old cache and populate with new keys
    keyCache.clear()
    for (const key of keys) {
      if (key.kid && key.x5c && key.x5c.length > 0) {
        // Format x5c to standard PEM certificate format
        const cleanCert = key.x5c[0].replace(/\s+/g, '')
        const formattedCert = cleanCert.replace(/(.{64})/g, '$1\n')
        const certPem = `-----BEGIN CERTIFICATE-----\n${formattedCert}\n-----END CERTIFICATE-----`
        keyCache.set(key.kid, certPem)
      }
    }

    if (!keyCache.has(kid)) {
      throw new Error(`Public key with kid "${kid}" not found in Keycloak JWKS`)
    }

    return keyCache.get(kid)
  } catch (error) {
    logger.error(`Failed to retrieve Keycloak public key: ${error.message}`)
    throw error
  }
}

// Middleware to check authentication status
export default async (req, res, next) => {
  if (!isKeycloakEnabled) {
    return next()
  }

  const path = req.path
  if (path === '/healthcheck' || path === '/keycloak/callback' || path === '/version') {
    return next()
  }

  // 1. Check for Authorization header (Bearer token)
  const authHeader = req.headers.authorization || ''
  if (authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7)
    try {
      const publicKey = await getPublicKey(token)
      const decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] })

      // Verify roles in JWT
      if (!hasAccessRole(decoded)) {
        logger.warn(`Bearer token verification: User ${decoded.preferred_username || decoded.sub} lacks required tenant roles.`)
        return res.status(403).json({ error: 'Forbidden', message: 'Access denied: insufficient roles' })
      }

      req.user = decoded
      return next()
    } catch (error) {
      logger.error(`Keycloak Bearer token verification failed: ${error.message}`)
      return res.status(401).json({ error: 'Unauthorized' })
    }
  }

  // 2. Check for session cookie
  const token = req.cookies && req.cookies.rtc_session
  if (token) {
    try {
      const publicKey = await getPublicKey(token)
      const decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] })

      // Verify roles in JWT
      if (!hasAccessRole(decoded)) {
        logger.warn(`Cookie verification: User ${decoded.preferred_username || decoded.sub} lacks required tenant roles.`)
        const acceptsHtml = req.headers.accept && req.headers.accept.includes('text/html')
        if (acceptsHtml && !req.path.startsWith('/files') && !req.path.startsWith('/search') && !req.path.startsWith('/download')) {
          return res.status(403).send(forbiddenHtml)
        }
        return res.status(403).json({ error: 'Forbidden', message: 'Access denied: insufficient roles' })
      }

      req.user = decoded
      return next()
    } catch (error) {
      logger.warn(`Keycloak session cookie verification failed: ${error.message}. Redirecting to login...`)
      res.clearCookie('rtc_session')
    }
  }

  // 3. Prevent redirecting API requests (AJAX)
  const acceptsHtml = req.headers.accept && req.headers.accept.includes('text/html')
  const isApiRequest = req.path.startsWith('/files') || req.path.startsWith('/search') || req.path.startsWith('/download')

  if (isApiRequest || !acceptsHtml) {
    return res.status(401).json({ error: 'Unauthorized', message: 'Session expired or invalid' })
  }

  // 4. Redirect to Keycloak authorization endpoint
  const host = req.get('host')
  const protocol = req.headers['x-forwarded-proto'] || req.protocol
  const redirectUri = process.env.KEYCLOAK_REDIRECT_URI || `${protocol}://${host}/keycloak/callback`

  const originalUrl = req.originalUrl || '/'
  res.cookie('rtc_redirect_to', originalUrl, {
    httpOnly: true,
    secure: req.secure || protocol === 'https',
    sameSite: 'lax'
  })

  const authUrl = `${KEYCLOAK_AUTH_SERVER_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/auth` +
    `?client_id=${encodeURIComponent(KEYCLOAK_CLIENT_ID)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    '&response_type=code' +
    '&scope=openid'

  return res.redirect(authUrl)
}

export const handleCallback = async (req, res) => {
  const { code } = req.query
  if (!code) {
    logger.error('Keycloak callback called without authorization code')
    return res.status(400).send('Authorization code is missing')
  }

  const host = req.get('host')
  const protocol = req.headers['x-forwarded-proto'] || req.protocol
  const redirectUri = process.env.KEYCLOAK_REDIRECT_URI || `${protocol}://${host}/keycloak/callback`

  try {
    const tokenUrl = `${KEYCLOAK_AUTH_SERVER_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/token`

    const params = new URLSearchParams()
    params.append('grant_type', 'authorization_code')
    params.append('code', code)
    params.append('redirect_uri', redirectUri)
    params.append('client_id', KEYCLOAK_CLIENT_ID)
    if (KEYCLOAK_CLIENT_SECRET) {
      params.append('client_secret', KEYCLOAK_CLIENT_SECRET)
    }

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params
    })

    if (!response.ok) {
      const errorText = await response.text()
      logger.error(`Failed to exchange code for tokens: ${response.status} - ${errorText}`)
      return res.status(500).send('Authentication failed')
    }

    const tokens = await response.json()
    const { access_token, expires_in } = tokens

    // Decode and verify role access permission
    const decoded = jwt.decode(access_token)
    const hasRole = hasAccessRole(decoded)
    if (!hasRole) {
      logger.warn(`User ${decoded?.preferred_username || decoded?.sub} authenticated but lacks required tenant roles. Redirecting to forbidden state.`)
    }

    res.cookie('rtc_session', access_token, {
      httpOnly: true,
      secure: req.secure || protocol === 'https',
      sameSite: 'lax',
      maxAge: expires_in * 1000
    })

    const redirectTo = hasRole ? (req.cookies.rtc_redirect_to || '/') : '/'
    res.clearCookie('rtc_redirect_to')

    return res.redirect(redirectTo)
  } catch (error) {
    logger.error(`Error exchanging authorization code: ${error.message}`)
    return res.status(500).send('Authentication failed')
  }
}

export const handleLogout = (req, res) => {
  res.clearCookie('rtc_session')

  const host = req.get('host')
  const protocol = req.headers['x-forwarded-proto'] || req.protocol
  const postLogoutRedirect = `${protocol}://${host}/`

  const logoutUrl = `${KEYCLOAK_AUTH_SERVER_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/logout` +
    `?client_id=${encodeURIComponent(KEYCLOAK_CLIENT_ID)}` +
    `&post_logout_redirect_uri=${encodeURIComponent(postLogoutRedirect)}`

  return res.redirect(logoutUrl)
}
