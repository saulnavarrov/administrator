/**
 * list.js
 *
 * @description :: Todas las funciones de la pagina.
 *
 * @src {{proyect}}/api/controllers/masters/holdings/list.js
 * @author Saul Navarrov <Sinavarrov@gmail.com>
 * @created 2019/02/16
 * @version 1.0
 */
module.exports = {

  friendlyName: 'List',

  description: 'List holding.',

  extendedDescription: `Devolvera la lista desde la base de datos.`,

  inputs: {
    count: {
      type:'boolean',
      defaultsTo: false,
      description: `Permitira hacer el conteo de todos las empresas
      este funcionara si esta activo y devolvera el numero de datos
      encontrados`
    },
    lim: {
      type: 'number',
      defaultsTo: 10,
      description: `Cantidad de resultados que entregara por cada
      llamada que se realize al listado`
    },
    sk: {
      type: 'number',
      defaultsTo: 0,
      description: `Omitira una cantidad de listados y visualizara en
      en cantidades por limites, usado para paginar la cantidad de resultados
      que se entregan en la vista`
    }
  },

  exits: {
    success: {
      description: 'Entrega de empresas Exitosa.'
    },
    notFound: {
      responseType: 'notFoundData',
      description: 'Datos no encontrados de las empresas o no existe ninguno'
    },
    unauthorized: {
      statusCode: 401,
      responseType: 'unauthorized',
      description: 'No autorizado para ver los resultados de la pagina'
    }
  },

  fn: async function (inputs, exits) {
    /***************************************************************************************
     * VARIABLES INICIALES
     ***************************************************************************************/
    const rq = this.req;
    const userId = rq.session.userId;
    const isSocket = rq.isSocket;
    let companys = []; // array de usuario nuevo
    let count = 0;


    /***************************************************************************************
     * BLOQUE DE SEGURIDAD SOCKET Y LOGIN
     ***************************************************************************************/
    // Verificacion de usuario
    if (!userId && !isSocket) {
      return exits.unauthorized({
        error: true,
        message: 'Unauthorized'
      });
    }


    /***************************************************************************************
     * BLOQUE DE SEGURIDAD DE USUARIOS HABILITADOS
     ***************************************************************************************/
    // Busco el usuario para verificar si tiene el roll suficiente para  hacer el procedimiento
    let user = await Users.findOne({
      'id': userId
    });
    let autorize = user.role <= 3 ? true : false; // Autorización de usuarios

    // Verifico que usuario tiene pases de seguridad para ver todos los usuarios creados
    // de igual rol o hacia abajo.
    if (!autorize) {
      throw 'unauthorized';
    }


    /***************************************************************************************
     * BLOQUE DE TRABAJO
     ***************************************************************************************/
    // Ejecucion luego entregar el contador y saber que esta autorizado
    // para visualizar estos datos
    companys = await Holdings.find()
    .select(['id', 'acronym', 'balance', 'identification', 'consecutive', 'state', 'renewedDate'])
    .limit(inputs.lim)
    .skip(inputs.lim * inputs.sk); // Todos los usuarios

    // contador
    count = companys.length;

    // Retorno de datos
    return exits.success({
      model: 'holding',
      count: count,
      list: companys
    });
  }
};
