module.exports = {


  friendlyName: 'View confirmed user email',


  description: 'Display "Confirmed user email" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages\\users\\confirmed-user-email'
    }

  },


  fn: async function (inputs, exits) {

    // Respond with view.
    return exits.success();

  }


};
