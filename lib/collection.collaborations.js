
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
      type: Boolean,
      autoform: { label: "" }
  }
});
Collaborations.attachSchema(collaborationSchema);


Schemas = { collaboration: collaborationSchema };

if (Meteor.isClient) {
  Template.registerHelper("Schemas", function() { return Schemas});

  // refreshUserProfileCollaborations
  Collaborations.prototype.from = function (user) {
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
