/**
 * deliver-contact-form-messages.js
 *
 * @description :: Mirar abajo la description ► ↓↓↓
 *
 * @src {{proyect}}/api/controllers/deliver-contact-form-messages.js
 * @author Saul Navarrov <Sinavarrov@gmail.com>
 * @created 2019/01/25
 * @version 1.0
 */
module.exports = {

  friendlyName: 'Deliver contact form message',

  description: 'Entregar un mensaje de formulario de contacto a los canales internos apropiados.',

  inputs: {
    emailAddress: {
      // required: true,
      type: 'string',
      description: 'A return email address where we can respond.',
      example: 'hermione@hogwarts.edu'
    },

    phone: {
      // required: true,
      type: 'string',
      description: `Numero telefonico del usuario o cliente`,
      example: '300 1234567'
    },

    topic: {
      // required: true,
      type: 'string',
      description: 'The topic from the contact form.',
      example: 'I want to buy stuff.'
    },

    fullName: {
      // required: true,
      type: 'string',
      description: 'The full name of the human sending this message.',
      example: 'Hermione Granger'
    },

    message: {
      // required: true,
      type: 'string',
      description: 'The custom message, in plain text.'
    }
  },

  exits: {

    // La mayoria de exis estan generados de manera manual
    // lo cual hay que reorganizarlos ya que no es asi como
    // funcionan este tipo de controlades
  },


  fn: async function (inputs, exits) {
    /***************************************************************************************
     * VARIABLES INICIALES
     ***************************************************************************************/
    const rq = this.req; // Request Cliente Page
    const _ = require('lodash');
    const moment = require('moment');


    /***************************************************************************************
     * BLOQUE DE SEGURIDAD SOCKET
     ***************************************************************************************/
    // Solo se aceptan solicitudes atravez de socket.io
    if (!rq.isSocket) {
      return exits.noAuthorize({
        error: true,
        message: `Solicitud Rechazada.`
      });
    }


    /***************************************************************************************
     * BLOQUE DE VERIFICACIÓN DE DATOS
     ***************************************************************************************/
    let emailAddress = _.isUndefined(inputs.emailAddress) ? false : inputs.emailAddress;
    let phone = _.isUndefined(inputs.phone) ? false : inputs.phone;
    let topic = _.isUndefined(inputs.topic) ? false : inputs.topic;
    let fullName = _.isUndefined(inputs.fullName) ? false : inputs.fullName;
    let message = _.isUndefined(inputs.message) ? false : inputs.message;

    // Verificación de datos y retorno de error
    if (!emailAddress || !phone || !topic || !fullName || !message) {
      let formErrors = {
        emailAddress: !emailAddress ? 'is-invalid' : '',
        phone: !phone ? 'is-invalid' : '',
        topic: !topic ? 'is-invalid' : '',
        fullName: !fullName ? 'is-invalid' : '',
        message: !message ? 'is-invalid' : ''
      };

      // Response
      this.res.status(400);
      return this.res.json({
        status: 400,
        error: true,
        message: 'Faltan datos.',
        type: 'incomplete_data',
        form: formErrors
      });
    }


    /***************************************************************************************
     * TRABAJO DEL CONTROLADOR
     ***************************************************************************************/
    // Comprobando si el envio de mensajes esta activo
    if (!sails.config.custom.internalEmailAddress) {
      throw new Error(`No se puede entregar el mensaje entrante desde el formulario de contacto porque no hay información
      direción de correo electrónico (\`sails.config.custom.internalEmailAddress\`) configurada para la
      aplicación.
      Para habilitar los correos electrónicos del formulario de contacto, deberá agregar esta configuración
      faltante a su configuración personalizada -- Usuamente en \`config/custom.js\`, \`config/staging.js\`,
      \`config/production.js\`, o mediante variables de entorno del sistema.`);
    }

    // Enviando Mensaje por Email para Confirmar el correo electronico
    await sails.helpers.sendTemplateEmail.with({
      to: sails.config.custom.internalEmailAddress,
      subject: 'Nuevo mensaje de formulario de contacto',
      template: 'internal/email-contact-form',
      // layout: false,
      templateData: {
        contactName: inputs.fullName,
        contactEmail: inputs.emailAddress,
        phone: phone,
        topic: inputs.topic,
        message: inputs.message
      }
    });

    // Retorno
    return exits.success({
      status: 'success',
      message: 'Mensaje enviado con exito.',
    });
  }
};
