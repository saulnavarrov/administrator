/**
 * view-registers.js
 *
 * @description :: Mirar abajo la description ► ↓↓↓
 *
 * @src {{proyect}}/api/controllers/view-pages/view-registers.js
 * @author Saul Navarrov <Sinavarrov@gmail.com>
 * @created 2019/01/23
 * @version 1.0
 */
module.exports = {

  friendlyName: 'View register',

  description: 'Display "Register" page.',

  exits: {
    success: {
      viewTemplatePath: 'pages/registers'
    }
  },


  fn: async function (inputs, exits) {
    /***************************************************************************************
     * VARIABLES INICIALES
     ***************************************************************************************/
    let rq = this.req; // Request Cliente Page
    let TitlePage = sails.i18n('Register');
    let active = sails.config.custom.registerView;

    /***************************************************************************************
     * BLOQUE DE SEGURIDAD DE USUARIOS HABILITADOS
     ***************************************************************************************/
    // Verificando Inicio de session.
    if (rq.session.userId) {
      throw {redirect:'/'};
    }

    /***************************************************************************************
     * Trabajo del controlador
     ***************************************************************************************/

    // Respond with view.
    return exits.success({
      'active': active,
      'titlePage': TitlePage
    });
  }
};
