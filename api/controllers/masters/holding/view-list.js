/**
 * view-list.js
 *
 * @description :: Mirar abajo la description ► ↓↓↓
 *
 * @src {{proyect}}/api/controllers/masters/holding/view-list.js
 * @author Saul Navarrov <Sinavarrov@gmail.com>
 * @created 2019/02/04
 * @version 1.0
 */
module.exports = {

  friendlyName: 'view Lsit',

  description: `Entrega la pagina de la lista de holdigs`,

  inputs: {},

  exits: {
    success: {
      viewTemplatePath: 'pages/masters/holdings/list',
    }
  },

  fn: async function (inputs, exits) {
    let TitlePage = 'Lista de empresas';
    let menu = {
      'l1': 'masterFul',
      'l2': 'holdings',
      'l3': null
    };

    // Respond with view.
    return exits.success({
      'titlePage': TitlePage,
      'menu': menu
    });
  }
};
