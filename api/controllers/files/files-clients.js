/**
 * files-clients.js
 *
 * @description :: Mirar abajo la description ► ↓↓↓
 *
 * @src {{proyect}}/api/controllers/fieles/files-clients.js
 * @author Saul Navarrov <Sinavarrov@gmail.com>
 * @created 2019/01/28
 * @version 1.0
 */
module.exports = {

  friendlyName: 'Files clients',

  description: 'Entraga archivos subidos al servidor',

  inputs: {

  },

  exits: {
    success: {
      description: 'Entrega de archivo exitosa.'
    },
    notFound: {
      responseType: 'notFoundData',
      description: 'No se encontro el archivo solicitado'
    },
    unauthorized: {
      statusCode: 401,
      responseType: 'unauthorized',
      description: 'No autorizado para ver este archivo.'
    }
  },

  fn: async function (inputs, exits) {
    /***************************************************************************************
     * VARIABLES INICIALES
     ***************************************************************************************/
    const rq = this.req;
    const _ = require('lodash');
    const userId = rq.session.userId;
    const isSocket = rq.isSocket;
    let count = 0;


    /***************************************************************************************
     * BLOQUE DE SEGURIDAD SOCKET
     ***************************************************************************************/


    /***************************************************************************************
     * BLOQUE DE SEGURIDAD DE USUARIOS HABILITADOS
     ***************************************************************************************/
    // Verificacion de usuario
    if (!userId) {
      return exits.unauthorized({
        error: true,
        message: 'Unauthorized'
      });
    }

    /***************************************************************************************
     * BLOQUE DE DATOS OBLIGATORIOS Y REVISION DE DATA.
     ***************************************************************************************/


    /***************************************************************************************
     * BLOQUE DE TRABAJO
     ***************************************************************************************/

    return exits.success();
  }
};
