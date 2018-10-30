/**
 * update-data-user.js
 * @description :: Mirar abajo la description ► ↓↓↓
 * @author Saul Navarrov <Sinavarrov@gmail.com>
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
      required: true,
      example: 9,
      esIn: [0,1,2,3,4,5,6,7,8,9],
      description: `rol de la persona en `
    },
    name: {
      type: 'string',
      required: true,
      example: 'Julianito Perez',
      description: `Nombre de la persona a quien se modificara`
    },
    lastName: {
      type: 'string',
      required: true,
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
      required: true,
      example: 'name@example.com',
      description: `Correo electronico de la persona`
    },
    emailStatus: {
      type: 'string',
      required: true,
      isIn: ['unconfirmed', 'changeRequested', 'confirmed'],
      example: 'confirmed',
      description: `Confirmación de que el usuario o cliente nuevo
      confirmo de que el correo electronico es de el`
    },
    phone: {
      type: 'string',
      required: true,
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
    noAuthorize: {
      responseType: 'unauthorized',
      description: 'No autorizado para acer esta acción'
    }
  },

  fn: async function (inputs, exits) {
    const _ = require('lodash');
    const moment = require('moment');
    let rq = this.req;
    let updAt = moment().format();
    let dUp = {}; // Array de datos que se actualizara

    // Permisos para actualizar el avatar a los usuarios
    if (rq.me.role > 3) {
      return exits.noAuthorize({
        error: true,
        message: `No tienes permisos para realizar esta acción.
        Comunicate con el Administrador para obtener permisos
        necesarios.`
      });
    }

    // No se aceptan solicitudes atravez de socket.io
    if (!rq.isSocket) {
      return exits.noAuthorize({
        error: true,
        message: `Socket.io no soportado.`
      });
    }

    // adjuntando el cambio para Supers Admins
    if(rq.me.isSuperAdmin){
      dUp.isSuperAdmin = inputs.superAdmin;
    }

    // Actualización de datos
    let upUser = await User.update({
      id: inputs.id
    })
    .set({
      role: inputs.role,
      name: _.startCase(_.lowerCase(inputs.name)),
      lastName: _.startCase(_.lowerCase(inputs.lastName)),
      emailAddress: inputs.emailAddress,
      emailStatus: inputs.emailStatus,
      phone: String(inputs.phone),
      // status: inputs.status, // Aun no configurado
      updatedAt: updAt
    }).fetch();

    // Eliminando datos inecesarios.
    delete upUser[0].avatar;
    delete upUser[0].createdAt;
    delete upUser[0].updatedAt;
    delete upUser[0].password;
    delete upUser[0].isSuperAdmin;
    delete upUser[0].passwordResetToken;
    delete upUser[0].passwordResetTokenExpiresAt;
    delete upUser[0].emailProofToken;
    delete upUser[0].emailProofTokenExpiresAt;
    delete upUser[0].emailChangeCandidate;
    delete upUser[0].tosAcceptedByIp;
    delete upUser[0].lastSeenAt;

    // Response
    return exits.success({
      success: true,
      message: `El usuario: ${inputs.name} ha sido actualizado con Exito.`,
      user: upUser[0]
    });

  }
};

// trabajando en la respuesta ok del update save user frontend
