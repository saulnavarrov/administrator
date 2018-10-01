module.exports = {


  friendlyName: 'Index',


  description: 'Index view pages.',


  inputs: {

  },


  exits: {
    success: {
      statusCode: 200,
      description: 'Requesting user is a guest, so show the public landing page.',
      viewTemplatePath: 'pages/homepage.ejs'
    },
  },


  fn: async function (inputs, exits) {

    sails.log(this.req.session);

    return exits.success();

  }


};
