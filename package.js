
Package.describe({
  name: 'clinical:collaborations',
  version: '1.1.2',
  summary: 'Collaboration based security architecture (similar to Roles and Friends)',
  git: 'https://github.com/UCSC-MedBook/MedBook-Telescope/tree/master/packages/clinical-collaborations',
  documentation: 'README.md'
});

Package.onUse(function (api) {
  api.versionsFrom('1.2.0.2');
  api.use('meteor-platform@1.2.0');
  api.use([
    'mongo@1.1.0',
    'mongo-livedata@1.0.8',
    'minimongo@1.0.8',
    'accounts-base@1.2.0',
    'accounts-password@1.1.1',
    // 'accounts-base',
    // 'accounts-password',
    'aldeed:simple-schema@1.3.3',
    'aldeed:collection2@2.5.0',
    'grove:less@0.1.1',
    'http@1.1.0',
    'underscore@1.0.3',
    'yasaricli:slugify@0.0.7',
    //'clinical:user-model@0.1.5'
  ], ['client', 'server']);

  api.addFiles([
    'client/subscriptions.js',
  ], ['client']);

  api.addFiles([
    'lib/collection.collaborations.js',
    'lib/extentions.js',
    'lib/object.collaboration.js',
    //'lib/object.user.js'
  ]);

  api.addFiles([
    'server/accounts.js',
    'server/helpers.js',
    'server/methods.js',
    'server/publications.js'
  ], ['server']);


  api.export([
    'Schemas',
    'Collaborations',
    'Collaboration',
    'User'
  ]);
});




Package.onTest(function (api) {
  api.versionsFrom('1.2.0.2');
  api.use('meteor-platform@1.2.2');
  api.use('accounts-base@1.2.0');
  api.use('accounts-password@1.1.1');
  api.use('autopublish@1.0.3');
  api.use('insecure@1.0.3');
  // api.use('accounts-base');
  // api.use('accounts-password');
  api.use('tinytest@1.0.5');
  api.use('clinical:verification');
  // api.use("tulip:munit-helpers");
  api.use('clinical:collaborations');

  api.addFiles('tests/collaborations.js');
});
