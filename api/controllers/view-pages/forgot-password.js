module.exports = {


  friendlyName: 'View forgot',


  description: 'Display "Forgot" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/account/forgot'
    }

  },


  fn: async function (inputs, exits) {
    let TitlePage = sails.i18n('Forgot Password');

    // Respond with view.
    return exits.success({
      'titlePage': TitlePage
    });

  }


};
