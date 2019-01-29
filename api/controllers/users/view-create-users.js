/**
 * view-registers.js
 *
 * @description :: Mirar abajo la description ► ↓↓↓
 *
 * @src {{proyect}}/api/controllers/users/view-registers.js
 * @author Saul Navarrov <Sinavarrov@gmail.com>
 * @created 2019/01/25
 * @version 1.0
 */
module.exports = {

  friendlyName: 'View Registers',

  description: `Vista de la pagina de registros de nuevos usuarios y su formulario correspondiente`,

  inputs: {
  },

  exits: {
    success: {
      viewTemplatePath: 'pages/users/create-user'
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
    let TitlePage = sails.i18n('Users.new');
    let menu = {
      'l1': 'usuarios',
      'l2': 'new',
      'l3': null
    };


    /***************************************************************************************
     * BLOQUE DE SEGURIDAD DE USUARIOS HABILITADOS
     ***************************************************************************************/
    // Verificando Inicio de session.
    if (!userId) {
      throw {
        redirect: '/'
      };
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
