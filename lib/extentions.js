// // collaboration post list parameters
// viewParameters.collaboration = function (terms) {
//   return {
//     find: { "collaboration": terms.collaboration },
//     options: {sort: {sticky: -1, postedAt: -1}}
//   };
// };
//
// // push "collaboration" modules to postHeading
// postHeading.push({
//   template: 'collaborationTagList',
//   order: 3
// });
//
// // push "collaborationMenu" template to primaryNav
// primaryNav.push('collaborationMenu');
//
//
// if (Meteor.isClient){
//
//   preloadSubscriptions.push('collaboration');
//
//
//   // after submitting a post, look through each of the selected items from the dropdown,
//   // make sure the collaboration record exists, and check that my email is a member of the collection
//
//   postSubmitClientCallbacks.push(function (properties) {
//     var data = $('.selectCollaborators').select2("data");
//     var dataIds = data.map(function (d) {
//       return d.id;
//     });
//     for (var i = 0; i < dataIds.length; i++) {
//       var d = dataIds[ i ];
//       if (d.indexOf("@")){
//         continue;
//       }
//       if (Collabortion.findOne({name: d})){
//         continue;
//       }
//       var user = Meteor.users.findOne({
//         username: d
//       });
//       if (user) {
//         if (user.emails)
//           dataIds[i] = user.emails && user.emails[0].address;
//         else if (user.services && user.services.google && user.services.google.email)
//           dataIds[i] = user.services.google.email;
//       }
//     }
//     var me = getEmails()[0];
//     if (dataIds.indexOf(me) < 0)
//       dataIds.push(me);
//
//     properties.collaboration = dataIds;
//     return properties;
//   });
// }
