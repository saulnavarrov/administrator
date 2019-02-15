/**
 * view-list.js
 *
 * @description :: Mirar abajo la description ► ↓↓↓
 *
 * @src {{proyect}}/api/controllers/masters/holding/view-list.js
 * @author Saul Navarrov <Sinavarrov@gmail.com>
 * @created 2019/02/04
 * @version 1.0
 */
module.exports = {

  friendlyName: 'view Lsit',

  description: `Entrega la pagina de la lista de holdigs`,

  inputs: {},

  exits: {
    success: {
      viewTemplatePath: 'pages/masters/holdings/list',
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
    let TitlePage = 'Lista de empresas';
    let menu = {
      'l1': 'masterFul',
      'l2': 'holdings',
      'l3': null
    };


    /***************************************************************************************
     * BLOQUE DE SEGURIDAD DE USUARIOS HABILITADOS
     ***************************************************************************************/
    // Si no es usuario registrado no puede acceder a la pagina y se redirecciona
    if (!userId) {
      throw {
        redirect: '/login'
      };
    }


    // Busco el usuario para verificar si tiene el roll suficiente para  hacer el procedimiento
    let user = await Users.findOne({
      'id': userId
    });
    let autorize = user.role <= 3 ? true : false; // Autorización de usuarios

    // Verifico que usuario tiene pases de seguridad para ver la pagina de lista de usuarios
    if (!autorize) {
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
