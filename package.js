
Package.describe({
  name: 'clinical:collaborations',
  version: '1.1.0',
  summary: 'Collaboration based security architecture (similar to Roles and Friends)',
  git: 'https://github.com/UCSC-MedBook/MedBook-Telescope/tree/master/packages/clinical-collaborations',
  documentation: 'README.md'
});

Package.onUse(function (api) {

  api.use([
    'meteor-platform@1.0.4',
    'accounts-base@1.2.0',
    'aldeed:simple-schema@1.3.3',
    'aldeed:collection2@2.5.0',
    'less@1.0.14',
    'http@1.1.0',
    'underscore@1.0.3',
    'clinical:verification@3.0.0',
    'yasaricli:slugify@0.0.7'
  ], ['client', 'server']);

  api.addFiles([
    'client/subscriptions.js',
  ], ['client']);

  api.addFiles([
    'lib/collection.collaborations.js',
    'lib/extentions.js',
    'lib/object.collaboration.js',
    'lib/object.user.js'
  ], ['client', 'server']);

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
  api.use('tinytest');
  api.use('clinical:verification');
  api.use('clinical:collaborations');

  api.addFiles('tests/collaborations.js');
});
