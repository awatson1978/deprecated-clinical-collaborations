clinical:collaborations
======================================

Collaboration based security architecture (similar to Roles and Friends)

========================================
#### Installation  

````
meteor add clinical:collaborations
````


========================================
#### Collaboration Schema

````js
{
  _id: { type: String, optional: true },
  slug: { type: String, optional: true },
  isUnlisted: { type: Boolean },
  name: { type: String, optional: true, unique: true },
  description: { type: String, optional: true },
  collaborators: { type: [String] },
  administrators: { type: [String] },
  invitations: { type: [String], optional: true },
  requests: { type: [String], optional: true },
  requiresAdministratorApprovalToJoin: { type: Boolean, autoform: { label: "" } }
}
````

========================================
#### Collaboration Object

````js
  Collaboration.get();
  Collaboration.getChecked(properties);
  Collaboration.getChecked(getUrl);

  // client
  Collaboration.create();
  Collaboration.getNames();
  Collaboration.upsertCompleted();
  Collaboration.upsertFinished();

  // server
  Collaboration.parseCookies();
  Collaboration.lookupToken();
  Collaboration.fetchToken();
````


========================================
#### Server Methods

````js
  Meteor.call('/collaboration/create');
  Meteor.call('/collaboration/join');
  Meteor.call('/collaboration/apply');
  Meteor.call('/collaboration/leave');
````


========================================
#### Licensing  

MIT.  Use as you will.  
