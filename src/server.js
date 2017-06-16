const fs = require('fs')
const Hapi = require('hapi')
const http2 = require('http2')
const Bell = require('bell')
const AuthCookie = require('hapi-auth-cookie')
const mongoose = require('mongoose')
const vientosProvider = require('./vientosProvider')

const httpServerOptions = {}
if (process.env.TLS_KEY_PATH && process.env.TLS_CERT_PATH) {
  httpServerOptions.key = fs.readFileSync(process.env.TLS_KEY_PATH)
  httpServerOptions.cert = fs.readFileSync(process.env.TLS_CERT_PATH)
}
const PORT = process.env.HAPI_PORT || 3000
const COOKIE_PASSWORD = process.env.COOKIE_PASSWORD || 'it-should-have-min-32-characters'
const NODE_ENV = process.env.NODE_ENV || 'development'
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017'

mongoose.Promise = global.Promise
mongoose.connect(MONGO_URL, { promiseLibrary: global.Promise })

const server = new Hapi.Server()

const connectionOptions = {
  port: PORT,
  routes: { cors: { credentials: true, exposedHeaders: ['location'] } },
  state: { isSameSite: false } // required for CORS
}
if (httpServerOptions.key && httpServerOptions.cert) {
  connectionOptions.listener = http2.createServer(httpServerOptions)
}
server.connection(connectionOptions)

const AuthRoutes = require('./routes/auth')
server.register([AuthCookie, Bell], (err) => {
  if (err) throw err

  const IS_SECURE = NODE_ENV === 'production'

  server.auth.strategy('session', 'cookie', true, {
    password: COOKIE_PASSWORD,
    isSecure: IS_SECURE,
    keepAlive: true,
    ttl: 7 * 24 * 60 * 60 * 1000 // 7 days
  })

  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    server.auth.strategy('google', 'bell', {
      provider: 'google',
      password: COOKIE_PASSWORD,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      location: process.env.OAUTH_CLIENT_DOMAIN,
      isSecure: IS_SECURE
    })
    server.route(AuthRoutes.google)
  }

  if (process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET) {
    server.auth.strategy('facebook', 'bell', {
      provider: 'facebook',
      password: COOKIE_PASSWORD,
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      location: process.env.OAUTH_CLIENT_DOMAIN,
      isSecure: IS_SECURE
    })
    server.route(AuthRoutes.facebook)
  }

  if (process.env.VIENTOS_IDP_URL &&
      process.env.VIENTOS_CLIENT_ID &&
      process.env.VIENTOS_CLIENT_SECRET) {
    server.auth.strategy('vientos', 'bell', {
      provider: vientosProvider({
        vientosIdpUrl: process.env.VIENTOS_IDP_URL
      }),
      password: COOKIE_PASSWORD,
      clientId: process.env.VIENTOS_CLIENT_ID,
      clientSecret: process.env.VIENTOS_CLIENT_SECRET,
      location: process.env.OAUTH_CLIENT_DOMAIN,
      isSecure: IS_SECURE
    })
    server.route(AuthRoutes.vientos)
  }

  server.route(AuthRoutes.hello)
  server.route(require('./routes/sessions'))
})

server.route(require('./routes/person'))
server.route(require('./routes/projects'))
server.route(require('./routes/intents'))
server.route(require('./routes/conversations'))
server.route(require('./routes/notifications'))
server.route(require('./routes/places'))

// reply 200 OK (for uptime monitors)
server.route({
  method: 'GET',
  path: '/',
  config: {
    handler: (request, reply) => reply(),
    auth: false
  }
})

// don't start if required from other script
if (!module.parent) {
  server.start((err) => {
    if (err) throw err
    console.log('Server running at:', server.info.uri)
  })
}

module.exports = server
