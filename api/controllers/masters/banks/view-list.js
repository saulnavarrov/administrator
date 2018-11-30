/**
 * view-list.js
 * @description :: Mirar abajo la description ► ↓↓↓
 * @author Saul Navarrov <Sinavarrov@gmail.com>
 * @version 1.0
 */
module.exports = {


  friendlyName: 'View list',


  description: 'Display "List" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/masters/banks/list'
    },

    redirect: {
      responseType: 'redirect',
      description: 'Requesting user is logged in, so redirect to the internal welcome page.'
    }

  },


  fn: async function (inputs, exits) {

    let rq = this.req; // Request Cliente Page
    let userId = rq.session.userId;
    let TitlePage = 'Bancos'; // sails.i18n('Users');
    let menu = {
      'l1': 'masterFul',
      'l2': 'banks',
      'l3': null
    };


    // Respond with view.
    return exits.success({
      'titlePage': TitlePage,
      'menu': menu
    });

  }


};
