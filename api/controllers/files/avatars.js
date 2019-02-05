/**
 * avatars.js
 * @description :: Mirar abajo la description ► ↓↓↓
 * @author Saul Navarrov <Sinavarrov@gmail.com>
 * @version 1.0
 */
module.exports = {

  friendlyName: 'Avatars',

  description: `Entrega el archivo al usuario que lo pide.
    Entregara los archivos imagenes 'avatars' de los diferentes
    usuarios, de manera dinamica, caso tal de que no tenga que recargar la pagina
    y borrar el cache para recargarlo, solo accesible para usuarios identificados
    y con parametros estrictos.`,

  inputs: {},

  exits: {
    unauthorized: {
      responseType: 'unauthorized',
      description: 'No autorizado para ver los resultados de la pagina'
    }
  },

  fn: async function (inputs, exits) {
    /***************************************************************************************
     * VARIABLES INICIALES
     ***************************************************************************************/
    let _ = require('@sailshq/lodash');
    let mfs = require('machinepack-fs');
    let rq = this.req;
    let rs = this.res;
    let userId = rq.session.userId;
    let fileTemp = '';
    let imageNotFound = `${sails.config.appPath}/assets/images/imagenNoEncontrada.jpg`; // Archivo statico cuando no se encuentra la imagen


    /***************************************************************************************
     * BLOQUE DE SEGURIDAD DE USUARIOS HABILITADOS
     ***************************************************************************************/
    // Verificando Session del usuario
    if (!userId) {
      throw 'unauthorized';
    }


    /***************************************************************************************
     * BLOQUE DE DATOS OBLIGATORIOS Y REVISION DE DATA.
     ***************************************************************************************/
    // Parametros de ingresos
    let exf = rq.query.exf; // Extension del archivo
    let uif = rq.query.uif; // id para entregar el archivo
    let tfk = rq.query.tfk; // micro token para entregar el archivo
    let img = rq.params[0]; // Imagen que se buscara


    if (_.isUndefined(exf) && _.isUndefined(img) && _.isUndefined(uif) && _.isUndefined(tfk)) {
      // En caso de que los parametros no esten completos deveuelva un status 404
      rs.status(404);
      return rs.json({
        error: true,
        message: 'Not Found'
      });
    }


    /***************************************************************************************
     * BLOQUE DE TRABAJO
     ***************************************************************************************/
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
          fileTemp = imageNotFound;
          console.log(rErr);
          return rs.sendFile(fileTemp);
        }

        // Devuelve el archivo si existe
        if (result) {
          fileTemp = fileFind.fd;
          return rs.sendFile(fileTemp);
        } else {
          // Entrega un archivo en caso de no encontrarlo
          fileTemp = imageNotFound;
          return rs.sendFile(fileTemp);
        }
      });
    }

    // por si no se encuentra la imagen solicitada en la db
    else {
      fileTemp = imageNotFound;
      return rs.sendFile(fileTemp);
    }
  }
};
