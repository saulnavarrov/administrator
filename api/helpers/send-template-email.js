module.exports = {


  friendlyName: 'Send template email',


  description: 'Enviar un correo electrónico utilizando una plantilla.',


  extendedDescription:
`Para facilitar las pruebas y el desarrollo, si la dirección de correo electrónico proporcionada "a"
termina en "@ example.com",entonces el mensaje de correo electrónico se escribirá en el terminal en
lugar de enviarse realmente. (Gracias [@simonratner] (https://github.com/simonratner)!)`,


  inputs: {

    template: {
      description: 'La ruta relativa a una plantilla EJS dentro de nuestra carpeta `views/emails/` - SIN la extensión de archivo.',
      extendedDescription:`Use cadenas como "foo" o "foo / bar", pero NUNCA "foo/bar.ejs". Por ejemplo,
      "marketing / welcome" enviaría un correo electrónico utilizando la plantilla "views/emails/marketing/welcome.ejs".`,
      example: 'reset-password',
      type: 'string',
      required: true
    },

    templateData: {
      description: 'Un diccionario de datos que será accesible en la plantilla EJS.',
      extendedDescription: `Cada clave será una variable local accesible en la plantilla. Por ejemplo, si usted suministra
      un diccionario con una 'friends' key, and 'friends' es una matriz como '([{name: "Chandra"}, {nombre: "María"}])',
      Entonces podrás acceder a 'friends' desde la plantilla:
      '''
      <ul>
        <% for (friend of friends) { %>
          <li> <%= friend.name %> </ li>
        <% }); %>
      </ul>
      '''
      Esto es EJS, así que use '<% =%>' para inyectar el contenido escapado de HTML de una variable,
      <%= %>' para omitir el escape de HTML e inyectar los datos como están, o '<%%>' para ejecutar
      algún código JavaScript como una declaración 'if' o 'for' loop`,
      type: {},
      defaultsTo: {}
    },

    to: {
      description: 'La dirección de correo electrónico del destinatario principal.',
      extendedDescription:`Si esta es una dirección que termina en "@example.com",
      entonces no envíe el mensaje. En su lugar, simplemente inicie sesión en la
      consola.`,
      example: 'foo@bar.com',
      required: true
    },

    subject: {
      description: 'El asunto del email.',
      example: 'Hola!',
      defaultsTo: ''
    },

    layout: {
      description:
      `Establecer en 'falso' para deshabilitar los diseños por completo, o proporcionar
      la ruta (relativa views/layouts/') a un diseño de correo electrónico anulado.`,
      defaultsTo: 'layout-email',
      custom: (layout)=>layout===false || _.isString(layout)
    }

  },


  exits: {

    success: {
      outputFriendlyName: 'Informe de entrega de correo electrónico',
      outputDescription: 'Un diccionario de información sobre lo que pasó.',
      outputType: {
        loggedInsteadOfSending: 'boolean'
      }
    }

  },


  fn: async function(inputs, exits) {

    var path = require('path');
    var url = require('url');
    var util = require('util');


    if (!_.startsWith(path.basename(inputs.template), 'email-')) {
      sails.log.warn(
        'The "template" that was passed in to `sendTemplateEmail()` does not begin with '+
        '"email-" -- but by convention, all email template files in `views/emails/` should '+
        'be namespaced in this way.  (This makes it easier to look up email templates by '+
        'filename; e.g. when using CMD/CTRL+P in Sublime Text.)\n'+
        'Continuing regardless...'
      );
    }

    if (_.startsWith(inputs.template, 'views/') || _.startsWith(inputs.template, 'emails/')) {
      throw new Error(
        'The "template" that was passed in to `sendTemplateEmail()` was prefixed with\n'+
        '`emails/` or `views/` -- but that part is supposed to be omitted.  Instead, please\n'+
        'just specify the path to the desired email template relative from `views/emails/`.\n'+
        'For example:\n'+
        '  template: \'email-reset-password\'\n'+
        'Or:\n'+
        '  template: \'admin/email-contact-form\'\n'+
        ' [?] If you\'re unsure or need advice, see https://sailsjs.com/support'
      );
    }//•

    // Determine appropriate email layout and template to use.
    var emailTemplatePath = path.join('emails/', inputs.template);
    var layout;
    if (inputs.layout) {
      layout = path.relative(path.dirname(emailTemplatePath), path.resolve('layouts/', inputs.layout));
    } else {
      layout = false;
    }

    // Compile HTML template.
    // > Note that we set the layout, provide access to core `url` package (for
    // > building links and image srcs, etc.), and also provide access to core
    // > `util` package (for dumping debug data in internal emails).
    var htmlEmailContents = await sails.renderView(
      emailTemplatePath,
      Object.assign({layout, url, util }, inputs.templateData)
    )
    .intercept((err)=>{
      err.message =
      'Could not compile view template.\n'+
      '(Usually, this means the provided data is invalid, or missing a piece.)\n'+
      'Details:\n'+
      err.message;
      return err;
    });

    // Sometimes only log info to the console about the email that WOULD have been sent.
    // Specifically, if the "To" email address is anything "@example.com".
    //
    // > This is used below when determining whether to actually send the email,
    // > for convenience during development, but also for safety.  (For example,
    // > a special-cased version of "user@example.com" is used by Trend Micro Mars
    // > scanner to "check apks for malware".)
    var isToAddressConsideredFake = Boolean(inputs.to.match(/@example\.com$/i));

    // If that's the case, or if we're in the "test" environment, then log
    // the email instead of sending it:
    if (sails.config.environment === 'test' || isToAddressConsideredFake) {
      sails.log(
`Skipped sending email, either because the "To" email address ended in "@example.com"
or because the current \`sails.config.environment\` is set to "test".

But anyway, here is what WOULD have been sent:
-=-=-=-=-=-=-=-=-=-=-=-=-= Email log =-=-=-=-=-=-=-=-=-=-=-=-=-
To: ${inputs.to}
Subject: ${inputs.subject}

Body:
${htmlEmailContents}
-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-`);
    } else {
      // Otherwise, we'll check that all required Mailgun credentials are set up
      // and, if so, continue to actually send the email.

      if (!sails.config.custom.mailgunSecret || !sails.config.custom.mailgunDomain) {
        throw new Error(`Cannot deliver email to "${inputs.to}" because:
        `+(()=>{
          let problems = [];
          if (!sails.config.custom.mailgunSecret) {
            problems.push(' • Mailgun secret is missing from this app\'s configuration (`sails.config.custom.mailgunSecret`)');
          }
          if (!sails.config.custom.mailgunDomain) {
            problems.push(' • Mailgun domain is missing from this app\'s configuration (`sails.config.custom.mailgunDomain`)');
          }
          return problems.join('\n');
        })()+`

To resolve these configuration issues, add the missing config variables to
\`config/custom.js\`-- or in staging/production, set them up as system
environment vars.  (If you don\'t have a Mailgun domain or secret, you can
sign up for free at https://mailgun.com to receive sandbox credentials.)

> Note that, for convenience during development, there is another alternative:
> In lieu of setting up real Mailgun credentials, you can "fake" email
> delivery by using any email address that ends in "@example.com".  This will
> write automated emails to your logs rather than actually sending them.
> (To simulate clicking on a link from an email, just copy and paste the link
> from the terminal output into your browser.)

 [?] If you're unsure, visit https://sailsjs.com/support`
        );
      }

      await sails.helpers.mailgun.sendEmailHtml.with({
        htmlMessage: htmlEmailContents,
        to: inputs.to,
        subject: inputs.subject,
        testMode: sails.config.custom.sendEmailtestMode
      });

    }//ﬁ

    // All done!
    return exits.success({
      loggedInsteadOfSending: isToAddressConsideredFake
    });

  }

};
