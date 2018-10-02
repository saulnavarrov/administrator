/**
 * view-pages/index
 * @module Controller
 * @author SaulNavarrov <Sinavarrov@gmail.com>
 */

module.exports = {

  friendlyName: 'Index',

  description: 'Pagina de Inicio del Sitio Web.',

  inputs: {},

  exits: {
    success: {
      statusCode: 200,
      description: 'Requesting user is a guest, so show the public landing page.',
      viewTemplatePath: 'pages/homepage.ejs'
    },
  },

  fn: async function (inputs, exits) {
    return exits.success();
  }
};
