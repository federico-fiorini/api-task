import assert from "assert";
import { expect } from 'chai';
import Community from '../src/models/communityModel';

// Set test community
var testCommunity = {
  uuid: "cd17d160-c3a1-11e6-b5ea-270f32f3a33a",
  name: "The test community",
  description: "A community to test the mongodb model",
  slug: "the-test-community"
}

// Unit tests for community model
describe('community', () => {
    it('should be invalid if name is empty', function(done) {
        var comm = new Community({
          uuid: testCommunity.uuid,
          description: testCommunity.description,
          slug: testCommunity.slug
        });

        comm.validate(function(err) {
            expect(err.errors.name).to.exist;
            done();
        });
    });

    it('should be invalid if description is empty', function(done) {
        var comm = new Community({
          uuid: testCommunity.uuid,
          name: testCommunity.name,
          slug: testCommunity.slug
        });

        comm.validate(function(err) {
            expect(err.errors.description).to.exist;
            done();
        });
    });

    it('should be invalid if slug is empty', function(done) {
        var comm = new Community({
          uuid: testCommunity.uuid,
          name: testCommunity.name,
          description: testCommunity.description
        });

        comm.validate(function(err) {
            expect(err.errors.slug).to.exist;
            done();
        });
    });

    it('should be invalid if uuid is empty', function(done) {
        var comm = new Community({
          name: testCommunity.name,
          description: testCommunity.description,
          slug: testCommunity.slug
        });

        comm.validate(function(err) {
            expect(err.errors.uuid).to.exist;
            done();
        });
    });

    it('should be invalid if name is longer than 100 chars', function(done) {
        var comm = new Community({
          uuid: testCommunity.uuid,
          name: 'a'.repeat(101),
          description: testCommunity.description,
          slug: testCommunity.slug
        });

        comm.validate(function(err) {
            expect(err.errors.name).to.exist;
            done();
        });
    });

    it('should be invalid if description is longer than 200 chars', function(done) {
        var comm = new Community({
          uuid: testCommunity.uuid,
          name: testCommunity.name,
          description: 'a'.repeat(201),
          slug: testCommunity.slug
        });

        comm.validate(function(err) {
            expect(err.errors.description).to.exist;
            done();
        });
    });

    it('should be valid if all fields are provided (and valid)', function(done) {
        var comm = new Community({
          uuid: testCommunity.uuid,
          name: testCommunity.name,
          description: testCommunity.description,
          slug: testCommunity.slug
        });

        comm.validate(function(err) {
            expect(err).to.not.exist;
            done();
        });
    });
});


// describe("Test template", () => {
//   it("should pass", () => {
//     assert.equal(2 + 2, 4);
//   });
// });
