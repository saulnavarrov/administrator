/**
 * update-avatar.js
 * @description :: Mirar abajo la description ► ↓↓↓
 * @author Saul Navarrov <Sinavarrov@gmail.com>
 * @version 1.0
 */
module.exports = {

  friendlyName: 'Update avatar',

  description: 'Actualización de la imagen avatar del usuario',

  inputs: {
    uid: {
      type: 'string',
      // required: true,
      example: 'asd78fasdfa6s8d79f8uasd67f87asdfnjadf',
      description: `Id del usuario a quien se le actualiza la imagen
      de perfil desde el administrador`
    },

    type: {
      type: 'string',
      // required: true,
      example: 'image/*',
      description: `tipo de imagen que envian desde el cliente`
    },

    nameFile: {
      type: 'string',
      // required: true,
      example: 'example-imagen.jpg',
      description: `Nombre del archivo que se va a cargar desde el
      cliente para cambiar el archivo`
    },
    sizeFile: {
      type: 'number',
      // required: true,
      example: 2097152,
      description: `Tamaño del archivo que se va a subir al servidor
      en este caso de la imagen del avatar del usuario`
    }
  },


  exits: {
    inputDataFail: {
      responseType: 'badRequestUpload',
      description: 'Faltan Datos para subir el avatar del usuario seleccionado',
    },
    fileNotImage: {
      responseType: 'badRequestUpload',
      description: `El archivo que se intenta subir no es una imagen,`
    },
    errorUploadAvatar: {
      responseType: 'badRequestUpload',
      description: `Devuelve error al usuario cuando se presente al momento
      de subir el archivo Imagen`
    },
    fileSizeExceeded: {
      responseType: 'badRequestUpload',
      description: `La capacidad del arhivo ha excedido el tamaño maximo de la carga
      para ser guardado en el servidor`
    },
    noAuthorize: {
      responseType: 'unauthorized',
      description: 'No autorizado para acer esta acción'
    }
  },


  fn: async function (inputs, exits) {
    const moment = require('moment');
    let rq = this.req;

    // Variables
    let naf = inputs.nameFile; // Nombre original del archivo
    let typ = inputs.type; // Tipo de archivo 'image/png'
    let uid = inputs.uid; // id del usuario al que se le sube los archivos
    let szf = inputs.sizeFile; // Tamaño o Peso del arhivo
    let sfm = 1024 * 1024 * 2; // Tamaño maximo para subir archivos
    let exf = '.jpg'; // Extencion con la que se guardaran las imagenes de avatars

    // Permisos para actualizar el avatar a los usuarios
    if(rq.me.role > 1){
      return exits.noAuthorize({
        error: true,
        message: `No tienes permisos para realizar esta acción.
        Comunicate con el Administrador para obtener permisos
        necesarios.`
      });
    }

    // No se aceptan solicitudes atravez de socket.io
    if (this.req.isSocket) {
      return exits.noAuthorize({
        error: true,
        message: `Socket.io no soportado.`
      });
    }

    // Reviso que los datos de entrada sean
    // requeridos
    if (typeof (naf) === 'undefined'
     || typeof (typ) === 'undefined'
     || typeof (uid) === 'undefined'
     || typeof (szf) === 'undefined') {
      return exits.inputDataFail({
        error: true,
        message: 'Faltan Datos para subir junto con la imagen al servidor'
      });
    }

    // Revision de que sea una imagen el arhivo
    if (!(/\.(jpg|png|gif)$/i).test(naf)
     || !(/\/(png|gif|jpeg)$/i).test(typ)
    ){
      return exits.fileNotImage({
        error: true,
        message: `${naf}: No es un archivo de imagen`
      });
    }

    // Revision del peso del archivo
    if (szf > sfm){
      return exits.fileSizeExceeded({
        error: true,
        message: `El Archivo imagen excelede la capacidad maxima de carga de ${Number(sfm/1024).toFixed(0)}Kb.
        Por favor Escoja otra imagen.`
      });
    }

    // Variables Nuevos
    let doneUpload = {}; //

    // Subo la imagen al servidor con los parametros iniciales
    // para el nombre usar el uid para no cambiar de imagen y no crear una galeria
    rq.file('avatar')
      .upload({
        // El archivo no puede pesar mas de 2 megas
        maxBytes: sfm,
        // Direccion del archivo
        dirname: `${sails.config.appPath}/uploads/avatars/`,
        // Nombre de la imagen (en caso de que exista sera reemplazada)
        saveAs: `vtr-${uid}${exf}`
      }, (rErr, uploadAvatar) => {
        if (rErr) {
          console.log(rErr);
          return exits.errorUploadAvatar({
            error: true,
            data: rErr,
            message: 'Error al Subir el Archivo',
          });
        }

        // Guarda Data en la Variable Uni Global
        doneUpload = uploadAvatar[0];
        doneUpload.src = `/v/upld/imgs/vtrs/vtr-${uid}`;
        doneUpload.filenameSave = `vtr-${uid}`;
      });

    // tiempo para que pueda actualizarse la variable que viene del rq.file('avatar')
    setTimeout(async () => {
      // Generador de token
      let uifImage = uid.substring(0, 7) + Math.random().toString(36).substring(2, 5);
      let tfkImage = Math.random().toString(36).substring(2) + uid.substr(7, 15) + Math.random().toString(36).substring(2) + uifImage.toUpperCase() + Math.random().toString(36).substring(2);
      let srcFile = `${doneUpload.src}?exf=${exf}&tfk=${tfkImage}&uif=${uifImage}`;

      // Actualiza la imagen del
      await User.update({ id: uid })
        .set({
          avatar: srcFile,
          updatedAt: moment().format()
        });

      // ACTUALIZACIÓN DE DATOS EN LA MODEL FILES
      // > Aregar los tokens para comprobar la imagen
      // > Actualizar el model files desactualizando la
      //    data y creando nueva data

      // Busca el usuario con el anterior docuento en la base de datos
      let fileUser = await UploadFiles.find({
        filename: doneUpload.filenameSave,
        active: true
      }).select(['id']);

      // Actualiza el viejo Documento si existe.
      if(typeof(fileUser) !== 'undefined') {
        // en caso de que se encuentren mas de 2 documentos como un array
        for(elId of fileUser) {
          await UploadFiles.update({
            id: elId.id
          })
          .set({
            active: false,
            updatedAt: moment().format()
          });
        };
      }

      // Crea el documento en la base de datos para mantener la información actualizada
      await UploadFiles.create({
        dirName: 'avatar',
        fd: doneUpload.fd,
        size: doneUpload.size,
        type: doneUpload.type,
        filename: doneUpload.filenameSave,
        exf: exf,
        filenameOriginal: naf,
        status: doneUpload.status,
        field: doneUpload.field,
        extra: '',
        src: srcFile,
        active: true,
        tfk: tfkImage,
        uif: uifImage,
        confirmate: true,
        observation: 'Change avatar',
        onwerFile: uid,
        userId: rq.me.id
      });

      // Devuelve los datos al usuarios
      return exits.success({
        success: 'ok',
        message: 'Upload Avatar Imagen',
        aid: uid,
        srcAvatar: srcFile
      });
    }, 57);
  }
};
