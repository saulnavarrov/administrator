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
  // By convention, this is a good place to set up fake data during development.
  if (await User.count() === 0) {
    await User.createEach([{
      emailAddress: 'sinavarrov@gmail.com',
      name: 'Saul',
      lastName: 'Navarrov',
      isSuperAdmin: true,
      role: 0,
      identification: '1028004969',
      password: await sails.helpers.passwords.hashPassword('Abcd1234')
    }, ]);
  }

  // Cuenta de banco
  // if (await BankAccounts.count() === 0) {
  //   await BankAccounts.createEach([
  //     {
  //       nombrePersonalizado: 'Primera Cuenta',
  //       nunCuenta: '00000000000',
  //       fechaApertura: 1514782800,
  //       fechaVencimiento: 1672462800,
  //       saldo: 00,
  //       tipoCuenta: 'CA',
  //       nameTypeAcount: 'Cuenta Ahorros'
  //     },
  //   ]);
  // }

  // Holding 1
  // if (await Holdings.count() === 0) {
  //   await Holdings.createEach([
  //     {
  //       reasonName: 'UNION EMPRESARIAL COLOMBIANA S.A.S',
  //       enrollment: 44509712,
  //       identificación: 900420838,
  //       consecutive: 0,
  //       state: 'A',
  //       renewedDate: '2020',
  //       createdDate: '2019-01-01',
  //       acronym: 'UNIEMPRESAS S.A.S',
  //       location: 'Medellin',
  //       maxCustomersEps: 200,
  //       maxCustomersArl: 200,
  //       maxCustomersCaja: 200,
  //       maxCustomersAfp: 200,
  //       balance: 0
  //     }
  //   ]);
  // }

  // ```

  // Don't forget to trigger `done()` when this bootstrap function's logic is finished.
  // (otherwise your server will never lift, since it's waiting on the bootstrap)
  return done();

};
