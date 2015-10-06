
//SimpleSchema.debug = true


Collaborations = new Meteor.Collection("collaborations");

Collaborations.allow({
  insert: function collaborationInsert (id, doc) {
    //console.log("collaborationControl", id, doc);
    return true;
  },
  update: function collaborationUpdate (id, doc) {
    //console.log("collaborationControl", id, doc);
    return true;
  },
  remove: function collaborationRemove (id, doc) {
    //console.log("collaborationControl", id, doc);
    return true;
  }
});


collaborationSchema = new SimpleSchema({
  _id: {
    type: String,
    optional: true
  },
  slug: {
    type: String,
    optional: true
  },
  isUnlisted: {
    type: Boolean
  },
  name: {
    type: String,
    optional: true,
    unique: true
  },
  description: {
    type: String,
    optional: true
  },
  collaborators: {
    type: [String]
  },
  administrators: {
    type: [String]
  },
  invitations: {
    type: [String],
    optional: true
  },
  requests: {
    type: [String],
    optional: true
  },
  requiresAdministratorApprovalToJoin: {
    type: Boolean
  }
});
Collaborations.attachSchema(collaborationSchema);


Schemas = { collaboration: collaborationSchema };

if (Meteor.isClient) {
  Template.registerHelper("Schemas", function() { return Schemas});

  // refreshUserProfileCollaborations
  Collaborations.from = function (user) {
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

  // createCollaboration
  Collaborations.create = function (newCollaboration, callback) {
    console.log('Collaboration.create()');

    var slug = slugify(newCollaboration.name);
    newCollaboration.slug = slug;

    //Collaboration.addAdministrators(newCollaboration.administratorsString);
    //Collaboration.addCollaborators(newCollaboration.collaboratorsString);

    // console.log('newCollaboration', newCollaboration);
    //
    // // make sure each of the new entires on the collaboration security objects is trimmed
    // var securityDomains = ["collaborators", "administrators", "invitations", "applications"];
    // for (var i in securityDomains) {
    //   var domainName = securityDomains[ i ];
    //
    //   if (typeof(newCollaboration[ domainName ]) === "string"){
    //     newCollaboration[ domainName ] = newCollaboration[ domainName ].split(",").map( function (s) {
    //       return s.trim();
    //     }).filter( function (n){ return n.length > 0; });
    //   }
    // }
    //


    // // add user emails to the collaboration record
    // //var emailAddress = User.getEmails()[ 0 ];
    // var emailAddress = User.getPrimaryEmail();
    //
    // if (newCollaboration && newCollaboration.administrators && newCollaboration.administrators.indexOf(emailAddress) <= 0){
    //   newCollaboration.administrators.push(emailAddress);
    // };
    // if (newCollaboration && newCollaboration.collaborators  && newCollaboration.collaborators.indexOf(emailAddress) <= 0){
    //   newCollaboration.collaborators.push(emailAddress);
    // };

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


}
