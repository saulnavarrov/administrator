/**
 * invalid-emails-domains.js
 *
 * @description :: Todas las funciones de la pagina.
 *
 * @src {{proyect}}/api/helpers/utilities/invalid-emails-domains.js
 * @author Saul Navarrov <Sinavarrov@gmail.com>
 * @created 2019/04/21
 * @version 1.0
 *
 * @usage ::
 *
 * await sails.helpers.utilities.invalidEmailsDomains('Domains.com');
 *
 */

module.exports = {
  friendlyName: 'invalid Emails Domains',

  description: 'Verificara los dominios que no este la lista blanca de emails.',

  extendedDescription: 'Se verifica ',

  // moreInfoUrl: 'https://documentation.mailgun.com/en/latest/api-sending.html#sending',

  inputs: {
    domains: {
      type: 'string',
      defaultsTo: 'none',
      description: `Dominios no validos`
    }
  },

  exits: {
    success: {
      description: 'Dominios.',
    },

  },

  fn: function(inputs, exits) {
    let domains = inputs.domains;
    let encontrado = false;

    /**
     * En el futuro se montaran los domionios en la base de datos para no quitar usuarios
     * con dominios o correos basura
     */

    // Lista de dominios excluidos y no permitidos
    let dominios = [
      // YopMail.com
      'yopmail.com',
      'yopmail.fr',
      'yopmail.net',
      'cool.fr.nf',
      'jetable.fr.nf',
      'nospam.ze.tc',
      'nomail.xl.cx',
      'mega.zik.dj',
      'speed.1s.fr',
      'courriel.fr.nf',
      'moncourrier.fr.nf',
      'monemail.fr.nf',
      'monmail.fr.nf',
      // www.guerrillamail.com
      'sharklasers.com',
      'guerrillamail.info',
      'grr.la',
      'guerrillamail.biz',
      'guerrillamail.com',
      'guerrillamail.de',
      'guerrillamail.net',
      'guerrillamail.org',
      'guerrillamailblock.com',
      'pokemail.net',
      'spam4.me',
      // throwawaymail.com
      'mybx.site',
      // temp-mail.org
      'dreamcatcher.email',
      // maildrop.cc
      'maildrop.cc',
      // 10minutemail.com
      'nwytg.net',
      // mailinator.com
      // 'mailinator.com',
    ];


    // buscando dominio
    for (let d = 0; d < dominios.length; d++) {
      // Comparación
      if (dominios[d] === domains) {
        encontrado = true;
        // StopLoop
        d = dominios.length + 9;
      }
    }

    // respuesta
    return exits.success(encontrado);
  }
};
