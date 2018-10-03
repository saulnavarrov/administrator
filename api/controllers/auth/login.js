module.exports = {

  friendlyName: 'View login',


  description: 'Display "Login" page.',


  exits: {

    // success: {
    //   // responseType: 'view',
    //   // viewTemplatePath: 'pages/login'
    // }

  },


  fn: async function (inputs, exits) {

    // Respond with view.
    return exits.success({code: 200, messages: 'salida de imagen'});

  }


};
