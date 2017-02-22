/* global describe, it */
const expect = require('chai').expect
const sinon = require('sinon')

const mongoose = require('mongoose')
sinon.stub(mongoose, 'connect', () => Promise.resolve())

const Person = require('../src/models/person')
let personId = '50341373e894ad16347efe01'
sinon.stub(Person, 'findById', (id) => {
  return Promise.resolve(new Person({ _id: id }))
})

const server = require('../src/server')

describe('/auth/hello', function () {
  it('should respond with HTTP 401 if not authenticated', function () {
    return server.inject('/auth/hello')
      .then((response) => {
        return expect(response.statusCode).to.equal(401)
      })
  })
  it('should respond with profile with correct _id if authenticated', function () {
    return server.inject({
      url: '/auth/hello',
      credentials: { id: personId }
    }).then((response) => {
      let profile = JSON.parse(response.payload)
      expect(profile._id).to.equal(personId)
      return expect(response.statusCode).to.equal(200)
    })
  })
})
