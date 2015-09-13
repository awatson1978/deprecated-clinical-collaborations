
MedBookPost = function(post,userId) {
  // ------------------------------ Properties ------------------------------ //

  // Basic Properties

  //console.log("MedBookPost()", userId, post);
  if (userId == null){
    return null;
  }


  // ------------------------------ Insert Post ----------------------- //
  post._id = Posts.insert(post);

  // ------------------------------ MedBook Post Files ----------------------- //
  if (post.blobs && post.blobs.length >0)
      for (var i = 0; i < post.blobs.length; i++)  {
          var fid = post.blobs[i];
          FileUploadCollection.update({"_id": new Meteor.Collection.ObjectID(fid)}, { "$set" : { "postId" : post._id } }, function (err, response) {
        	console.log('update returns err', err, 'response', response)
        })
      }


  // ------------------------------ Callbacks ------------------------------ //

  // run all post submit server callbacks on post object successively
  post = postAfterSubmitMethodCallbacks.reduce(function(result, currentFunction) {
      return currentFunction(result);
  }, post);

  // ------------------------------ Post-Insert ------------------------------ //

  // increment posts count
  Meteor.users.update({_id: userId}, {$inc: {postCount: 1}});
  var postAuthor =  Meteor.users.findOne({_id:post.userId});
  Meteor.call('upvotePost', post, postAuthor);
  return post._id;
};

moi = function() {
    var user;
    if (Meteor.isClient)
        user = Meteor.user();
    else
        user = Meteor.users.findOne({_id: this.userId});
    var cols = [];
    if (user) {
        cols.push(user.username);
        _.map( getEmails(), function(em) { cols.push(em);});
    }

    return cols;
}





// MedBookPost = function(post,userId) {
//   // ------------------------------ Properties ------------------------------ //
//
//   // Basic Properties
//
//   //console.log("MedBookPost()", userId, post);
//   if (userId == null){
//     return null;
//   }
//
//
//   // ------------------------------ Insert Post ----------------------- //
//   post._id = Posts.insert(post);
//
//   // ------------------------------ MedBook Post Files ----------------------- //
//   if (post.blobs && post.blobs.length >0)
//       for (var i = 0; i < post.blobs.length; i++)  {
//           var fid = post.blobs[i];
//           FileUploadCollection.update({"_id": new Meteor.Collection.ObjectID(fid)}, { "$set" : { "postId" : post._id } }, function (err, response) {
//         	console.log('update returns err', err, 'response', response)
//         })
//       }
//
//
//   // ------------------------------ Callbacks ------------------------------ //
//
//   // run all post submit server callbacks on post object successively
//   post = postAfterSubmitMethodCallbacks.reduce(function(result, currentFunction) {
//       return currentFunction(result);
//   }, post);
//
//   // ------------------------------ Post-Insert ------------------------------ //
//
//   // increment posts count
//   Meteor.users.update({_id: userId}, {$inc: {postCount: 1}});
//   var postAuthor =  Meteor.users.findOne({_id:post.userId});
//   Meteor.call('upvotePost', post, postAuthor);
//   return post._id;
// };
//
// moi = function() {
//     var user;
//     if (Meteor.isClient)
//         user = Meteor.user();
//     else
//         user = Meteor.users.findOne({_id: this.userId});
//     var cols = [];
//     if (user) {
//         cols.push(user.username);
//         _.map( getEmails(), function(em) { cols.push(em);});
//     }
//
//     return cols;
// }
//
//
//
// refreshUserProfileCollaborations = function(user) {
//     if (user == null)
//         return;
//     var emails = getEmailsFor(user);
//
//     var collaborationLookupQueue = emails;
//     var collaborationSet = {};
//
//     // transitive closure queue method
//     for (var i = 0; i < collaborationLookupQueue.length; i++) {
//         var parent = collaborationLookupQueue[i];
//         Collaborations.find({collaborators: parent}, {fields: {name:1}}).forEach(function(col) {
//             if (!(col.name in collaborationSet)) {
//                 collaborationSet[col.name] = col._id;
//                 collaborationLookupQueue.push(col.name);
//             }
//         });
//     }
//
//     var collaborations = Object.keys(collaborationSet).sort();
//     ret = Meteor.users.update( user._id, {$set: { "profile.collaborations": collaborations}});
//     return collaborations;
// }
