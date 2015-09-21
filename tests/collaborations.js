
var foo = new Collaboration();

describe('Clinical:Collaborations', function () {
  describe('Collaboration.isTrue', function () {
    it.client('returns true on client', function () {
      expect(Collaboration.isTrue()).to.be.true;
    });
    it.server('retrusn true on server', function () {
      expect(Collaboration.isTrue()).to.be.true;
    });
  });
});
