module.exports = {


  friendlyName: 'Avatars',


  description: 'Entrega el archivo al usuario que lo pide.',


  inputs: {

  },


  exits: {

  },


  fn: async function (inputs, exits) {
    var mfs = require('machinepack-fs');
    let rq = this.req;
    let rs = this.res;

    // Parametros de ingresos
    let img = rq.params[0]; // Imagen que se buscara
    let uif = rq.query.uif; // id para entregar el archivo
    let tfk = rq.query.tfk; // micro token para entregar el archivo

    console.log({
      i: img,
      u: uif,
      t: tfk
    });

    // Archivo que se va a servir
    let fileTemp = `${sails.config.appPath}/uploads/avatars/${img}`;

    return rs.sendFile(fileTemp);
    // return exits.success();

  }


};
