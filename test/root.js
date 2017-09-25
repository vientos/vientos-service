/* global describe, it */
const expect = require('chai').expect
const sinon = require('sinon')

const mongoose = require('mongoose')
sinon.stub(mongoose, 'connect', () => Promise.resolve())

const server = require('../src/server')

describe('/', function () {
  it('should respond with HTTP 200', function () {
    return server.inject('/')
      .then((response) => {
        expect(response.statusCode).to.equal(200)
      })
  })
  it('should include session information when authenticated', function () {
    let sessionId = 'cj031ox7w000034lpfs38ybjr'
    return server.inject({
      url: '/',
      credentials: { sessionId }
    }).then((response) => {
      expect(response.statusCode).to.equal(200)
      expect(response.payload).to.equal(JSON.stringify({
        loginProviders: {},
        session: {
          _id: 'http://localhost:3000/sessions/cj031ox7w000034lpfs38ybjr',
          type: 'Session'
        }
      }))
    })
  })
})
