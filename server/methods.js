


Meteor.methods({
  // collaboration/create
  'collaboration/create': function ( collaboration ){
    console.log('collaboration/create', collaboration);

    if (Meteor.user()){
      collaboration.slug = slugify(collaboration.name);
      return Collaborations.insert(collaboration);
      // return collaboration.name;
    } else {
      // throw new Meteor.Error(i18n.t('You need to login to add a new collaboration.'));
      // throw new Meteor.Error('You need to login to add a new collaboration.');
      return 'You need to login to add a new collaboration.';
    }

  },
  // collaboration/join
  'collaboration/join': function ( collaborationId ) {
    var me = moi.call(this);

    var col = Collaborations.find({_id: collaborationId });
    if ( isAdminById(this.userId) || ! col.requiresAdministratorApprovalToJoin) {
        Collaborations.update({_id: collaborationId }, { $addToSet: { collaborators:{$each: me} }}, function (err, err2){

        });
        return refreshUserProfileCollaborations(Meteor.users.findOne({_id: this.userId}));
    } else {
        throw new Meteor.Error("requires administrator approval", "You must have administrator approval to join this collaboration.");
    }
  },
  // applyCollaborationMethod
  'collaboration/apply': function ( collaborationId ) {
    console.log('collaboration/apply');
    var cols = moi.call(this);
    console.log('cols', cols);
    Collaborations.update({_id: collaborationId }, { $addToSet: { requests:{$each: cols} }}, function (err, err2){

    });
  },
  // collaboration/leave
  'collaboration/leave': function ( collaborationId ) {
    var cols = moi.call(this);
    Collaborations.update({_id: collaborationId }, { $pull: { collaborators: {$in: cols}, administrators: {$in: cols }}}, function (err, err2){

    });
    refreshUserProfileCollaborations(Meteor.users.findOne({_id: this.userId}));
  }
});
