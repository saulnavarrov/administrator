/**
 * view-login.js
 *
 * @description :: Mirar abajo la description ► ↓↓↓
 *
 * @src {{proyect}}/api/controllers/view-pages/view-login.js
 * @author Saul Navarrov <Sinavarrov@gmail.com>
 * @created 2019/01/23
 * @version 1.0
 */
module.exports = {

  friendlyName: 'View login',

  description: 'Display "Login" page.',

  exits: {

    success: {
      viewTemplatePath: 'pages/login',
      description: 'Ingresando al View Login'
    },

    redirect: {
      responseType: 'redirect',
      description: 'Requesting user is logged in, so redirect to the internal welcome page.'
    }
  },


  fn: async function (inputs, exits) {
    let rq = this.req; // Request Cliente Page
    let TitlePage = sails.i18n('Login.title');

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
