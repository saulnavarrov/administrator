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

    if (!rq.session.userId) {
      throw {redirect:'/login'};
    }

    // Respond with view.
    return exits.success({
      'titlePage': TitlePage
    });

  }


};
