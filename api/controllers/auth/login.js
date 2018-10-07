module.exports = {

  friendlyName: 'Login',

  description: 'POST Login.',

  extendedDescription: `This action attempts to look up the user record in the database with the
specified email address.  Then, if such a user exists, it uses
bcrypt to compare the hashed password from the database with the provided
password attempt.`,

  inputs: {
    emailAddress: {
      description: 'The email to try in this attempt, e.g. "irl@example.com".',
      type: 'string',
      required: true
    },

    password: {
      description: 'The unencrypted password to try in this attempt, e.g. "passwordlol".',
      type: 'string',
      required: true
    },

    rememberMe: {
      description: 'Whether to extend the lifetime of the user\'s session.',
      extendedDescription:
`Note that this is NOT SUPPORTED when using virtual requests (e.g. sending
requests over WebSockets instead of HTTP).`,
      type: 'boolean'
    }
  },


  exits: {

    success: {
      description: 'The requesting user agent has been successfully logged in.',
    },

    badCombo: {
      responseType: 'unauthorized',
      description: `The provided email and password combination does not
      match any user in the database.`,
    },
  },


  fn: async function (inputs, exits) {

    let emailAddress = inputs.emailAddress;
    let password = inputs.password;
    let rememberMe = inputs.rememberMe;

    // buscamos el usuario en la base de datos
    let userRecord = await User.findOne({
      emailAddress: emailAddress.toLowerCase(),
    });

    // Si no existe el correo Electronico devuelve que no existe
    if (!userRecord) {
      throw 'badCombo';
    }

    // .
    await sails.helpers.passwords.checkPassword(password, userRecord.password)
      .intercept('incorrect', 'badCombo');

    // Si "Recordarme" estaba habilitado, entonces mantén viva la sesión para
    // una mayor cantidad de tiempo. (Esto provoca una actualización de "Establecer cookie"
    // encabezado de respuesta que se enviará como resultado de esta solicitud, por lo tanto
    // debemos tratar con una solicitud HTTP tradicional para
    // esto para trabajar.)
    if(rememberMe) {
      if(this.req.isSocket){
        sails.log.warn(
          'Se recibió `rememberMe: true` de una solicitud virtual, pero se ignoró \ n ' +
          'porque la cookie de sesión de un navegador no se puede restablecer a través de sockets. \ n' +
          'Por favor, use una solicitud HTTP tradicional en su lugar.'
        );
      } else {
        this.req.session.cookie.maxAge = sails.config.custom.rememberMeCookieMaxAge;
      }
    }

    // Modify the active session instance.
    this.req.session.userId = userRecord.id;

    delete userRecord.password;


    // Respond with view.
    return exits.success(userRecord);

  }


};
