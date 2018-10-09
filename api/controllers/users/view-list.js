module.exports = {


  friendlyName: 'View list',


  description: 'Display "List" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/users/list'
    },

    redirect: {
      responseType: 'redirect',
      description: 'Requesting user is logged in, so redirect to the internal welcome page.'
    }

  },


  fn: async function (inputs, exits) {

    let rq = this.req; // Request Cliente Page
    let userId = rq.session.userId;
    let TitlePage = sails.i18n('Users');
    let menu = {
      'l1': 'usuarios',
      'l2': 'users',
      'l3': null
    };

    // Si no es usuario registrado no puede acceder a la pagina y se redirecciona
    if (!userId) {
      throw {redirect:'/login'};
    }

    // Busco el usuario para verificar si tiene el roll suficiente para  hacer el procedimiento
    let user = await User.findOne({'id': userId});
    let autorize = user.role <= 3 ? true : false; // Autorización de usuarios

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
