export const generateActions = actionNames =>
  actionNames.reduce(
    (actions, actionName) =>
      Object.assign(actions, {
        [actionName]: Symbol(actionName)
      }),
    {}
  )

export const formatDate = num => {
  if (!num) return ''
  const date = new Date(num)
  if (isNaN(date.getTime())) return num

  const pad = (n) => n.toString().padStart(2, '0')
  const yyyy = date.getFullYear()
  const mm = pad(date.getMonth() + 1)
  const dd = pad(date.getDate())
  const hh = pad(date.getHours())
  const min = pad(date.getMinutes())
  const ss = pad(date.getSeconds())

  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`
}

export const buildRelativeUrl = (path, queryParams = {}) => {
  const url = new URL(path, window.location.href)
  Object.entries(queryParams).forEach(([key, value]) => {
    if (value) {
      url.searchParams.set(key, value)
    }
  })

  return url
}

export const getLogoutUrl = () => {
  const path = window.location.pathname
  const match = path.match(/^\/([^/]+)/)
  const firstSegment = match ? match[1] : ''
  if (firstSegment && firstSegment !== 'logout' && firstSegment !== 'search') {
    return `/${firstSegment}/logout`
  }
  return '/logout'
}
