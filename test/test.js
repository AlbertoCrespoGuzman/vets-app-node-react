var request = require("supertest")
var app = require("../app.js")

describe("GET /api/alive", function() {
 it("respond with Alive", function(done) {
    request(app).get('/api/alive').expect("I'm alive", done)
 })
})