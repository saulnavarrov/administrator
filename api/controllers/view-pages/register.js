module.exports = {


  friendlyName: 'View register',


  description: 'Display "Register" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/register'
    }

  },


  fn: async function (inputs, exits) {
    let TitlePage = sails.i18n('Register');
    let active = sails.config.custom.registerView;

    // Respond with view.
    return exits.success({
      'active': active,
      'titlePage': TitlePage
    });

  }


};
