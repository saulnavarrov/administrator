module.exports = {


  friendlyName: 'Forgot passwords',


  description: '',


  inputs: {
    emailAddress: {
      description: 'The email address of the alleged user who wants to recover their password.',
      example: 'rydahl@example.com',
      type: 'string',
      // required: true
    }
  },


  exits: {
    success: {
      description: 'The email address might have matched a user in the database.  (If so, a recovery email was sent.)'
    },
  },


  fn: async function (inputs, exits) {
    const rq = this.req;
    const _ = require('lodash');
    const moment = require('moment');
    let emailRegex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    // return regex.test(email) ? true : false;

    // No se aceptan solicitudes atravez de socket.io
    if (!rq.isSocket) {
      return exits.noAuthorize({
        error: true,
        message: `Socket.io no soportado.`
      });
    }

    let emailAddress = _.isUndefined(inputs.emailAddress) ? false : inputs.emailAddress;
    emailAddress = _.isNull(inputs.emailAddress) ? false : inputs.emailAddress;
    emailAddress = !emailRegex.test(inputs.emailAddress) ? false : inputs.emailAddress;

    // evaluando Email y respondiendo
    if (!emailAddress) {
      let em = {
        emailAddress: !emailAddress ? 'is-invalid' : ''
      };

      // reponse
      this.res.status(400);
      return this.res.json({
        status: 400,
        error: true,
        message: 'Por favor Revise su Email y vulevalo a intentar',
        form: em
      });
    }

    // Buscamos el registro del usuario
    // (Si no existe el usuario, devolvemos un ok para evitar el olfateo de los emails registrados)
    let userRecord = await User.findOne({ emailAddress: _.toLower(inputs.emailAddress) });
    if (!userRecord) {
      return exits.success();
    }

    // Hacerle creer que el usuario Inabilitado lo puede recuperar
    if (userRecord.status === 'I') {
      return exits.success();
    }

    // Crear un token pseudoaleatorio, probabilísticamente único para usar
    // en nuestro correo de recuperación de contraseña.
    let token = await sails.helpers.strings.random('url-friendly');

    // Almacena el token en el registro de usuario
    // (Esto nos permite buscar al usuario cuando se hace clic en el enlace del correo electrónico).
    await User.update({ id: userRecord.id })
      .set({
        passwordResetToken: token,
        passwordResetTokenExpiresAt: Date.now() + sails.config.custom.passwordResetTokenTTL,
        status: 'B'
      });

    // Envio del Email para Recuperar
    await sails.helpers.sendTemplateEmail.with({
      to: inputs.emailAddress,
      subject: 'Recuperación de Contraseña - Instrucciones',
      template: 'email-reset-password',
      templateData: {
        fullName: `${userRecord.name} ${userRecord.lastName}`,
        token: token
      }
    });

    // Retorno del success
    return exits.success();
  }
};
