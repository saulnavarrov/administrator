/**
 * login.js
 *
 * @description :: Mirar abajo la description ► ↓↓↓
 *
 * @src {{proyect}}/api/controllers/auth/login.js
 * @author Saul Navarrov <Sinavarrov@gmail.com>
 * @created 2019/01/24
 * @version 1.0
 */
module.exports = {

  friendlyName: 'Login',

  description: 'POST Login auth.',

  extendedDescription: `This action attempts to look up the user record in the database with the
specified email address.  Then, if such a user exists, it uses
bcrypt to compare the hashed password from the database with the provided
password attempt.`,

  inputs: {
    emailAddress: {
      description: 'The email to try in this attempt, e.g. "irl@example.com".',
      type: 'string',
      // required: true
    },

    password: {
      description: 'The unencrypted password to try in this attempt, e.g. "passwordlol".',
      type: 'string',
      // required: true
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

    blocked: {
      responseType: 'userBlocked',
      description: `Devuelve una respuesta de un usuario que esta siendo bloqueado,
      por intentos fallidos al iniciar la sesion`
    }
  },

  fn: async function (inputs, exits) {
    /***************************************************************************************
     * VARIABLES INICIALES
     ***************************************************************************************/
    const rq = this.req;
    const _ = require('lodash');
    const moment = require('moment');
    let emailAddress = inputs.emailAddress;
    let password = inputs.password;
    let rememberMe = inputs.rememberMe;
    let attemptsLogin = sails.config.custom.attemptsLogin;
    let attemptsTime = sails.config.custom.attemptsTime;
    let updatedAt = moment().toJSON();
    let emailRegex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;


    /***************************************************************************************
     * BLOQUE DE SEGURIDAD SOCKET (Desctivado) Usando Ajax
     ***************************************************************************************/
    // Solo se aceptan solicitudes atravez de socket.io
    // Reescrito para aceptar solicitudes con Ajax (Axios)
    // if (!rq.isSocket) {
    //   return exits.noAuthorize({
    //     error: true,
    //     message: `Socket.io no soportado.`
    //   });
    // }


    /***************************************************************************************
     * BLOQUE DE DATOS OBLIGATORIOS Y REVISION DE DATA.
     ***************************************************************************************/
    // Evaluando Email
    let email = _.isUndefined(inputs.emailAddress) ? false : true;
    email = _.isNull(inputs.emailAddress) ? false : true;
    email = !emailRegex.test(inputs.emailAddress) ? false : true;

    // Evaluando Password
    let pass = _.isUndefined(inputs.password) ? false : true;
    pass = _.isNull(inputs.password) ? false : true;
    pass = inputs.password === '' ? false : true;

    // evaluando Email y respondiendo
    if (!email || !pass) {
      let em = {
        email: !email ? 'is-invalid' : '',
        pass: !pass ? 'is-invalid' : ''
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


    /***************************************************************************************
     * BLOQUE DE TRABAJO
     ***************************************************************************************/
    // buscamos el usuario en la base de datos
    let userRecord = await Users.findOne({
      emailAddress: emailAddress.toLowerCase(),
    });

    // Si no existe el correo Electronico devuelve que no existe
    if (!userRecord) {
      // Intento fallido o de ataque
      await attemptsLoginFailSee({
        em: emailAddress.toLowerCase(),
        id: '5bfb6e1f0f6f210c144c1cfd',
        s: false,
        ip: this.req.headers['x-forwarded-for'],
        port: this.req.protocol,
        type: 'attempt'
      });

      this.res.status(401);
      return this.res.json({
        error: true,
        success: false,
        type: 'E-Sr-Ps-NF',
        text: 'Error de usuario y contraseña.',
      });
    }

    // Solo se le dara un inicio de session a las personas que este habilitadas,
    // y con el correo electronico confirmado, sino se les devolvera un error.
    if (userRecord.status !== 'E' || userRecord.emailStatus !== 'confirmed') {
      await attemptsLoginFailSee({
        em: emailAddress.toLowerCase(),
        id: userRecord.id,
        s: false,
        ip: this.req.headers['x-forwarded-for'],
        port: this.req.protocol,
        type: 'attempt'
      });

      this.res.status(401);
      return this.res.json({
        error: true,
        success: false,
        type: 'E-Sr-Blck-N-Confir',
        text: {
          Inactive: userRecord.status === 'I' ? 'Este usuario se encuntra suspendido o bloqueado, por favor comuniquese con soporte para tener mas información. ' : '',
          block: userRecord.status === 'B' ? 'El usuario se bloqueo por seguridad, lo invitamos a cambiar su contraseña y volverlo a intentar. ' : '',
          confirmed: userRecord.emailStatus !== 'confirmed' ? 'Confirme su Email para porder acceder. ' : ''
        }
      });
      // throw 'badCombo';
    }



    // Verificación de la contraseña si coincide con la que esta guardada
    await sails.helpers.passwords.checkPassword(password, userRecord.password)
      .intercept('incorrect', async () => {
        // Reportar intentos en la base de datos
        // si supera los 5 intentos en menos de 1 hora
        // se bloqueara la cuenta y tendra que cambiar de contraseña
        // para poder desbloquear la cuenta.
        // se llevar el registro en attemptsLogin
        // tanto los intentos como el login
        // attemptsTime = sails.config.custom.attemptsTime;

        // Guardo el intento fallido
        await attemptsLoginFailSee({
          em: emailAddress.toLowerCase(),
          id: userRecord.id,
          s: false,
          ip: this.req.headers['x-forwarded-for'],
          port: this.req.protocol,
          type: 'attempt'
        });

        // Restando el tiempo de 1 hora cuando intento ingresar.
        let tampsTime = (Date.now() - attemptsTime);

        // Criterio de busqueda de datos de las fallas de los usuarios
        let criterioFinds = {
          'users': userRecord.id,
          // 'success': false,
          'created': {
            '>=': tampsTime
          },
        };

        // Evaluo cuantos intetos tiene en la ultima hora.
        let countFailsSession = await AttemptsLogin.count(criterioFinds);
        let failsSession = await AttemptsLogin.find(criterioFinds).sort('id DESC');

        sails.log(`Conteo de inicio de session ${countFailsSession++} tiempo ${tampsTime}`);
        // sails.log(failsSession);


        // evaluación de la cuentas para bloquearlas por maximos intentos
        let intentos = 0; // Cuenta los intentos fallidos para iniciar session

        // Recopila los intentos fallidos hasta la ultima vez que inicio sesión
        // es como si se reiniciara el contador
        for (let lo = 0; lo < failsSession.length; lo++) {
          let fails = failsSession[lo];
          intentos++;
          if (fails.success === true) {
            lo = failsSession.length + 99;
          }
        }

        // sails.log(intentos);
        // Evaluacion para bloquear la cuenta
        if (intentos >= attemptsLogin) {
          sails.log.error(new Error(`Se ha bloqueado el usario '${userRecord.name}' por superar el numero de intentos permitidos`));
          await Users.update({
            id: userRecord.id
          })
          .set({
            status: 'B',
            updatedAt: updatedAt
          });

          // retorno que la cuenta fue bloqueada
          return 'blocked';
        }

        // Retorno del error
        return 'badCombo';
      });

    // Si "Recordarme" estaba habilitado, entonces mantén viva la sesión para
    // una mayor cantidad de tiempo. (Esto provoca una actualización de "Establecer cookie"
    // encabezado de respuesta que se enviará como resultado de esta solicitud, por lo tanto
    // debemos tratar con una solicitud HTTP tradicional para
    // esto para trabajar.)
    if (rememberMe) {
      if (this.req.isSocket) {
        sails.log.warn(
          'Se recibió `rememberMe: true` de una solicitud virtual, pero se ignoró \ n ' +
          'porque la cookie de sesión de un navegador no se puede restablecer a través de sockets. \ n' +
          'Por favor, use una solicitud HTTP tradicional en su lugar.'
        );
      } else {
        this.req.session.cookie.maxAge = sails.config.custom.rememberMeCookieMaxAge;
      }
    }

    // Guardo cuando ha iniciado sesión
    await attemptsLoginFailSee({
      em: emailAddress.toLowerCase(),
      id: userRecord.id,
      s: true,
      ip: this.req.headers['x-forwarded-for'],
      port: this.req.protocol,
      type: 'login'
    });

    // Modify the active session instance.
    this.req.session.userId = userRecord.id;
    this.req.session.authorization = {
      id: userRecord.id,
      success: true
    };


    // Adjuntando Ip de inicio de sesion
    await Users.update({
      id: userRecord.id
    })
    .set({
      tosAcceptedByIp: this.req.headers['x-real-ip'] || this.req.ip,
    });

    delete userRecord.password;

    // Respond with view.
    return exits.success(userRecord);
  }
};


// Guarda los registros de intentos de sessión
async function attemptsLoginFailSee(dat) {
  // sails.log('Guardando datos de session');
  await AttemptsLogin.create({
    email: dat.em,
    successType: dat.type,
    user: dat.id,
    success: dat.s,
    ip: dat.ip,
    port: dat.port
    // ip: this.req.headers['x-forwarded-for'],
    // port: this.req.protocol
  });
}
