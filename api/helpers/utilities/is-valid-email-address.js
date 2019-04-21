/**
 * is-valid-email-address.js
 *
 * @description :: Todas las funciones de la pagina.
 *
 * @src {{proyect}}/api/helpers/utilities/is-valid-email-address.js
 * @author Saul Navarrov <Sinavarrov@gmail.com>
 * @created 2019/04/21
 * @version 1.0
 *
 * @usage
 *
 * sails.helpers.utilities.isValidEmailAddress('string Email');
 *
 * // Response
 * boolean: True, False
 * object: Dominios no validos
 */

module.exports = {
  friendlyName: 'Is valid email address',

  description: 'Send an automated HTML email.',

  extendedDescription: 'This implementation delivers the provided message using the Mailgun API.',

  // moreInfoUrl: 'https://documentation.mailgun.com/en/latest/api-sending.html#sending',

  inputs: {
    emailAddress: {
      type: 'string',
      defaultsTo: 'none',
      description: `Email que se ara la comparación si es o no valido`
    }
  },

  exits: {
    success: {
      description: 'The email was sent successfully.',
    },

  },

  fn: function(inputs, exits) {
    let email = inputs.emailAddress;
    let emailUserUtf8Part = /^[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+$/i;
    let quotedEmailUserUtf8 = /^([\s\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|(\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*$/i;

    // Verificamos que no sea vacio y que sea un string
    if (!email || typeof(email) !== 'string') {
      return false;
    }

    // Minimos de bytes
    function _isByteLength(str, min, max) {
      let len = encodeURI(str).split(/%..|./).length - 1;
      return len >= min && (typeof max === 'undefined' || len <= max);
    }

    // Verificacion de FQDN
    function _isFQDN(str) {
      let options = {
        requireTld: !0,
        allowUnderscores: !1,
        allowTrailingDot: !1
      };
      if (options.allowTrailingDot && str[str.length - 1] === '.') {
        str = str.substring(0, str.length - 1);
      }
      let parts = str.split('.');
      if (options.requireTld) {
        let tld = parts.pop();
        if (!parts.length || !/^([a-z\u00a1-\uffff]{2,}|xn[a-z0-9-]{2,})$/i.test(tld)) {
          return !1;
        }
      }
      for (let part, i = 0; i < parts.length; i++) {
        part = parts[i];
        if (options.allowUnderscores) {
          if (part.indexOf('__') >= 0) {
            return !1;
          }
          part = part.replace(/_/g, '')
        }
        if (!/^[a-z\u00a1-\uffff0-9-]+$/i.test(part)) {
          return !1;
        }
        if (/[\uff01-\uff5e]/.test(part)) {
          return !1;
        }
        if (part[0] === '-' || part[part.length - 1] === '-' || part.indexOf('---') >= 0) {
          return !1;
        }
      }
      return !0;
    }

    // verificacion inicial
    async function verifyEmail(str) {
      let parts = str.split('@');
      let domain = parts.pop();
      let user = parts.join('@');
      let lowerDomain = domain.toLowerCase();

      if(await sails.helpers.utilities.invalidEmailsDomains.with({domains:lowerDomain})) {
        return {error: true, email: 'invalid domain'};
      }

      if (lowerDomain === 'gmail.com' || lowerDomain === 'googlemail.com') {
        user = user.replace(/\./g, '').toLowerCase();
      }
      if (!_isByteLength(user, 0, 64) || !_isByteLength(domain, 0, 256)) {
        return !1;
      }
      if (!_isFQDN(domain)) {
        return !1;
      }
      if (user[0] === '"') {
        user = user.slice(1, user.length - 1);
        return quotedEmailUserUtf8.test(user);
      }
      let pattern = emailUserUtf8Part;
      let userParts = user.split('.');
      for (let i = 0; i < userParts.length; i++) {
        if (!pattern.test(userParts[i])) {
          return !1;
        }
      }
      return !0;
    }

    return exits.success(verifyEmail(email));
  }
};
