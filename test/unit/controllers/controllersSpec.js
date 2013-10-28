//
// test/unit/controllers/controllersSpec.js
//
describe("Unit: Testing Controllers", function() {

  beforeEach(angular.mock.module('App'));

  it('should have a MainCntl controller', function() {
    expect(App.MainCntl).not.to.equal(null);
  });

  it('should have a HomeCntl controller', function() {
    expect(App.HomeCntl).not.to.equal(null);
  });

});
