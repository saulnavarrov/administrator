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
      type:'string',
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

  },

  fn: async function (inputs, exits) {
    let rq = this.req;
    const _ = require('lodash');
    const moment = require('moment');
    let dateForm = {};

    // No se aceptan solicitudes atravez de socket.io
    if (!rq.isSocket) {
      return exits.noAuthorize({
        error: true,
        message: `Socket.io no soportado.`
      });
    }

    let emailAddress = _.isUndefined(inputs.emailAddress) ? false : inputs.emailAddress;
    let phone = _.isUndefined(inputs.phone) ? false : inputs.phone;
    let topic = _.isUndefined(inputs.topic) ? false : inputs.topic;
    let fullName = _.isUndefined(inputs.fullName) ? false : inputs.fullName;
    let message = _.isUndefined(inputs.message) ? false : inputs.message;

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

    // Comprobando si el envio de mensajes esta activo
    if (!sails.config.custom.internalEmailAddress) {
      throw new Error(
        `Cannot deliver incoming message from contact form because there is no internal
email address (\`sails.config.custom.internalEmailAddress\`) configured for this
app.  To enable contact form emails, you'll need to add this missing setting to
your custom config -- usually in \`config/custom.js\`, \`config/staging.js\`,
\`config/production.js\`, or via system environment variables.`
      );
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
