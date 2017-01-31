const Hapi = require('hapi')
const Bell = require('bell')
const AuthCookie = require('hapi-auth-cookie')
const mongoose = require('mongoose')

const PORT = process.env.HAPI_PORT || 3000
const COOKIE_PASSWORD = process.env.COOKIE_PASSWORD || 'it-should-have-min-32-characters'
const NODE_ENV = process.env.NODE_ENV || 'development'
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017'

mongoose.Promise = global.Promise
mongoose.connect(MONGO_URL, { promiseLibrary: global.Promise })

const server = new Hapi.Server()

server.connection({
  port: PORT,
  routes: { cors: { credentials: true } },
  state: { isSameSite: false } // requried for CORS
})

const AuthRoutes = require('./routes/auth')
server.register([AuthCookie, Bell], (err) => {
  if (err) throw err

  const IS_SECURE = NODE_ENV === 'production'

  server.auth.strategy('session', 'cookie', true, {
    password: COOKIE_PASSWORD,
    isSecure: IS_SECURE
  })

  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    server.auth.strategy('google', 'bell', {
      provider: 'google',
      password: COOKIE_PASSWORD,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      location: process.env.CLIENT_DOMAIN,
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
      location: process.env.CLIENT_DOMAIN,
      isSecure: IS_SECURE
    })
    server.route(AuthRoutes.facebook)
  }

  server.route(AuthRoutes.hello)
  server.route(AuthRoutes.bye)
})

server.route(require('./routes/person'))

server.start((err) => {
  if (err) throw err
  console.log('Server running at:', server.info.uri)
})
