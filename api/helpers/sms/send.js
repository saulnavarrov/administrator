module.exports = {


  friendlyName: 'Send',


  description: 'Send sms.',


  inputs: {

  },


  exits: {

  },


  fn: async function (inputs, exits) {
    var sinchSms = require('sinch-sms')({
      key: '509c68c5-2a5a-4ca2-a2fc-f712c475ec30',
      secret: '6cujkYgSrUe9l5C33jW1Ww=='
    });

    // All done.
    return exits.success();

  }


};

