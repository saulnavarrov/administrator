module.exports = {


  friendlyName: 'View dashboard',


  description: 'Display "Dashboard" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/dashboard/dashboard'
    },

    redirect: {
      responseType: 'redirect',
      description: 'Requesting user is logged in, so redirect to the internal welcome page.'
    }

  },


  fn: async function (inputs, exits) {
    let rq = this.req; // Request Cliente Page
    let TitlePage = sails.i18n('Dashboard');
    let menu = {
      'l1': 'dashboard',
      'l2': null,
      'l3': null
    };

    // Send "confirm account" email
    // await sails.helpers.sendTemplateEmail.with({
    //   to: 'sinavarrov@gmail.com',
    //   subject: 'Verificacion de E-mail Nuevo',
    //   template: 'email-verify-account',
    //   templateData: {
    //     fullName: 'Saul Navarro Villadiego',
    //     token: 'token de la pagina entrega para nuevos datos'
    //   }
    // });


    if (!rq.session.userId) {
      throw {redirect:'/login'};
    }

    // Respond with view.
    return exits.success({
      'titlePage': TitlePage,
      'menu': menu
    });

  }


};
