module.exports = {


  friendlyName: 'View dashboard',


  description: 'Display "Dashboard" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/dashboard/dashboard'
    }

  },


  fn: async function (inputs, exits) {
    let TitlePage = sails.i18n('Dashboard');

    // Respond with view.
    return exits.success({
      'titlePage': TitlePage
    });

  }


};
