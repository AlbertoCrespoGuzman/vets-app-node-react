var request = require("supertest")
var app = require("../app.js")

describe("GET /status", function() {
 it("respond with Alive", function(done) {
    request(app).get('/status').expect('{"status": "ok"}', done)
 })
})