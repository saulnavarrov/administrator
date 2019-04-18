/**
 * view-list.js
 *
 * @description :: Mirar abajo la description ► ↓↓↓
 *
 * @src {{proyect}}/api/controllers/customers/view-list.js
 * @author Saul Navarrov <Sinavarrov@gmail.com>
 * @created 2019/04/18
 * @version 1.0
 */

module.exports = {

  friendlyName: 'View List',

  description: `Entrega la pagina de la lista de usuarios clientes (customers)`,

  inputs: {},

  exits: {
    success: {
      viewTemplatePath: 'pages/customers/index',
      description: 'Ingresando al View Dashboard'
    },

    redirect: {
      responseType: 'redirect',
      description: 'Requesting user is logged in, so redirect to the internal welcome page.'
    }
  },

  // Funcionamiento de la accion
  fn: async function (inputs, exits) {
    let rq = this.req; // Request Cliente Page
    let TitlePage = 'Clientes Usuarios (Customers)'; // (I18N) sails.i18n('Dashboard');
    let menu = {
      'l1': 'customers',
      'l2': null,
      'l3': null
    };

    // Verificando Inicio de session.
    if (!rq.session.userId) {
      throw {
        redirect: '/login'
      };
    }

    // Respond with view.
    return exits.success({
      'titlePage': TitlePage,
      'menu': menu
    });
  }
};
