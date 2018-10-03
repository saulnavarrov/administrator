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

    // Respond with view.
    return exits.success({
      'titlePage': TitlePage
    });

  }


};
