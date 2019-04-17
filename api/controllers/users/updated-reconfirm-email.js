/**
 * updated-reconfirm-email.js
 *
 * @description :: Mirar abajo la description ► ↓↓↓
 *
 * @src {{proyect}}/api/controllers/users/updated-reconfirm-email.js
 * @author Saul Navarrov <Sinavarrov@gmail.com>
 * @created 2019/02/04
 * @version 1.0
 */
module.exports = {

  friendlyName: 'Updated reconfirm email',

  description: 'Enviara un correo electronico con un nuevo token para reconfirmar el usuario',

  extendedDescription: `se generara un nuevo token y se le enviara al correo electronico del usuario la confirmacion del
  cambio de token para que pueda confirmarlo`,

  inputs: {
    id: {
      type: 'string',
      defaultsTo: '',
      description: `buscara el usuario con la id`
    },
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
    let idu = inputs.id;  // Id del usuario

    // Busco el usuario con el status 'N' (Nuevo)
    let userb = await Users.findOne({
      id: idu,
      status: 'N',
      emailStatus: 'unconfirmed'
    }).select(['id', 'status','emailAddress','name','lastName']);

    // Devuelvo si el usuario no existe
    if (!userb) {
      return exits.badRequest({
        error: true,
        code: 'error_user',
        title: 'No se encuentra el usuario',
        message: `Este usuario no se encontro, revise e intente de nuevo, si se vuelve a presentar el error, comuniquese con el administrador`
      });
    }

    // Creando token nuevo
    let proofToken = await sails.helpers.strings.random('url-friendly');
    // Creando nuevo tiempo de expiracion
    let proofTokenExpiresAt = Date.now() + sails.config.custom.passwordResetTokenTTL;

    // Hago los cambios al usuario en la DB
    await Users.update({
      id: userb.id,
      status: 'N',
    }).set({
      emailProofToken: proofToken,
      emailProofTokenExpiresAt: proofTokenExpiresAt,
      updatedAt: updatedAt
    });

    // Enviando email al usuario
    await sails.helpers.sendTemplateEmail.with({
      to: userb.emailAddress,
      subject: 'Por Favor Confirmar Email Nuevo',
      template: 'email-verify-account',
      templateData: {
        fullName: `${userb.name} ${userb.lastName}`,
        token: proofToken
      }
    });

    // Retorno ok
    return exits.success();
  }
};

// se buscara el usuario
// se validara si es Nuevo el usuario y lo activo en el tiempo desicnado
// se genera un nuevo token al correo, tiempo, se le envia una nueva contraseña generada de manera aleatoria
// se guarda todo y se valida.
// valida todo y se pasa los errores al frontend y el success
//
