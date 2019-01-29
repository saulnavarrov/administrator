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
    const rq = this.req; // Request Cliente Page
    let TitlePage = sails.i18n('Forgot Password');
    let userId = rq.session.userId;


    /***************************************************************************************
     * BLOQUE DE SEGURIDAD DE USUARIOS HABILITADOS
     ***************************************************************************************/
    // Verificando Inicio de session.
    if (userId) {
      throw {
        redirect:'/'
      };
    }


    /***************************************************************************************
     * BLOQUE DE TRABAJO
     ***************************************************************************************/

    // Respond with view.
    return exits.success({
      'titlePage': TitlePage
    });
  }
};
