const Joi = require('joi')
const Hoek = require('hoek')

function vientosProvider (options) {
  const validated = Joi.validate(options, Joi.object({
    vientosIdpUrl: Joi.required()
  }))

  Hoek.assert(!validated.error, validated.error)

  const settings = validated.value
  return {
    protocol: 'oauth2',
    useParamsAuth: true,
    auth: `${settings.vientosIdpUrl}/authorize`,
    token: `${settings.vientosIdpUrl}/token`,
    profile: function (credentials, params, get, callback) {
      get(`${settings.vientosIdpUrl}/userinfo`, null, (profile) => {
        credentials.profile = {
          id: profile.id,
          email: profile.email
        }
        callback()
      })
    }
  }
}

module.exports = vientosProvider
