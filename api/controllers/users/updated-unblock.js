/**
 * updated-unblock.js
 *
 * @description :: Mirar abajo la description ► ↓↓↓
 *
 * @src {{proyect}}/api/controllers/users/updated-unblock.js
 * @author Saul Navarrov <Sinavarrov@gmail.com>
 * @created 2019/02/04
 * @version 1.0
 */
module.exports = {

  friendlyName: 'Updated unblock',

  description: '',

  extendedDescription: ``,

  inputs: {
    id: {
      type: 'string',
      defaultsTo: '',
      description: `buscara el usuario con la id`
    },
    ed: {
      type: 'string',
      enum: ['Desbloquear', 'Bloquear'],
      description: `Bloqueara o desbloqueara el usuario seleccionado`
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
    let count = 0;

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
    let autorize = user.role <= 2 ? true : false; // Autorización de usuarios

    // Verifico que usuario tiene pases de seguridad para visualizar los datos del usuario
    // Solo los administradores y supervisores pueden ver los datos de los usuarios en concreto
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
    if (inputs.id.length === 0 || inputs.id === '') {
      return exits.notFound({
        model: 'users',
        count: 0,
        error: true,
        title: 'Usuario no encontrado',
        message: `No se encontraron datos en la busqueda del id este usuario: '${inputs.id}'`
      });
    }

    if (inputs.ed.length === 0 || inputs.ed === '') {
      return exits.notFound({
        model: 'users',
        count: 0,
        error: true,
        title: 'Datos incompletos',
        message: `Faltan datos, revise y vuelva a intentarlo`
      });
    }


    /***************************************************************************************
     * BLOQUE DE TRABAJO
     ***************************************************************************************/
    // Los 2 estados que manejara este boton
    let changeStatus = inputs.ed === 'Bloquear' ? 'B' : inputs.ed === 'Desbloquear' ? 'E' : '';

    // Busco el usuario que carga con esa id
    let userb = await Users.findOne({
      id: inputs.id
    }).select(['id', 'status']);

    // Solo se puede usar esta opcion cuando el usuario esta bloqueado o activo
    if (userb.status === 'B' || userb.status === 'E') {
      // proceso a bloquear o desbloquear el usuario
      sails.log(changeStatus);
      await Users.update({
        id: userb.id,
        status: userb.status
      }).set({
        status: changeStatus,
        updatedAt: updatedAt
      });

      return exits.success({
        model: 'users',
        count: 0,
        success: 'ok',
        text: `El usuario se le ha ${changeStatus === 'B' ? 'Bloqueado' : changeStatus === 'E' ? 'Desbloqueado' : 'Acción No Realizada'}`
      });
    } else {
      // Cuando el usuario envie una variable del que no corresponde 'B' o 'E' para hacer el cambio de statdo
      // Este devolvera este error debido a que se requiere esa variable
      return exits.badRequest({
        model: 'users',
        count: 0,
        error: true,
        code: 'error_change_status',
        message: `Accion Incorrecta: para cambiar el status utilize un codigo valido para realizar esta accion.`
      });
    }
  }
};
