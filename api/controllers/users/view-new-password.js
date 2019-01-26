/**
 * view-new-password.js
 *
 * @description :: Mirar abajo la description ► ↓↓↓
 *
 * @src {{proyect}}/api/controllers/users/view-new-password.js
 * @author Saul Navarrov <Sinavarrov@gmail.com>
 * @created 2019/01/25
 * @version 1.0
 */
module.exports = {

  friendlyName: 'View New Passwords',

  description: 'Display "Reset New Password" page.',

  inputs: {
    token: {
      description: 'The password reset token from the email.',
      example: '4-32fad81jdaf$329'
    }
  },

  exits: {
    success: {
      viewTemplatePath: 'pages/account/reset'
    },
    invalidOrExpiredToken: {
      responseType: 'expired',
      description: 'The provided token is expired, invalid, or has already been used.',
    },
    userInabled: {
      responseType: 'userInabled',
      description: `Se mostrara para usuarios que hallan trabajado para mi organización y esten desabilidatos`,
      extendedDescription: `Anticipara la entrada de usuario malisiosos que quieran hacernos daños y que hallan
      trabajdo en la organización estos se les mostrara esta imagen de cuenta desabilitada y no pueden recuperar
      contraseña en caso de que hallan generado una al azar por el status aun siga siendo (I)`
    },
  },

  fn: async function (inputs, exits) {
    /***************************************************************************************
     * VARIABLES INICIALES
     ***************************************************************************************/
    let rq = this.req; // Request Cliente Page
    let TitlePage = sails.i18n('Reset Password');


    /***************************************************************************************
     * BLOQUE DE SEGURIDAD DE USUARIOS HABILITADOS
     ***************************************************************************************/
    // Verificando Inicio de session.
    if (rq.session.userId) {
      throw {redirect:'/'};
    }


    /***************************************************************************************
     * TRABAJO DEL CONTROLADOR
     ***************************************************************************************/
    // No se proporciono ningun token para validar
    if (!inputs.token) {
      sails.log.warn('Attempting to view new password (recovery) page, but no reset password token included in request!  Displaying error page...');
      throw 'invalidOrExpiredToken';
    }

    // Buscamos el usuario a quien corresponde el token
    let userRecord = await Users.findOne({ passwordResetToken: inputs.token });

    // Si no existe tal usuario, o si su token ha caducado, muestre una página de error que explique que el enlace es incorrecto.
    if (!userRecord || userRecord.passwordResetTokenExpiresAt <= Date.now()) {
      throw 'invalidOrExpiredToken';
    }

    // validando usuario no este desactivado
    if (userRecord.role < 8 && userRecord.status === 'I') {
      throw 'userInabled';
    }


    // Respond with view.
    return exits.success({
      'titlePage': TitlePage
    });
  }
};
