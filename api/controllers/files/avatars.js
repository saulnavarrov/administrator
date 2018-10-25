module.exports = {


  friendlyName: 'Avatars',


  description: 'Entrega el archivo al usuario que lo pide.',


  inputs: {

  },


  exits: {
    unauthorized: {
      responseType: 'unauthorized',
      description: 'No autorizado para ver los resultados de la pagina'
    }
  },


  fn: async function (inputs, exits) {
    let _ = require('@sailshq/lodash');
    let mfs = require('machinepack-fs');
    let rq = this.req;
    let rs = this.res;
    let userId = rq.session.userId;
    let fileTemp = '';

    // Verificando Session del usuario
    if (!userId) {
      throw 'unauthorized';
    }

    // Parametros de ingresos
    let exf = rq.query.exf;
    let uif = rq.query.uif; // id para entregar el archivo
    let tfk = rq.query.tfk; // micro token para entregar el archivo
    let img = rq.params[0]; // Imagen que se buscara

    if (!_.isUndefined(exf) && !_.isUndefined(img) && !_.isUndefined(uif) && !_.isUndefined(tfk)) {
      // Buscando el archivo en la base de datos
      let fileFind = await UploadFiles.findOne({
        filename: img,
        uif: uif,
        tfk: tfk,
        exf: exf,
        active: true
      });

      // Verifica que si hay datos en UploadFiles
      if (!_.isUndefined(fileFind)) {
        // Devuelve el archivo si lo encuentra en el Disk
        mfs.exists({
          path: fileFind.fd
        }).exec((rErr, result) => {
          // en caso de error
          if (rErr) {
            fileTemp = `${sails.config.appPath}/assets/images/imagenNoEncontrada.jpg`;
            console.log(rErr);
            return rs.sendFile(fileTemp);
          }

          // Devuelve el archivo si existe
          if (result) {
            fileTemp = fileFind.fd;
            return rs.sendFile(fileTemp);
          }else{
            // Entrega un archivo en caso de no encontrarlo
            fileTemp = `${sails.config.appPath}/assets/images/imagenNoEncontrada.jpg`;
            return rs.sendFile(fileTemp);
          }
        });
      }else{
        fileTemp = `${sails.config.appPath}/assets/images/imagenNoEncontrada.jpg`;
        return rs.sendFile(fileTemp);
      }
    }else{
      rs.status(404);
      return rs.json({
        error: true,
        message: 'Not Found'
      });
    }
  }
};
