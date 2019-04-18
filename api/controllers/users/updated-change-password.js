/**
 * updated-change-password.js
 *
 * @description :: Mirar abajo la description ► ↓↓↓
 *
 * @src {{proyect}}/api/controllers/users/updated-change-password.js
 * @author Saul Navarrov <Sinavarrov@gmail.com>
 * @created 2019/04/08
 * @version 1.0
 */
module.exports = {
  friendlyName: 'Updated Change Passwords',

  description: 'reset password y notificacion al usuario en su correo',

  extendedDescription: `Bloqueara el usuario y le cambiara la contraseña, de manera aleatoria, le enviara una
  notificacion de cambio de contraseña al correo del usuario.`,

  inputs: {
    id: {
      type: 'string',
      defaultsTo: '',
      description: `buscara el usuario con la id`
    },
    confirm: {
      type: 'string',
      defaultsTo: '',
      description: `Confirmacion de cambio de contraseña y bloqueo`
    }
  },

  exits: {
    success: {
      description: 'bloque de usuario exitosa, y envio de password al correo - OK.'
    },
    notFound: {
      responseType: 'notFoundData',
      description: 'Datos no encontrados de los usuario o no existe ninguno'
    },
    unauthorized: {
      statusCode: 401,
      responseType: 'unauthorized',
      description: 'No autorizado para realizar esta accion'
    },
    badRequest: {
      statusCode: 400,
      responseType: 'badRequest',
      description: 'Error que pueda suceder en change-passwords'
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
    if (inputs.id.length === 0) {
      return exits.notFound({
        model: 'users',
        count: 0,
        error: true,
        title: 'Usuario no encontrado',
        message: `No se encontraron datos en la busqueda del id este usuario: '${inputs.id}'`
      });
    }


    /***************************************************************************************
     * BLOQUE DE TRABAJO
     ***************************************************************************************/
    let idUser = inputs.id;

    // Buscando usuario que no este en modo N, I, ID sino E o B
    let userb = await Users.findOne({id: idUser}).select(['id','status','emailAddress','name','lastName']);

    // Error si el usuario no existe, esto es algo que no deberia pasar
    if (!userb) {
      throw 'notFound';
    }

    // verificando Status
    if (userb.status === 'N' || userb.status === 'I' || userb.status === 'ID') {
      return exits.badRequest({
        error: true,
        code: 'status_no_valid',
        title: 'Acción invalida',
        message: `Esta acción no es valida para el estado de este usuario.`
      });
    }

    // Creando contraseña temporal
    let tempPass = await sails.helpers.strings.random('url-friendly');
    // Hasheando Contraseña
    tempPass = await sails.helpers.passwords.hashPassword(tempPass);
    // Token de cambio
    let proofToken = await sails.helpers.strings.random('url-friendly');
    // Poninedo tiempo
    let proofTokenExpiresAt = Date.now() + sails.config.custom.passwordResetTokenTTL;

    // Cambiando status, bloqueando y cambiando contraseña
    await Users.update({
      id: idUser
    }).set({
      password: tempPass,
      passwordResetToken: proofToken,
      passwordResetTokenExpiresAt: proofTokenExpiresAt,
      status: 'B',
      updatedAt: updatedAt
    });

    // Envio del Email para Recuperar
    await sails.helpers.sendTemplateEmail.with({
      to: userb.emailAddress,
      subject: 'Recuperación de Contraseña - Instrucciones',
      template: 'email-forset-change-passwords',
      templateData: {
        fullName: `${userb.name} ${userb.lastName}`,
        token: proofToken,
        expira: moment(proofTokenExpiresAt).format('LLLL')
      }
    });

    // Cerrando sessiones abiertas.
    await Sessions.destroy({
      'session': {
        'contains': `,"userId":"${idUser}",`
      }
    });

    // Retorno ok
    return exits.success();
  }
};
