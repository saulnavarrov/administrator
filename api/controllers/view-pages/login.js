module.exports = {


  friendlyName: 'View login',


  description: 'Display "Login" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/login'
    }

  },


  fn: async function (inputs, exits) {
    let TitlePage = sails.i18n('Login.title');

    // Respond with view.
    return exits.success({
      'titlePage': TitlePage
    });

  }


};
