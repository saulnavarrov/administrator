module.exports = {


  friendlyName: 'Files clients',


  description: '',


  inputs: {

  },


  exits: {

  },


  fn: async function (inputs, exits) {

    let rq = this.req;

    return exits.success({
      ok: 'ok Data Files',
      params: rq.params
    });

  }


};
