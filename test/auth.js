/* global describe, it */
const expect = require('chai').expect
const sinon = require('sinon')

const mongoose = require('mongoose')
sinon.stub(mongoose, 'connect', () => Promise.resolve())

const server = require('../src/server')

describe('/auth/hello', function () {
  it('should respond with HTTP 401 if not authenticated', function () {
    return server.inject('/auth/hello')
      .then((response) => {
        expect(response.statusCode).to.equal(401)
      })
  })
  it('should redirect to the session if authenticated', function () {
    let sessionId = 'cj031ox7w000034lpfs38ybjr'
    return server.inject({
      url: '/auth/hello',
      credentials: { sessionId }
    }).then((response) => {
      expect(response.statusCode).to.equal(303)
      expect(response.headers.location).to.equal('/sessions/' + sessionId)
    })
  })
})
