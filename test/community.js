import { expect } from "chai";
import sinon from "sinon";
import Community from "../src/models/communityModel";
import CommunityRoutes from "../src/handlers/CommunityHandler";

// Set test communities
var testCommunity = {
  uuid: "cd17d160-c3a1-11e6-b5ea-270f32f3a33a",
  name: "The test community",
  description: "A community to test the mongodb model",
  slug: "the-test-community",
  creationDate: "2016-12-19T13:49:17.602Z"
}

var testCommunityDB ={
  _id: "5857e55dd997a925f8013020",
  uuid: "cd17d160-c3a1-11e6-b5ea-270f32f3a33a",
  name: "The test community",
  description: "A community to test the mongodb model",
  slug: "the-test-community",
  __v: 0,
  creationDate: "2016-12-19T13:49:17.602Z"
}

var testCommunity2 = {
  uuid: "4be8f640-c546-11e6-8fa8-37253a84c3be",
  name: "Another test community",
  description: "A community to test the mongodb model",
  slug: "another-test-community",
  creationDate: "2016-12-20T13:49:17.602Z"
}

var testCommunity2DB ={
  _id: "5856c5679af2380d07ab16b0",
  uuid: "4be8f640-c546-11e6-8fa8-37253a84c3be",
  name: "Another test community",
  description: "A community to test the mongodb model",
  slug: "another-test-community",
  __v: 0,
  creationDate: "2016-12-20T13:49:17.602Z"
}

// Unit tests for community model
describe("Community model", () => {
  it("Should be invalid if name is empty", function(done) {
    // Create new community with no name
    var comm = new Community({
      uuid: testCommunity.uuid,
      description: testCommunity.description,
      slug: testCommunity.slug
    });

    // Validate it
    comm.validate(function(err) {
      expect(err.errors.name).to.exist;
      done();
    });
  });

  it("hould be invalid if description is empty", function(done) {
    // Create new community with no description
    var comm = new Community({
      uuid: testCommunity.uuid,
      name: testCommunity.name,
      slug: testCommunity.slug
    });

    // Validate it
    comm.validate(function(err) {
      expect(err.errors.description).to.exist;
      done();
    });
  });

  it("should be invalid if uuid is empty", function(done) {
    // Create new community with no uuid
    var comm = new Community({
      name: testCommunity.name,
      description: testCommunity.description,
      slug: testCommunity.slug
    });

    // Validate it
    comm.validate(function(err) {
      expect(err.errors.uuid).to.exist;
      done();
    });
  });

  it("should be invalid if name is longer than 100 chars", function(done) {
    // Create new community with name longer than 100 chars
    var comm = new Community({
      uuid: testCommunity.uuid,
      name: "a".repeat(101),
      description: testCommunity.description,
      slug: testCommunity.slug
    });

    // Validate it
    comm.validate(function(err) {
      expect(err.errors.name).to.exist;
      done();
    });
  });

  it("should be invalid if description is longer than 200 chars", function(done) {
    // Create new community with description longer than 200 chars
    var comm = new Community({
      uuid: testCommunity.uuid,
      name: testCommunity.name,
      description: "a".repeat(201),
      slug: testCommunity.slug
    });

    // Validate it
    comm.validate(function(err) {
      expect(err.errors.description).to.exist;
      done();
    });
  });

  it("should be valid if all fields are provided (and valid)", function(done) {
    // Create new community with valid fields
    var comm = new Community({
      uuid: testCommunity.uuid,
      name: testCommunity.name,
      description: testCommunity.description,
      slug: testCommunity.slug
    });

    // Validate it
    comm.validate(function(err) {
      expect(err).to.not.exist;
      done();
    });
  });
});

describe("Community handlers", function() {

  // Stub every mongo function before each test
  beforeEach(function() {
    sinon.stub(Community, "find");
    sinon.stub(Community, "findOne");
    sinon.stub(Community, "create");
    sinon.stub(Community, "findOneAndRemove");
    sinon.stub(Community, "findOneAndUpdate");
  });

  // Restore every mongo function before each test
  afterEach(function() {
    Community.find.restore();
    Community.findOne.restore();
    Community.create.restore();
    Community.findOneAndRemove.restore();
    Community.findOneAndUpdate.restore();
  });

  it("Should get all communities", async function() {
    // Set test community and expected result
    let dbResponse = [testCommunityDB, testCommunity2DB];
    let expectedResponse = { status: "OK", data: [testCommunity, testCommunity2] };

    // Yield expected values
    Community.find.returns(dbResponse);

    // Set request and response
    let req = { params: { }, body: { } };
    let res = { json: sinon.stub(), status: sinon.stub() };
    let next = sinon.stub();

    await CommunityRoutes.getCommunities(req, res, next);
    sinon.assert.calledOnce(next);
    sinon.assert.calledOnce(res.json);
    sinon.assert.calledWith(res.json, expectedResponse);
  });

  it("Should get one community", async function() {
    // Set test community and expected result
    let expectedResponse = { status: "OK", data: testCommunity };

    // Yield expected values
    Community.findOne.returns(testCommunityDB);

    // Set request and response
    let req = {
      params: {
        "uuid": testCommunity.uuid
      },
      body: { }
    };
    let res = { json: sinon.stub(), status: sinon.stub() };
    let next = sinon.stub();

    await CommunityRoutes.getCommunity(req, res, next);
    sinon.assert.calledOnce(next);
    sinon.assert.calledOnce(res.json);
    sinon.assert.calledWith(res.json, expectedResponse);
    sinon.assert.calledWith(Community.findOne, { "uuid": testCommunity.uuid });
  });

  it("Should not find community", async function() {
    // Set test community and expected result
    let expectedResponse = { status: "Not found" };

    // Yield expected values
    Community.findOne.returns(null);

    // Set request and response
    let req = {
      params: {
        "uuid": "not-existing-uuid"
      },
      body: { }
    };
    let res = { json: sinon.stub(), status: sinon.stub() };
    let next = sinon.stub();

    await CommunityRoutes.getCommunity(req, res, next);
    sinon.assert.calledOnce(next);
    sinon.assert.calledOnce(res.json);
    sinon.assert.calledWith(res.json, expectedResponse);
    sinon.assert.calledWith(res.status, 404);
    sinon.assert.calledWith(Community.findOne, { "uuid": "not-existing-uuid" });
  });

  it("Should create a new community", async function() {
    // Set test community and expected result
    let expectedResponse = { status: "OK", data: testCommunity2 };

    // Yield expected values
    Community.create.returns(testCommunity2DB);

    // Set request and response
    let req = {
      params: { },
      body: {
        "name": testCommunity2.name,
        "description": testCommunity2.description,
      }
    };
    let res = { json: sinon.stub(), status: sinon.stub() };
    let next = sinon.stub();

    await CommunityRoutes.createCommunity(req, res, next);
    sinon.assert.calledOnce(next);
    sinon.assert.calledOnce(res.json);
    sinon.assert.calledWith(res.json, expectedResponse);
    sinon.assert.calledWith(res.status, 201);
  });

  it("Should not create a new community with db error", async function() {
    // Set test community and expected result
    let expectedResponse = { status: "ERROR" };

    // Yield expected values
    Community.create.throws(Error("Error in the db"));

    // Set request and response
    let req = {
      params: { },
      body: {
        "name": testCommunity2.name
      }
    };
    let res = { json: sinon.stub(), status: sinon.stub() };
    let next = sinon.stub();

    await CommunityRoutes.createCommunity(req, res, next);
    sinon.assert.calledOnce(next);
    sinon.assert.calledOnce(res.json);
    sinon.assert.calledWith(res.json, expectedResponse);
    sinon.assert.calledWith(res.status, 400);
  });

  it("Should delete a community", async function() {
    // Set test community and expected result
    let expectedResponse = { status: "OK" };

    // Yield expected values
    Community.findOneAndRemove.returns(testCommunityDB);

    // Set request and response
    let req = {
      params: {
        "uuid": testCommunity.uuid
      },
      body: { }
    };
    let res = { json: sinon.stub(), status: sinon.stub() };
    let next = sinon.stub();

    await CommunityRoutes.deleteCommunity(req, res, next);
    sinon.assert.calledOnce(next);
    sinon.assert.calledOnce(res.json);
    sinon.assert.calledWith(res.json, expectedResponse);
    sinon.assert.calledWith(Community.findOneAndRemove, { "uuid": testCommunity.uuid });
  });

  it("Should not delete a community if not found", async function() {
    // Set test community and expected result
    let expectedResponse = { status: "Not found" };

    // Yield expected values
    Community.findOneAndRemove.returns(null);

    // Set request and response
    let req = {
      params: {
        "uuid": "not-existing-uuid"
      },
      body: { }
    };
    let res = { json: sinon.stub(), status: sinon.stub() };
    let next = sinon.stub();

    await CommunityRoutes.deleteCommunity(req, res, next);
    sinon.assert.calledOnce(next);
    sinon.assert.calledOnce(res.json);
    sinon.assert.calledWith(res.json, expectedResponse);
    sinon.assert.calledWith(res.status, 404);
    sinon.assert.calledWith(Community.findOneAndRemove, { "uuid": "not-existing-uuid" });
  });

  it("Should update a community", async function() {
    // Set test community and expected result
    let expectedResponse = { status: "OK", data: testCommunity };

    // Yield expected values
    Community.findOneAndUpdate.returns(testCommunityDB);

    // Set request and response
    let req = {
      params: {
        "uuid": testCommunity.uuid
      },
      body: {
        "description": testCommunity.description
      }
    };
    let res = { json: sinon.stub(), status: sinon.stub() };
    let next = sinon.stub();

    await CommunityRoutes.updateCommunity(req, res, next);
    sinon.assert.calledOnce(next);
    sinon.assert.calledOnce(res.json);
    sinon.assert.calledWith(res.json, expectedResponse);
    sinon.assert.calledWith(
      Community.findOneAndUpdate,
      { "uuid": testCommunity.uuid },
      { "description": testCommunity.description }
    );
  });

  it("Should not update a community if not found", async function() {
    // Set test community and expected result
    let expectedResponse = { status: "Not found" };

    // Yield expected values
    Community.findOneAndUpdate.returns(null);

    // Set request and response
    let req = {
      params: {
        "uuid": "not-existing-uuid"
      },
      body: { }
    };
    let res = { json: sinon.stub(), status: sinon.stub() };
    let next = sinon.stub();

    await CommunityRoutes.updateCommunity(req, res, next);
    sinon.assert.calledOnce(next);
    sinon.assert.calledOnce(res.json);
    sinon.assert.calledWith(res.json, expectedResponse);
    sinon.assert.calledWith(res.status, 404);
    sinon.assert.calledWith(Community.findOneAndUpdate, { "uuid": "not-existing-uuid" });
  });

  it("Should not update a community if db error", async function() {
    // Set test community and expected result
    let expectedResponse = { status: "ERROR" };

    // Yield expected values
    Community.findOneAndUpdate.throws(Error("Error in db"));

    // Set request and response
    let req = {
      params: {
        "uuid": testCommunity.uuid,
      },
      body: {
        "description": "invalid description"
      }
    };
    let res = { json: sinon.stub(), status: sinon.stub() };
    let next = sinon.stub();

    await CommunityRoutes.updateCommunity(req, res, next);
    sinon.assert.calledOnce(next);
    sinon.assert.calledOnce(res.json);
    sinon.assert.calledWith(res.json, expectedResponse);
    sinon.assert.calledWith(res.status, 400);
    sinon.assert.calledWith(
      Community.findOneAndUpdate,
      { "uuid": testCommunity.uuid },
      { "description": "invalid description" }
    );
  });

  it("Should not update a community with not updatable fields", async function() {
    // Set test community and expected result
    let expectedResponse = { status: "ERROR" };

    // Set request and response
    let req = {
      params: {
        "uuid": testCommunity.uuid,
      },
      body: {
        "uuid": "different-uuid"
      }
    };
    let res = { json: sinon.stub(), status: sinon.stub() };
    let next = sinon.stub();

    await CommunityRoutes.updateCommunity(req, res, next);
    sinon.assert.calledOnce(next);
    sinon.assert.calledOnce(res.json);
    sinon.assert.calledWith(res.json, expectedResponse);
    sinon.assert.calledWith(res.status, 400);
    sinon.assert.notCalled(Community.findOneAndUpdate);
  });
});
