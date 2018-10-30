/**
 * files-clients.js
 * @description :: Mirar abajo la description ► ↓↓↓
 * @author Saul Navarrov <Sinavarrov@gmail.com>
 * @version 1.0
 */
module.exports = {


  friendlyName: 'Files clients',


  description: '',


  inputs: {

  },


  exits: {

  },


  fn: async function (inputs, exits) {

    let rq = this.req;

    // Funcion para obtener la extencion de los archivos
    // filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
    //

    return exits.success({
      ok: 'ok Data Files',
      params: rq.params
    });

  }


};
