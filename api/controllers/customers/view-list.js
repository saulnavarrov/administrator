/**
 * view-list.js
 * @description :: Mirar abajo la description ► ↓↓↓
 * @author Saul Navarrov <Sinavarrov@gmail.com>
 * @version 1.0
 */
module.exports = {


  friendlyName: 'Customers view list',


  description: 'Display "List" page.',


  inputs: {

  },


  exits: {
    success: {
      viewTemplatePath: 'pages/customers/list'
    },

    redirect: {
      responseType: 'redirect',
      description: 'Requesting user is logged in, so redirect to the internal welcome page.'
    }
  },


  fn: async function (inputs, exits) {

    let rq = this.req; // Request Cliente Page
    let userId = rq.session.userId;
    let TitlePage = 'Empresas Asociadas'; // sails.i18n('Users');
    let menu = {
      'l1': 'customers',
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
