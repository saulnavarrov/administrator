/**
 * view-confirmed-user-email.js
 * @description :: Mirar abajo la description ► ↓↓↓
 * @author Saul Navarrov <Sinavarrov@gmail.com>
 * @version 1.0
 */
module.exports = {

  friendlyName: 'Users view confirmed user',

  description: 'Entrega de la pagina de que ya ha confirmado el correo electronico al usuario',

  inputs: {},

  exits: {
    success: {
      viewTemplatePath: 'pages/users/confirmed-user-email',
      description: 'Entrega de la pagina'
    }
  },

  fn: async function (inputs, exits) {
    let TitlePage = 'Confirmed Email User';
    let menu = {
      'l1': null,
      'l2': null,
      'l3': null
    };

    return exits.success({
      'titlePage': TitlePage,
      'menu': menu
    });
  }
};
