/**
 * view-list.js
 *
 * @description :: Mirar abajo la description ► ↓↓↓
 *
 * @src {{proyect}}/api/controllers/users/view-list.js
 * @author Saul Navarrov <Sinavarrov@gmail.com>
 * @created 2019/01/25
 * @version 1.0
 */
module.exports = {

  friendlyName: 'View list',

  description: 'Display "List" page.',

  exits: {
    success: {
      viewTemplatePath: 'pages/users/list'
    }
  },


  fn: async function (inputs, exits) {
    /***************************************************************************************
     * VARIABLES INICIALES
     ***************************************************************************************/
    let rq = this.req; // Request Cliente Page
    let userId = rq.session.userId;
    let TitlePage = sails.i18n('Users');
    let menu = {
      'l1': 'usuarios',
      'l2': 'users',
      'l3': null
    };


    /***************************************************************************************
     * BLOQUE DE SEGURIDAD DE USUARIOS HABILITADOS
     ***************************************************************************************/
    // Si no es usuario registrado no puede acceder a la pagina y se redirecciona
    if (!userId) {
      throw {redirect:'/login'};
    }

    // Busco el usuario para verificar si tiene el roll suficiente para  hacer el procedimiento
    let user = await Users.findOne({'id': userId});
    let autorize = user.role <= 3 ? true : false; // Autorización de usuarios

    // Verifico que usuario tiene pases de seguridad para crear el nuevo usuario
    // para ver esta pagina
    if(!autorize){
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
