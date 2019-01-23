/**
 * view - dashboard.js
 *
 * @description :: Mirar abajo la description ► ↓↓↓
 *
 * @src {{proyect}}/api/controllers/view-pages/view-dashboard.js
 * @author Saul Navarrov <Sinavarrov@gmail.com>
 * @created 2019/01/23
 * @version 1.0
 */
module.exports = {

  friendlyName: 'View pages view dashboard',

  description: 'Display "Dashboard" page.',

  exits: {
    success: {
      viewTemplatePath: 'pages/view-pages/dashboard'
    },

    redirect: {
      responseType: 'redirect',
      description: 'Requesting user is logged in, so redirect to the internal welcome page.'
    }
  },


  // Funcionamiento de la accion
  fn: async function (inputs, exits) {
    let rq = this.req; // Request Cliente Page
    let TitlePage = sails.i18n('Dashboard');
    let menu = {
      'l1': 'dashboard',
      'l2': null,
      'l3': null
    };

    // Verificando Inicio de session.
    // if (!rq.session.userId) {
    //   throw {redirect:'/login'};
    // }

    // Respond with view.
    return exits.success({
      'titlePage': TitlePage,
      'menu': menu
    });
  }
};
