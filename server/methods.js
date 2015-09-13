


Meteor.methods({
  // createCollaborationMethod
  'collaboration/create': function(collaboration){
    if (!Meteor.user()){
      throw new Meteor.Error(i18n.t('You need to login to add a new collaboration.'));
    }

    collaboration.slug = slugify(collaboration.name);

    Collaborations.insert(collaboration);
    return collaboration.name;
  },
  // joinCollaborationMethod
  'collaboration/join': function(collaboration_id) {
    var me = moi.call(this);

    var col = Collaborations.find({_id: collaboration_id});
    if ( isAdminById(this.userId) || ! col.requiresAdministratorApprovalToJoin) {
        Collaborations.update({_id: collaboration_id}, { $addToSet: { collaborators:{$each: me} }}, function (err, err2){
            }
        );
        return refreshUserProfileCollaborations(Meteor.users.findOne({_id: this.userId}));
    } else {
        throw new Meteor.Error("requires administrator approval", "You must have administrator approval to join this collaboration.");
    }
  },
  // applyCollaborationMethod
  'collaboration/apply': function(collaboration_id) {
    var cols = moi.call(this);
    Collaborations.update({_id: collaboration_id}, { $addToSet: { requests:{$each: cols} }}, function (err, err2){

    });
  },
  // leaveCollaborationMethod
  'collaboration/leave': function(collaboration_id) {
    var cols = moi.call(this);
    Collaborations.update({_id: collaboration_id}, { $pull: { collaborators: {$in: cols}, administrators: {$in: cols }}}, function (err, err2){

    });
    refreshUserProfileCollaborations(Meteor.users.findOne({_id: this.userId}));
  }
});
