module.exports = {


  friendlyName: 'Send',


  description: 'Send sms.',


  inputs: {

  },


  exits: {

  },


  fn: async function (inputs, exits) {
    var sinchSms = require('sinch-sms')({
      key: sails.config.custom.sinch.key,
      secret: sails.config.custom.sinch.secret
    });

    // All done.
    return exits.success();

  }


};

