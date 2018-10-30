/**
 * view-register.js
 * @description :: Mirar abajo la description ► ↓↓↓
 * @author Saul Navarrov <Sinavarrov@gmail.com>
 * @version 1.0
 */
module.exports = {

  friendlyName: 'View register',

  description: `Display "Register User New"
  view => Con el cual registramos a nuevos usuarios `,

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

    let rq = this.req; // Request Cliente Page
    let userId = rq.session.userId;
    let TitlePage = sails.i18n('Users.new');
    let menu = {
      'l1': 'usuarios',
      'l2': 'new',
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
