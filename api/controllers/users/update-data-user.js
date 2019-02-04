/**
 * update-data-user.js
 *
 * @description :: Mirar abajo la description ► ↓↓↓
 *
 * @src {{proyect}}/api/controllers/users/update-data-user.js
 * @author Saul Navarrov <Sinavarrov@gmail.com>
 * @created 2019/2/2
 * @version 1.0
 */
module.exports = {

  friendlyName: 'Update data user',

  description: `Actualización de los datos del usuario seleccionado, por parte
      de los administradores o el dueño de la empresa`,

  inputs: {
    id: {
      type: 'string',
      required: true,
      example: 'akdñfjasdf6a8sd4f6as4dfa2sd6fa',
      description: `Id del usuario que se va actualizar los datos`
    },
    role: {
      type: 'number',
      example: 9,
      esIn: [0,1,2,3,4,5,6,7,8,9],
      description: `rol de la persona en `
    },
    name: {
      type: 'string',
      example: 'Julianito Perez',
      description: `Nombre de la persona a quien se modificara`
    },
    lastName: {
      type: 'string',
      example: 'Piedras del Rio',
      description: `Apellido o Apellidos del usuario`
    },
    superAdmin: {
      type: 'boolean',
      example: false,
      description: `Cambiarlo a super admin, solo valido para
      supers Admins pueden hacer el cambio`
    },
    emailAddress: {
      type: 'string',
      example: 'name@example.com',
      description: `Correo electronico de la persona`
    },
    emailStatus: {
      type: 'string',
      isIn: ['unconfirmed', 'changeRequested', 'confirmed'],
      example: 'confirmed',
      description: `Confirmación de que el usuario o cliente nuevo
      confirmo de que el correo electronico es de el`
    },
    phone: {
      type: 'string',
      example: '+573134781513',
      description: `Numero de telefono de la persona`
    },
    status: {
      type: 'string',
      example: 'E',
      isIn: ['E', 'I', 'B', 'N', 'ID'],
      description: `Estado del usuario actual:
      E: Enable, funcional para trabajar.
      I: Inabled, Deshabilitado por el administrador.
      B: Block, Cuenta bloqueada por ingresar el password mal # Veces
      N: New, Es una cuenta nueva, esta es cuando,
      ID: Acount Delete No habilitada`
    }
  },

  exits: {
    success: {
      description: 'Actualización de usuario correctamente.'
    },
    notFound: {
      responseType: 'notFoundData',
      description: 'Usuario no encontrado'
    },
    unauthorized: {
      statusCode: 401,
      responseType: 'unauthorized',
      description: 'No autorizado para actualizar datos del usuario'
    }
  },

  fn: async function (inputs, exits) {
    /***************************************************************************************
     * VARIABLES INICIALES
     ***************************************************************************************/
    const rq = this.req;
    const moment = require('moment');
    const _ = require('lodash');
    const userId = rq.session.userId;
    const isSocket = rq.isSocket;
    let updatedAt = moment().toJSON();
    let upData = {}; // Datos de los usuarios que se actualizara

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
    })
    .select(['id', 'role']);
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
    let rev = {
      id:             _.isUndefined(inputs.id) ? false : inputs.id,
      role:           _.isUndefined(inputs.role) ? false : Number(inputs.role),
      name:           _.isUndefined(inputs.name) ? false : _.startCase(_.toLower(inputs.name)),
      lastName:       _.isUndefined(inputs.lastName) ? false : _.startCase(_.toLower(inputs.lastName)),
      emailAddress:   _.isUndefined(inputs.emailAddress) ? false : _.toLower(inputs.emailAddress),
      emailStatus:    _.isUndefined(inputs.emailStatus) ? false : inputs.emailStatus,
      phone:          _.isUndefined(inputs.phone) ? false : _.toLower(inputs.phone),
      status:         _.isUndefined(inputs.status) ? false : inputs.status,
      superAdmin:     Boolean(inputs.superAdmin),
    };

    // Datos necesarios para editar el usuario
    if ( !rev.id || !rev.name || !rev.lastName || !rev.emailAddress || !rev.emailStatus || !rev.status ) {
      this.res.status(400);
      return this.res.badRequest({
        status: 400,
        error: true,
        title: 'Fail Updated',
        data: 'Faltan datos para actualizar usuario',
      });
    }

    // Verificando existencia del usuario.
    let userFind = await Users.count({id: rev.id});
    if (!userFind) {
      return exits.notFound({
        error: true,
        title: 'Fail Updated',
        message: `Usuario no exite, verifique y vuelva a intentar.
        Si el error persiste, comuniquese con el administrador del sistema.`,
      });
    }

    /***************************************************************************************
     * BLOQUE DE TRABAJO
     ***************************************************************************************/
    // adjuntando el cambio para Supers Admins
    if (rq.me.isSuperAdmin) {
      upData.isSuperAdmin = inputs.superAdmin;
    }

    // Adjuntando status
    if (rv.status === 'B' && rv.status === 'I' && rv.status === 'E') {
      upData.status = rev.status;
    }

    // Adjuntado Rol.
    if (rev.role >= rq.me.role) {
      upData.role = rev.role;
    }

    // Datas
    upData.name = rev.name;
    upData.lastName = rev.lastName;
    upData.emailAddress = rev.emailAddress;
    upData.emailStatus = rev.emailStatus;
    upData.phone = rev.phone;
    upData.updatedAt = updatedAt;


    // Actualización de datos
    await Users.update({
      id: inputs.id
    })
    .set(upData);


    // Response
    return exits.success({
      success: true,
      message: `El usuario: ${inputs.name} ha sido actualizado con Exito.`,
      user: upData
    });
  }
};
