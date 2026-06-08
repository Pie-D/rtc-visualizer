import { config as dotenvConfig } from 'dotenv'

const envConfig = dotenvConfig()

// Prevent AWS SDK from attempting to fetch credentials from the EC2 Instance Metadata Service (IMDS)
// which causes the app to crash with EHOSTUNREACH when running locally.
if (!process.env.AWS_ACCESS_KEY_ID) {
  process.env.AWS_ACCESS_KEY_ID = 'dummy'
}
if (!process.env.AWS_SECRET_ACCESS_KEY) {
  process.env.AWS_SECRET_ACCESS_KEY = 'dummy'
}

import('./logger.mjs').then(({ default: log }) => {
  if (envConfig.error) {
    log.error('Config file missing')
  } else {
    log.info('Config file loaded')
  }
})
