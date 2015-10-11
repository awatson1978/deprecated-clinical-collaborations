var testAccountId = null;

describe('clinical:collaborations', function () {
  beforeAll(function () {
    if (Meteor.isServer) {
      Meteor.users.remove({});
    }
    if (Meteor.isClient) {
      Meteor.users.insert({
        username: "testAccount",
        email: "testAccount@somewhere.net",
        password: "testAccount",
        profile: {
          collaborations: "foo"
        }
      });
    }
  });
  afterEach(function () {
    if (Meteor.isServer) {
      Collaborations.remove({});
    }
  });
  // beforeEach(function () {
  //   if (Meteor.isClient) {
  //     if (Meteor.user()) {
  //       Meteor.logout();
  //     }
  //   }
  // });



  describe('Collaboration - isTrue()', function () {
    it('returns true', function () {
      expect(Collaboration.isTrue()).to.be.true;
    });
  });
  describe('Collaborations - isTrue()', function () {
    it('returns true', function () {
      expect(Collaborations.isTrue()).to.be.true;
    });
  });
  describe('Collaborations - insert()', function () {
    it('returns true', function () {
      expect(Collaborations.find().count()).to.equal(0);
      Collaborations.insert({
        name: "foo",
        isUnlisted: false,
        requiresAdministratorApprovalToJoin: false,
        administrators: [],
        collaborators: []
      });
      expect(Collaborations.find().count()).to.equal(1);

      var collab = Collaborations.findOne({name: "foo"});
      expect(collab.isUnlisted).to.be.false;
      expect(collab.requiresAdministratorApprovalToJoin).to.be.false;
      expect(collab.name).to.equal("foo");
    });
  });
  describe('Collaboration - getUrl()', function () {
    it('returns /collaboration/foo', function () {
      expect(Collaboration.getUrl("foo")).to.equal('/collaboration/foo');
    });
  });
  // describe('Collaboration - addCollaborators()', function () {
  //   it('should add a collaborator to the collaboration', function () {
  //     expect(true).to.be.false;
  //   });
  // });
  // describe('Collaboration - listCollaborator()', function () {
  //   it('should return a list of collaborators', function () {
  //     expect(true).to.be.false;
  //   });
  // });
  // describe('Collaboration - removeCollaborator()', function () {
  //   it('should remove a collaborator', function () {
  //     expect(true).to.be.false;
  //   });
  // });

  describe('User - isTrue()', function () {
    it('should return a list of collaborators', function () {
      expect(User.isTrue()).to.be.true;
    });
  });
  describe('User - getCollaborations()', function () {

    it('should return a list of collaborators', function () {

        // var userCount = Meteor.users.find().count();
        // expect(userCount).to.equal(1);

        var user = Meteor.users.findOne({"username": "testAccount"});
        expect(user).to.exist;
        expect(user.username).to.equal("testAccount");
        // expect(user.profile).to.exist;

      //expect(user.profile.collaborations).to.exist;
      //expect(user.profile.collaborations[ 0 ]).to.equal("foo");
    });
  });
  describe('User - exists()', function () {
    it.client('test account should exist on client', function () {
      expect(Meteor.user()).to.not.exist;
      Meteor.loginWithPassword("testAccount@somewhere.net", "testAccount");
      Meteor.setTimeout(function () {
        expect(Meteor.user()).to.exist;
      }, 1000);
    });
    it.server('test account should exist on server', function () {
      // var user = Meteor.users.findOne({
      //   //username: "testAccount"
      //   _id: testAccountId
      // });
      // var user = Accounts.findUserWithUsername("testAccount");
      var user = Meteor.users.findOne({
        "username": "testAccount"
      });
      expect(user).to.exist;
    });
  });

});
