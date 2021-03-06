/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also do this by creating a hook.
 *
 * For more information on bootstrapping your app, check out:
 * https://sailsjs.com/config/bootstrap
 */

module.exports.bootstrap = async function(done) {

  // By convention, this is a good place to set up fake data during development.
  //
  // For example:
  // ```
  // // Set up fake development data (or if we already have some, avast)
  // if (await User.count() > 0) {
  //   return done();
  // }
  //
  // await User.createEach([
  //   { emailAddress: 'ry@example.com', fullName: 'Ryan Dahl', },
  //   { emailAddress: 'rachael@example.com', fullName: 'Rachael Shaw', },
  //   // etc.
  // ]);
  // ```
  if (await Users.count() === 0) {
    await Users.createEach([{
      emailAddress: 'sinavarrov@example.com',
      name: 'Saul',
      lastName: 'Navarrov',
      isSuperAdmin: true,
      role: 0,
      identification: '1028004969',
      emailStatus: 'confirmed',
      status: 'E',
      password: await sails.helpers.passwords.hashPassword('Abcd12345')
    },
    {
      emailAddress: 'pruebas2@example.com',
      name: 'Pruebas',
      lastName: 'Twoo',
      isSuperAdmin: false,
      role: 1,
      identification: '1028004960',
      emailStatus: 'confirmed',
      status: 'E',
      password: await sails.helpers.passwords.hashPassword('Abcd12345')
    },  ]);
  }

  // Don't forget to trigger `done()` when this bootstrap function's logic is finished.
  // (otherwise your server will never lift, since it's waiting on the bootstrap)
  return done();

};
