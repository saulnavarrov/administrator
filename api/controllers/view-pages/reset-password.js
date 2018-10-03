module.exports = {


  friendlyName: 'View reset',


  description: 'Display "Reset" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/account/reset'
    }

  },


  fn: async function (inputs, exits) {
    let TitlePage = sails.i18n('Reset Password');

    // Respond with view.
    return exits.success({
      'titlePage': TitlePage
    });

  }


};
