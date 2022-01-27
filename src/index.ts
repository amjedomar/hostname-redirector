import dotenv from 'dotenv'
import express from 'express'
import chalk from 'chalk'

const appName = chalk.blueBright('[Hostname Redirector]:')

// config
dotenv.config()

const PORT = parseInt(process.env.PORT ?? '9090', 10)

// utils
/**
 * isPrivateIP
 * from https://stackoverflow.com/a/13969691/8148505
 * also check https://en.wikipedia.org/wiki/Private_network#Private_IPv4_addresses
 */
const isPrivateIP = (ip: string) => {
  const parts = ip.split('.')

  return (
    parts[0] === '10' ||
    (parts[0] === '172' &&
      parseInt(parts[1], 10) >= 16 &&
      parseInt(parts[1], 10) <= 31) ||
    (parts[0] === '192' && parts[1] === '168')
  )
}

/**
 * isPrivateHostname
 */
const isPrivateHostname = (hostname: string) => {
  return hostname === 'localhost' || isPrivateIP(hostname)
}

// collect redirections
console.log(`${appName} collect redirections`)

const redirections = (() => {
  const envKeys = Object.keys(process.env)

  const result: {
    from: string
    to: string
  }[] = []

  for (const envKey of envKeys) {
    if (envKey.startsWith('REDIRECT_HOSTNAME_')) {
      const InvalidValErr = new Error(
        `the value of the environment variable "${envKey}" ` +
          'should be like this format ' +
          '"hostname-source.com -> hostname-destination.com" ' +
          'where the hostnames ' +
          'does not include the protocol and the port ' +
          'and does not end with /',
      )

      const envVal = (process.env[envKey] ?? '').trim()

      if (
        envVal.startsWith(' -> ') ||
        envVal.endsWith(' -> ') ||
        envVal.match(/ -> /g)?.length !== 1
      ) {
        throw InvalidValErr
      }

      const [from, to] = envVal.split(' -> ')
      const hostnameRegex = /^https?:\/\/|\/$|:/

      if (hostnameRegex.test(from) || hostnameRegex.test(to)) {
        throw InvalidValErr
      }

      console.log(
        `${appName} setup redirection ` +
          `"${chalk.cyanBright(from)}" ` +
          `-> "${chalk.cyanBright(to)}"`,
      )

      result.push({ from, to })
    }
  }

  return result
})()

// server
const server = express()

server.use((req, res) => {
  const { protocol } = req
  const host = req.get('host')

  if (!host) {
    return res.status(500).send()
  }

  const [hostname, port = ''] = host.trim().split(':')

  if (!hostname) {
    return res.status(500).send()
  }

  const originalUrl = req.originalUrl.startsWith('/')
    ? req.originalUrl.slice(1)
    : req.originalUrl

  if (isPrivateHostname(hostname)) {
    return res.status(204).send()
  }

  const redirection = redirections.find(
    (redirection) => redirection.from === hostname,
  )

  if (!redirection) {
    console.log(
      `${appName} error no redirection found for "${hostname}"` +
        'in environment variables',
    )
    return res.status(500).send()
  }

  const destinationHost = redirection.to + (port ? `:${port}` : '')
  const destination = `${protocol}://${destinationHost}/${originalUrl}`

  console.log(`${appName} redirecting ${redirection.from} -> ${redirection.to}`)
  res.redirect(301, destination)
})

server.listen(PORT, () => {
  console.log(`${appName} server is running on http://localhost:${PORT}`)
})
