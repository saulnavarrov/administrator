/**
 * updated-active-account.js
 *
 * @description :: Mirar abajo la description ► ↓↓↓
 *
 * @src {{proyect}}/api/controllers/users/updated-active-account.js
 * @author Saul Navarrov <Sinavarrov@gmail.com>
 * @created 2019/02/04
 * @version 1.0
 */
module.exports = {

  friendlyName: 'Updated active account',

  description: 'Activaran o desactivaran el usurio',

  extendedDescription: `El administrador podra desactivar o volver a activar el usuario, para que no
  vuelva a operar o funcionar`,

  inputs: {
    id: {
      type: 'string',
      defaultsTo: '',
      description: `buscara el usuario con la id`
    },
    status: {
      type: 'string',
      defaultsTo: '',
      description: `buscara el usuario con la id`
    }
  },

  exits: {
    success: {
      description: 'Entrega de usuarios Exitosa.'
    },
    notFound: {
      responseType: 'notFoundData',
      description: 'Datos no encontrados de los usuario o no existe ninguno'
    },
    unauthorized: {
      statusCode: 401,
      responseType: 'unauthorized',
      description: 'No autorizado para ver los resultados de la pagina'
    },
    badRequest: {
      statusCode: 400,
      responseType: 'badRequest',
      description: 'Error comun que sucede'
    }
  },

  fn: async function (inputs, exits) {
    /***************************************************************************************
     * VARIABLES INICIALES
     ***************************************************************************************/
    const rq = this.req;
    const _ = require('lodash');
    const moment = require('moment');
    const userId = rq.session.userId;
    const isSocket = rq.isSocket;
    const updatedAt = moment().toJSON();


    // Configurando Moment
    moment.locale(sails.config.custom.localeMoment);


    /***************************************************************************************
     * BLOQUE DE SEGURIDAD SOCKET
     ***************************************************************************************/
    // Solo se aceptan solicitudes atravez de socket.io
    if (!isSocket) {
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
    let autorize = user.role <= 1 ? true : false; // Autorización de usuarios

    // Verifico que usuario tiene pases de seguridad para Inactivar el  usuario
    // Solo los administradores pueden ver los datos de los usuarios en concreto
    // para trabajar de uniempresas
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
    // Verificando que esta pidiendo datos de un usuario y no venga vacio
    if (inputs.id.length === 0) {
      return exits.notFound({
        model: 'users',
        count: 0,
        error: true,
        title: 'Usuario no encontrado',
        message: `No se encontraron datos en la busqueda del id este usuario: '${inputs.id}'`
      });
    }

    if (inputs.status.length === 0) {
      return exits.badRequest({
        error: true,
        code: 'error_data_find',
        title: 'Faltan datos',
        message: `Faltan datos para lograr realizar esta funcion`
      });
    }

    // No se puede desactivar hacer esto asi mismo
    if (inputs.id === userId) {
      return exits.badRequest({
        error: true,
        code: 'error_user_i_am',
        title: 'No te puedes desctivar',
        message: 'Tu no puedes desactivar tu propia cuenta, tienes que pedir a otro usuario hacerlo'
      });
    }


    /***************************************************************************************
     * BLOQUE DE TRABAJO
     ***************************************************************************************/
    // id del usuario
    let idu = inputs.id;
    let statusU = inputs.status;

    // Buscando usuario
    let userb = await Users.findOne({
      id: idu,
      status: statusU
    }).select(['id','name','lastName','status']);

    // Conversion de status
    let statusChange = '';
    if (userb.status === 'I') {
      statusChange = 'E';
    } else if (userb.status !== 'I') {
      statusChange = 'I';
    }




    return exits.success({
      success: 'Ok',
      statusChange: statusChange
    });
  }
};
