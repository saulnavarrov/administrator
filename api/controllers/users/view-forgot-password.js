/**
 * view-forgot-password.js
 *
 * @description :: Mirar abajo la description ► ↓↓↓
 *
 * @src {{proyect}}/api/controllers/users/view-forgot-password.js
 * @author Saul Navarrov <Sinavarrov@gmail.com>
 * @created 2019/01/25
 * @version 1.0
 */
module.exports = {

  friendlyName: 'View forgot password',

  description: 'Display "Forgot password" page.',

  exits: {
    success: {
      viewTemplatePath: 'pages/account/forgot'
    }
  },


  fn: async function (inputs, exits) {
    let rq = this.req; // Request Cliente Page
    let TitlePage = sails.i18n('Forgot Password');

    // Verificando Inicio de session.
    if (rq.session.userId) {
      throw {redirect:'/'};
    }

    // Respond with view.
    return exits.success({
      'titlePage': TitlePage
    });
  }
};
