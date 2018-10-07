module.exports = {


  friendlyName: 'View login',


  description: 'Display "Login" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/login'
    },

    redirect: {
      responseType: 'redirect',
      description: 'Requesting user is logged in, so redirect to the internal welcome page.'
    }

  },


  fn: async function (inputs, exits) {
    let rq = this.req; // Request Cliente Page
    let TitlePage = sails.i18n('Login.title');

    if (rq.session.userId) {
      throw {redirect:'/'};
    }

    // Respond with view.
    return exits.success({
      'titlePage': TitlePage
    });

  }


};
