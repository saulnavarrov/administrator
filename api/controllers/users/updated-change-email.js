/**
 * updated-change-email.js
 *
 * @description :: Mirar abajo la description ► ↓↓↓
 *
 * @src {{proyect}}/api/controllers/users/updated-change-email.js
 * @author Saul Navarrov <Sinavarrov@gmail.com>
 * @created 2019/02/04
 * @version 1.0
 */
module.exports = {

  friendlyName: 'Updated change email',

  description: '',

  extendedDescription: ``,

  inputs: {
    id: {
      type: 'string',
      defaultsTo: '',
      description: `buscara el usuario con la id`
    },
    newEmail: {
      type: 'string',
      defaultsTo: '',
      description: `Correo electronico por el cual se va hacer el cambio.`,
    },
    confirmNewEmail: {
      type: 'string',
      defaultsTo: '',
      description: `Confirmacion del correo electronico por el que se va hacer el cambio`
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
    var valEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
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
    if (inputs.id.length === 0) {
      return exits.notFound({
        model: 'users',
        count: 0,
        error: true,
        title: 'Usuario no encontrado',
        message: `No se encontraron datos en la busqueda del id este usuario: '${inputs.id}'`
      });
    }

    // Verificando emails vacios
    if (inputs.newEmail.length === 0 || inputs.confirmNewEmail.length === 0 || typeof(inputs.newEmail) === 'undefined' || typeof(inputs.confirmNewEmail) === 'undefined') {
      return exits.badRequest({
        error: true,
        code: 'error_data_incomplete',
        message: `Los campos necesarios para realizar esta accion esta incompleta`
      });
    }

    // Verificando si son emails
    if (!valEmail.test(inputs.newEmail) || !valEmail.test(inputs.confirmNewEmail)) {
      return exits.badRequest({
        error: true,
        code: 'error_data_incomplete',
        message: `Los campos necesarios para realizar esta accion esta incompleta`
      });
    }

    // Coincidencia de los emails
    if (inputs.newEmail !== inputs.confirmNewEmail) {
      return exits.badRequest({
        error: true,
        code: 'error_data_incomplete',
        message: `Los campos necesarios para realizar esta accion esta incompleta`
      });
    }


    /***************************************************************************************
     * BLOQUE DE TRABAJO
     ***************************************************************************************/
    let newEmail = inputs.newEmail;

    // Verificando el correo electronico no coincida con otro
    let userb = await Users.findOne({emailAddress: newEmail}).select(['id','emailAddress']);

    // Devolviendo error de correo existente
    if (userb){
      let mssBad = userb.id === inputs.id ? 'El correo electronico es igual al anterior, intenta con otro' : false;
      return exits.badRequest({
        error: true,
        code: 'error_email_exists',
        message: mssBad ? mssBad : `Ingrese otro correo electronico diferente: Este correo ya existe.`
      });
    }

    // Buscando el usuario a quien se le va hacer el cambio
    let userc = await Users.findOne({id:inputs.id}).select(['id','name','lastName']);
    let emailProofToken = await sails.helpers.strings.random('url-friendly');
    let emailProofTokenExpiresAt = Date.now() + sails.config.custom.emailProofTokenTTL;

    // Ingresando el email candidato para hacer el cambio de emails
    await Users.update({
      id: inputs.id
    })
    .set({
      emailChangeCandidate: newEmail,
      emailProofToken: emailProofToken,
      emailProofTokenExpiresAt: emailProofTokenExpiresAt,
      emailStatus: 'changeRequested',
      updatedAt: updatedAt
    });

    // Enviando correo electronico al nuevo email
    await sails.helpers.sendTemplateEmail.with({
      to: newEmail,
      subject: 'Confirmar el Cambio de Correo Electronico',
      template: 'email-verify-new-email',
      templateData: {
        fullName: `${userc.name} ${userc.lastName}`,
        token: emailProofToken,
        expira: moment(emailProofTokenExpiresAt).format('LLLL')
      }
    });

    return exits.success();
  }
};
