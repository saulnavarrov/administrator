/**
 * view-contact.js
 *
 * @description :: Mirar abajo la description ► ↓↓↓
 *
 * @src {{proyect}}/api/controllers/view-pages/view-contact.js
 * @author Saul Navarrov <Sinavarrov@gmail.com>
 * @created 2019/01/25
 * @version 1.0
 */
module.exports = {

  friendlyName: 'View Contact',

  description: `Entrega la pagina de contacto. Formulario`,

  inputs: {},

  exits: {
    success: {
      viewTemplatePath: 'pages/contact',
    }
  },

  fn: async function (inputs, exits) {
    let TitlePage = 'Contacteme';
    let menu = {
      'l1': null,
      'l2': null,
      'l3': null
    };

    // Respond with view.
    return exits.success({
      'titlePage': TitlePage,
      'menu': menu
    });
  }
};
