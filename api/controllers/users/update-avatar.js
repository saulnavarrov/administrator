/**
 * update-avatar.js
 *
 * @description :: Mirar abajo la description ► ↓↓↓
 *
 * @src {{proyect}}/api/controllers/users/update-avatar.js
 * @author Saul Navarrov <Sinavarrov@gmail.com>
 * @created 2019/02/04
 * @version 1.0
 */
module.exports = {
  friendlyName: 'Update Avatar',

  description: 'Actualización de la imagen avatar del usuario',

  inputs: {
    uid: {
      type: 'string',
      example: 'asd78fasdfa6s8d79f8uasd67f87asdfnjadf',
      description: `Id del usuario a quien se le actualiza la imagen
      de perfil desde el administrador`
    },

    type: {
      type: 'string',
      example: 'image/*',
      description: `tipo de imagen que envian desde el cliente`
    },

    nameFile: {
      type: 'string',
      example: 'example-imagen.jpg',
      description: `Nombre del archivo que se va a cargar desde el
      cliente para cambiar el archivo`
    },
    sizeFile: {
      type: 'number',
      example: 2097152,
      description: `Tamaño del archivo que se va a subir al servidor
      en este caso de la imagen del avatar del usuario`
    }
  },

  exits: {
    success: {
      description: `Se ha actualizado el avatar del usuario`
    },
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
    /***************************************************************************************
     * VARIABLES INICIALES
     ***************************************************************************************/
    const rq = this.req;
    const moment = require('moment');
    const userId = rq.session.userId;
    const isSocket = rq.isSocket;
    const updatedAt = moment().toJSON();

    // Variables
    let doneUpload = {}; //
    let naf = inputs.nameFile; // Nombre original del archivo
    let typ = inputs.type; // Tipo de archivo 'image/png'
    let uid = inputs.uid; // id del usuario al que se le sube los archivos
    let szf = inputs.sizeFile; // Tamaño o Peso del arhivo
    let sfm = 1024 * 1024 * 2; // Tamaño maximo para subir archivos
    let exf = '.jpg'; // Extencion con la que se guardaran las imagenes de avatars

    // Configurando Moment
    moment.locale(sails.config.custom.localeMoment);


    /***************************************************************************************
     * BLOQUE DE SEGURIDAD SOCKET
     ***************************************************************************************/
    // No se aceptan solicitudes atravez de socket.io
    if (isSocket) {
      return exits.noAuthorize({
        error: true,
        message: `Solicitud Rechazada.`
      });
    }


    /***************************************************************************************
     * BLOQUE DE SEGURIDAD DE USUARIOS HABILITADOS
     ***************************************************************************************/
    // Verificacion de usuario
    if (!userId) {
      return exits.unauthorized({
        error: true,
        message: 'Unauthorized'
      });
    }

    // Busco el usuario para verificar si tiene el roll suficiente para  hacer el procedimiento
    let user = await Users.findOne({
      'id': userId
    });
    let autorize = user.role <= 2 ? true : false; // Autorización de usuarios

    // Verifico que usuario tiene pases de seguridad para cambiar el avatar de este usuario.
    if (!autorize) {
      return exits.noAuthorize({
        error: true,
        message: `No tienes permisos para realizar esta acción.
        Comunicate con el Administrador para obtener permisos
        necesarios.`
      });
    }


    /***************************************************************************************
     * BLOQUE DE DATOS OBLIGATORIOS Y REVISION DE DATA.
     ***************************************************************************************/
    // Reviso que los datos de entrada sean
    // requeridos
    if (typeof (naf) === 'undefined' ||
      typeof (typ) === 'undefined' ||
      typeof (uid) === 'undefined' ||
      typeof (szf) === 'undefined') {
      return exits.inputDataFail({
        error: true,
        message: 'Faltan Datos para subir junto con la imagen al servidor'
      });
    }

    // Revision de que sea una imagen el arhivo
    if (!(/\.(jpg|png|gif)$/i).test(naf) ||
      !(/\/(png|gif|jpeg)$/i).test(typ)
    ) {
      return exits.fileNotImage({
        error: true,
        message: `${naf}: No es un archivo de imagen`
      });
    }

    // Revision del peso del archivo
    if (szf > sfm) {
      return exits.fileSizeExceeded({
        error: true,
        message: `El Archivo imagen excelede la capacidad maxima de carga de ${Number(sfm/1024).toFixed(0)}Kb.
        Por favor Escoja otra imagen.`
      });
    }


    /***************************************************************************************
     * BLOQUE DE TRABAJO
     ***************************************************************************************/
    doneUpload.endUpload = false;

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
        doneUpload.endUpload = true;
      });



    // tiempo para que pueda actualizarse la variable que viene del rq.file('avatar')
    let endUpload = setInterval(await finishUpload, 100);


    // Finish Upload Return
    async function finishUpload(){
      if (!doneUpload.endUpload) {
        sails.log('Subiendo Avatar');
      } else {
        // Generador de token
        let uifImage = uid.substring(0, 7) + Math.random().toString(36).substring(2, 5);
        let tfkImage = Math.random().toString(36).substring(2) + uid.substr(7, 15) + Math.random().toString(36).substring(2) + uifImage.toUpperCase() + Math.random().toString(36).substring(2);
        let srcFile = `${doneUpload.src}?exf=${exf}&tfk=${tfkImage}&uif=${uifImage}`;

        // Actualiza la imagen del
        await Users.update({
          id: uid
        })
        .set({
          avatar: srcFile,
          updatedAt: updatedAt
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
        if (typeof (fileUser) !== 'undefined') {
          // en caso de que se encuentren mas de 2 documentos como un array
          for (elId of fileUser) {
            await UploadFiles.update({
              id: elId.id
            })
            .set({
              active: false,
              updatedAt: updatedAt
            });
          }
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

        // Devolviendo variable a su estado inicial
        doneUpload.endUpload = false;
        clearIntervalEndUpload();

        // Devuelve los datos al usuarios
        return exits.success({
          success: 'ok',
          message: 'Upload Avatar Imagen',
          aid: uid,
          srcAvatar: srcFile
        });
      }
    }

    // Clear Interval EndUpload
    function clearIntervalEndUpload() {
      clearInterval(endUpload);
    }
  }
};
