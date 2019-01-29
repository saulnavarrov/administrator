/**
 * view-confirmed-user-email.js
 *
 * @description :: Mirar abajo la description ► ↓↓↓
 *
 * @src {{proyect}}/api/controllers/users/view-confirmed-user-email.js
 * @author Saul Navarrov <Sinavarrov@gmail.com>
 * @created 2019/01/28
 * @version 1.0
 */
module.exports = {

  friendlyName: 'View confirmed user email',

  description: 'Display "Confirmed user email" page.',

  exits: {
    success: {
      viewTemplatePath: 'pages/users/confirmed-user-email'
    },
    redirect: {
      responseType: 'redirect',
      description: 'Requesting user is logged in, so redirect to the internal welcome page.'
    }
  },

  fn: async function (inputs, exits) {
    /***************************************************************************************
     * VARIABLES INICIALES
     ***************************************************************************************/
    let rq = this.req; // Request Cliente Page
    let userId = rq.session.userId;
    let TitlePage = 'Confirmed Email User';
    let menu = {
      'l1': null,
      'l2': null,
      'l3': null
    };


    /***************************************************************************************
     * BLOQUE DE SEGURIDAD DE USUARIOS HABILITADOS
     ***************************************************************************************/
    // Verificando Inicio de session.
    if (userId) {
      throw {redirect:'/'};
    }


    /***************************************************************************************
     * BLOQUE DE TRABAJO
     ***************************************************************************************/
    // Respond with view.
    return exits.success({
      'titlePage': TitlePage,
      'menu': menu
    });
  }
};
