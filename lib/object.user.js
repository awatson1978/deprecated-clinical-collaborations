
// considering replacing the following with socialize:user-model
User = function(){};

// getCollaboration
User.prototype.getCollaborations = function () {
  var user = null;

  if (Meteor.isClient) {
    user = Meteor.user();
  }
  if (Meteor.isServer) {
    if (this.userId){
      user = Meteor.users.findOne({
        _id: this.userId
      });
    }
  }

  if (user){
    if (user.profile){
      if (user.profile.collaborations){
        user.profile.collaborations.push(user.username);
        _.map(getEmailsFor(user), function (em) {
          user.profile.collaborations.push(em);
        });
      } else {
        user.profile.collaborations = [];
      }
    } else {
      return [];
    }
  } else {
    return [];
  }

  return user.profile.collaborations;
};


User.getEmails = function (user) {
  var response = [];

  if (!user){
    user = Meteor.user();
  }

  if (user) {
    if (user.emails){
      _.map(user.emails, function (a) { response.push(a.address); });
    }
    if (user.services && user.services.google && user.services.google.email){
      response.push(user.services.google.email);
    }
    if (response.length === 0){
      return null;
    }

  } else {
    return response;
  }
};
User.getPrimaryEmail = function (user){
  if (!user){
    user = Meteor.user();
  }
  if ( user.emails ){
    return user.emails[ 0 ].address;
  } else {
    return "---";
  }
};



if (Meteor.isServer){

  // refreshUserProfileCollaborations
  User.prototype.getProfileCollaborations = function (user) {
    if (user === null){
      return;
    }
    var emails = getEmailsFor(user);

    var collaborationLookupQueue = emails;
    var collaborationSet = {};

    // transitive closure queue method
    for (var i = 0; i < collaborationLookupQueue.length; i++) {
      var parent = collaborationLookupQueue[ i ];
      Collaborations.find ({collaborators: parent}, {fields: {name:1}}).forEach (function (col) {
        if (!(col.name in collaborationSet)) {
          collaborationSet[ col.name ] = col._id;
          collaborationLookupQueue.push(col.name);
        }
      });
    }

    var collaborations = Object.keys(collaborationSet).sort();
    var ret = Meteor.users.update( user._id, {$set: { "profile.collaborations": collaborations}});
    return collaborations;
  };

}
