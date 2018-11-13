module.exports = {

  friendlyName: 'View contact',

  description: 'Display "Contact" page.',

  exits: {

    success: {
      viewTemplatePath: 'pages/contact'
    }
  },

  fn: async function (inputs, exits) {
    let TitlePage = 'Contacteme';
    let menu = {
      'l1': null,
      'l2': null,
      'l3': null
    };

    // Respond with view.
    return exits.success({
      'titlePage': TitlePage,
      'menu': menu
    });

  }
};
