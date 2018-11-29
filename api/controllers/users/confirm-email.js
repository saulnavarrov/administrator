/**
 * confirm-email.js
 * @description :: Mirar abajo la description ► ↓↓↓
 * @author Saul Navarrov <Sinavarrov@gmail.com>
 * @version 1.0
 */
module.exports = {

  friendlyName: 'Confirm email',

  description: `Confirmar la dirección de correo electrónico de un nuevo usuario, o la solicitud de un usuario
  existente para un cambio de dirección de correo electrónico, luego redirigir a una página de destino especial
  (para usuarios recién registrados) o a la página de la cuenta (para usuarios existentes que hayan cambiado su
  dirección de correo electrónico).`,

  inputs: {
    token: {
      description: 'The confirmation token from the email.',
      example: '4-32fad81jdaf$329'
    }
  },

  exits: {
    success: {
      description: 'Dirección de correo electrónico confirmada y solicitando el inicio de sesión del usuario.'
    },

    redirect: {
      responseType: 'redirect',
      description: `Se confirmó la dirección de correo electrónico y se solicita al usuario que inicie sesión.
      Dado que se parece a un navegador, redireccionando ...`
    },

    invalidOrExpiredToken: {
      responseType: 'expired',
      description: 'El token proporcionado está vencido, no es válido o ya está agotado.',
    },

    userInabled: {
      responseType: 'userInabled',
      description: `Se mostrara para usuarios que hallan trabajado para mi organización y esten desabilidatos`,
      extendedDescription: `Anticipara la entrada de usuario malisiosos que quieran hacernos daños y que hallan
      trabajdo en la organización estos se les mostrara esta imagen de cuenta desabilitada y no pueden recuperar
      contraseña en caso de que hallan generado una al azar por el status aun siga siendo (I)`
    },

    emailAddressNoLongerAvailable: {
      statusCode: 409,
      viewTemplatePath: '500',
      description: 'La dirección de correo electrónico ya no está disponible.',
      extendedDescription: `Este es un caso de ventaja que no siempre es anticipado por los sitios web y las API.
      Como es bastante raro, la página de error del servidor 500 se utiliza como un simple catch-all. Si esto se
      vuelve importante en el futuro, podría expandirse fácilmente a una página de error personalizada o flujo de
      resolución. Pero para el contexto: este comportamiento de mostrar la página de error del servidor 500 imita
      cómo se comportan las aplicaciones populares como Slack en las mismas circunstancias.`,
    }
  },


  fn: async function (inputs, exits) {

    // No se proporciono ningun token para validar
    if (!inputs.token) {
      throw 'invalidOrExpiredToken';
    }

    // Get the user with the matching email token.
    var user = await User.findOne({ emailProofToken: inputs.token });

    // validando usuario no este desactivado
    if (user.role < 8 && user.status === 'I') {
      throw 'userInabled';
    }

    // If no such user exists, or their token is expired, bail.
    if (!user || user.emailProofTokenExpiresAt <= Date.now()) {
      throw 'invalidOrExpiredToken';
    }

    // Confirmación de emails
    if (user.emailStatus === 'unconfirmed') {
      //  ┌─┐┌─┐┌┐┌┌─┐┬┬─┐┌┬┐┬┌┐┌┌─┐  ╔═╗╦╦═╗╔═╗╔╦╗ ╔╦╗╦╔╦╗╔═╗  ╦ ╦╔═╗╔═╗╦═╗  ┌─┐┌┬┐┌─┐┬┬
      //  │  │ ││││├┤ │├┬┘││││││││ ┬  ╠╣ ║╠╦╝╚═╗ ║───║ ║║║║║╣   ║ ║╚═╗║╣ ╠╦╝  ├┤ │││├─┤││
      //  └─┘└─┘┘└┘└  ┴┴└─┴ ┴┴┘└┘└─┘  ╚  ╩╩╚═╚═╝ ╩   ╩ ╩╩ ╩╚═╝  ╚═╝╚═╝╚═╝╩╚═  └─┘┴ ┴┴ ┴┴┴─┘
      // Si este es un nuevo usuario que confirma su correo electrónico por primera vez,
      // simplemente actualice el estado de su registro de usuario en la base de datos,
      // almacene su identificación de usuario en la sesión(en caso de que todavía no haya
      // iniciado sesión) y luego redirija ellos a la pagina de "email confirmed".

      // Actualiza la base de datos
      await User.update({id: user.id})
        .set({
          status: 'E', // Enabled Usuario
          emailStatus: 'confirmed',
          emailProofToken: '',
          emailProofTokenExpiresAt: 0
        });

      // Redireccióna o entrega un dato en json
      if (this.req.wantsJSON){
        return exits.success();
      } else {
        throw {redirect: '/email/confirmed'};
      }
    }

    // Para confirmar el cambio de Emails
    else if (user.emailStatus === 'changeRequested') {
      //  ┌─┐┌─┐┌┐┌┌─┐┬┬─┐┌┬┐┬┌┐┌┌─┐  ╔═╗╦ ╦╔═╗╔╗╔╔═╗╔═╗╔╦╗  ┌─┐┌┬┐┌─┐┬┬
      //  │  │ ││││├┤ │├┬┘││││││││ ┬  ║  ╠═╣╠═╣║║║║ ╦║╣  ║║  ├┤ │││├─┤││
      //  └─┘└─┘┘└┘└  ┴┴└─┴ ┴┴┘└┘└─┘  ╚═╝╩ ╩╩ ╩╝╚╝╚═╝╚═╝═╩╝  └─┘┴ ┴┴ ┴┴┴─┘

      if (!user.emailChangeCandidate) {
        throw new Error(`Violación de coherencia: no se pudo actualizar el cliente de Stripe porque este usuario registra el cambio de Candidato de correo electrónico ("${user.emailChangeCandidate}") falta. (Esto nunca debería suceder.)`);
      }

      // Última línea de defensa: dado que los candidatos a cambio de correo electrónico no
      // están protegidos por una restricción de unicidad en la base de datos, es importante
      // que nos aseguremos de que nadie más haya podido obtener este correo electrónico
      // mientras tanto verificamos su disponibilidad. (Este es un caso de borde relativamente
      // raro, ver descripción de salida).
      if (await User.count({ emailAddress: user.emailChangeCandidate }) > 0) {
        throw 'emailAddressNoLongerAvailable';
      }

      // Si las funciones de facturación están habilitadas, también actualice el correo electrónico
      // de facturación para la entrada de cliente vinculada de este usuario en Stripe API para
      // asegurarse de que reciba los recibos por correo electrónico.
      // > Nota: si aún no había una entrada de cliente de Stripe para este usuario,
      // > entonces uno se configurará de forma implícita, por lo que tendremos que persistir en nuestro
      // > base de datos. (Esto podría suceder si las credenciales de Stripe no estuvieran configuradas
      // > en el momento en que este usuario fue creado originalmente.)
      if (sails.config.custom.enableBillingFeatures) {
        // Verificación de contenido de customer Id
        let didNotAlReadyHaveCustomerId = (!user.stripeCustomerId);

        // Cambia el email en la api de la pasarela de pagos
        let stripeCustomerId = await sails.helpers.stripe.saveBillingInfo.with({
          stripeCustomerId: user.stripeCustomerId,
          emailAddress: user.emailChangeCandidate
        });

        // Si no hay datos, no se actualiza en mi base de datos
        if (didNotAlReadyHaveCustomerId) {
          await User.update({ id: user.id })
            .set({
              stripeCustomerId
            });
        }
      }

      // Finalmente, actualice al usuario en la base de datos, almacene su ID en la sesión
      // (en caso de que todavía no haya iniciado sesión), luego rediríjalos a su página de
      // "mi cuenta" para que puedan ver su dirección de correo electrónico actualizada.
      await User.update({ id: user.id })
        .set({
          status: 'E', // Enabled Usuario
          emailStatus: 'confirmed',
          emailProofToken: '',
          emailProofTokenExpiresAt: 0,
          emailAddress: user.emailChangeCandidate, // Actualiza el email
          emailChangeCandidate: '' // Reset dato
        });

      // Entrega de data al usuario
      if (this.req.wantsJSON) {
        return exits.success();
      } else {
        throw { redirect: '/acount' };
      }
    }

    else {
      throw new Error(`Violación de coherencia: el usuario ${user.id} tiene un token de prueba de correo electrónico, pero de alguna manera también tiene un estado de correo electrónico de "${user.emailStatus}"! (Esto nunca debería suceder.)`);
    }
  }
};


// Confirmar el nuevo email
