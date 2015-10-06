
//==========================================================================

Collaboration = {
  administrators: [],
  collaborators: [],
  invitations: [],
  requests: []
};



Collaboration.isTrue = function () {
  return true;
};
Collaboration.parse = function (collaboratorsInputString) {
  var collaboratorsArray = collaboratorsInputString.split(",");
  collaboratorsArray.forEach(function (emailAddress){
    emailAddress.trim();
  });
  return collaboratorsArray;
};
//==========================================================================

// getCheckedCollaboration
Collaboration.getSelected = function (properties) {
  properties.collaboration = [];
  $(".selectCollaborators").select2("val").map(function (name) {
    properties.collaboration.push(name);
  });
  if (properties.collaboration === []) {
    properties.collaboration = ["public"];
  }
  return properties;
};
// getCollaborationUrl
Collaboration.getUrl = function (name) {
  return "/collaboration/" + name;
};

//==========================================================================

Collaboration.removeCollaborator = function (emailAddress) {
  this.collaborators.pop(collaborators.indexOf(emailAddress));
};
Collaboration.addCollaborator = function (emailAddress) {
  this.collaborators.push(emailAddress);
};
Collaboration.addCollaborators = function (collaboratorsInputString) {
  var collaboratorsArray = collaboratorsInputString.split(",");
  collaboratorsArray.forEach(function (emailAddress){
    emailAddress.trim();
    Collaboration.addCollaborator(emailAddress);
  });
};
Collaboration.listCollaborator = function (user) {
  var collaboratorsSet = [];
  this.collaborators.forEach(function (username){
    collaboratorsSet.push(Meteor.findOne(username));
  });
  return collaboratorsSet;
};
Collaboration.addAdministrator = function (emailAddress) {
  this.administrators.push(emailAddress);
};
Collaboration.addAdministrators = function (administratorsInputString) {
  var administratorsArray = administratorsInputString.split(",");
  administratorsArray.forEach(function (emailAddress){
    emailAddress.trim();
    Collaboration.addAdministrator(emailAddress);
  });
};
Collaboration.removeAdministrator = function (emailAddress) {
  this.administrators.pop(administrators.indexOf(emailAddress));
};
Collaboration.listAdministrator = function (user) {
  var administratorsSet = [];
  this.administrators.forEach(function (username){
    administratorsSet.push(Meteor.findOne(username));
  });
  return administratorsSet;
};


//==========================================================================

// postSubmitClientCallbacks.push(getCheckedCollaboration);
// postEditClientCallbacks.push(getCheckedCollaboration);

//==========================================================================



if (Meteor.isClient){




  // collabNames
  Collaboration.getNames = function () {
    var users = Meteor.users.find({}, {fields: {username:1}}).fetch();
    var cols = Collaborations.find({}, {fields: {name:1}}).fetch();
    var names = users.map( function (f){ return f.username; }).concat(cols.map( function (f){ return f.name; }));
    names = names.filter( function (f) { return f && f.length > 0; });
    names.push("public");
    var data = names.map( function (f) { return {id: f, text:f }; });
    return data;
  };


  // doneEditOrAddCollaborators
  Collaboration.doneUpserting = function() {
    $('#addCollaboratorsDialog').remove();
    setTimeout(function() { $('.cover').remove();}, 100);
  };

  // // hideEditOrAddCollaboration
  // Collaboration.hideUpsert = function() {
  //   $(".collapsed").hide();
  // };

  Collaboration.collabNames = Collaboration.getNames();
}





if (Meteor.isServer){
  Collaboration.parseCookies = function (cookiesString) {
    var cookies = {};

    cookiesString.split(';').forEach( function ( cookie ) {
      var parts = cookie.split('=');
      cookies[parts.shift().trim()] = decodeURI(parts.join('='));
    });
    return cookies;
  };

  Collaboration.lookupToken = function (token) {
    var user = Meteor.users.findOne({
      $or: [
        {'services.resume.loginTokens.hashedToken': token},
        {'services.resume.loginTokens.hashedToken': Accounts._hashLoginToken(token)}
      ]
    });
    return user;
  };

  Collaboration.fetchToken = function (requestHeaders) {
    var token = null;
    if (requestHeaders && requestHeaders.cookie && requestHeaders.cookie.length > 0) {
      var cookie = parseCookies(requestHeaders.cookie);

      if (cookie && 'meteor_login_token' in cookie && cookie[ 'meteor_login_token' ].length > 0){
        token = cookie[ 'meteor_login_token' ];
      }
    }
    return token;
  };

}
