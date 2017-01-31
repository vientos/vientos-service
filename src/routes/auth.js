const AuthController = require('../controllers/auth')

module.exports.google = {
  method: 'GET',
  path: '/auth/google',
  config: {
    auth: 'google',
    handler: AuthController.oauth
  }
}

module.exports.facebook = {
  method: 'GET',
  path: '/auth/facebook',
  config: {
    auth: 'facebook',
    handler: AuthController.oauth
  }
}

module.exports.hello = {
  method: 'GET',
  path: '/auth/hello',
  config: {
    handler: AuthController.hello
  }
}

module.exports.bye = {
  method: 'PUT',
  path: '/auth/bye',
  config: {
    handler: AuthController.bye
  }
}
