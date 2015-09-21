
//==========================================================================

Collaboration = function(){};


Collaboration.isTrue = function () {
  return true;
};

//==========================================================================

// getCheckedCollaboration
Collaboration.prototype.getChecked = function (properties) {
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
Collaboration.prototype.getUrl = function (name) {
  return "/collaboration/" + name;
};

Collaboration.prototype.addCollaborator = function (name) {
  return;
};


//==========================================================================

// postSubmitClientCallbacks.push(getCheckedCollaboration);
// postEditClientCallbacks.push(getCheckedCollaboration);

//==========================================================================



if (Meteor.isClient){

  // createCollaboration
  Collaboration.create = function (newCollaboration, callback) {
    console.log('Collaboration.create()');

    var slug = slugify(newCollaboration.name);
    newCollaboration.slug = slug;

    // make sure each of the new entires on the collaboration security objects is trimmed
    var securityDomains = ["collaborators", "administrators", "invitations", "applications"];
    for (var i in securityDomains) {
      var domainName = securityDomains[ i ];

      if (typeof(newCollaboration[ domainName ]) === "string"){
        newCollaboration[ domainName ] = newCollaboration[ domainName ].split(",").map( function (s) {
          return s.trim();
        }).filter( function (n){ return n.length > 0; });
      }
    }

    // add user emails to the collaboration record
    //var emailAddress = User.getEmails()[ 0 ];
    var emailAddress = User.getPrimaryEmail();

    if (newCollaboration && newCollaboration.emailAddressministrators && newCollaboration.emailAddressministrators.indexOf(emailAddress) <= 0){
      newCollaboration.emailAddressministrators.push(emailAddress);
    };
    if (newCollaboration && newCollaboration.collaborators  && newCollaboration.collaborators.indexOf(emailAddress) <= 0){
      newCollaboration.collaborators.push(emailAddress);
    };

    console.log('newCollaboration', newCollaboration);

    // send the record to the server to be saved
    Meteor.call('collaboration/create',
      newCollaboration,
      function (error, result) {
        if (error) {
          console.log('collaboration/create[error]');
          console.log(error);
          // throwError(error.reason);
          // clearSeenErrors();
        }
        if (result){
          console.log('collaboration/create[result]', result);
        }
      }
    );
  };


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
  Collaboration.prototype.doneUpserting = function() {
    $('#addCollaboratorsDialog').remove();
    setTimeout(function() { $('.cover').remove();}, 100);
  };

  // // hideEditOrAddCollaboration
  // Collaboration.prototype.hideUpsert = function() {
  //   $(".collapsed").hide();
  // };

  Collaboration.collabNames = Collaboration.getNames();
}





if (Meteor.isServer){
  Collaboration.prototype.parseCookies = function (cookiesString) {
    var cookies = {};

    cookiesString.split(';').forEach( function ( cookie ) {
      var parts = cookie.split('=');
      cookies[parts.shift().trim()] = decodeURI(parts.join('='));
    });
    return cookies;
  };

  Collaboration.prototype.lookupToken = function (token) {
    var user = Meteor.users.findOne({
      $or: [
        {'services.resume.loginTokens.hashedToken': token},
        {'services.resume.loginTokens.hashedToken': Accounts._hashLoginToken(token)}
      ]
    });
    return user;
  };

  Collaboration.prototype.fetchToken = function (requestHeaders) {
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
