/**
 * view-list.js
 * @description :: Mirar abajo la description ► ↓↓↓
 * @author Saul Navarrov <Sinavarrov@gmail.com>
 * @version 1.0
 */
module.exports = {


  friendlyName: 'View list',


  description: 'Display "List" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/masters/banks/list'
    },

    redirect: {
      responseType: 'redirect',
      description: 'Requesting user is logged in, so redirect to the internal welcome page.'
    }

  },


  fn: async function (inputs, exits) {

    let rq = this.req; // Request Cliente Page
    let userId = rq.session.userId;
    let TitlePage = 'Bancos'; // sails.i18n('Users');
    let menu = {
      'l1': 'masterFul',
      'l2': 'banks',
      'l3': null
    };

    // Si no es usuario registrado no puede acceder a la pagina y se redirecciona
    if (!userId) {
      throw {redirect:'/login'};
    }

    // Busco el usuario para verificar si tiene el roll suficiente para  hacer el procedimiento
    let user = await User.findOne({'id': userId});
    let autorize = user.role <= 2 ? true : false; // Autorización de usuarios

    // Verifico que usuario tiene pases de seguridad para crear el nuevo usuario
    // para ver esta pagina
    if(!autorize){
      throw {redirect:'/'};
    }

    // Respond with view.
    return exits.success({
      'titlePage': TitlePage,
      'menu': menu
    });

  }


};
