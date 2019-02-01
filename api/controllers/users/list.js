/**
 * list.js
 *
 * @description :: Mirar abajo la description ► ↓↓↓
 *
 * @src {{proyect}}/api/controllers/users/list.js
 * @author Saul Navarrov <Sinavarrov@gmail.com>
 * @created 2019/01/29
 * @version 1.0
 */
module.exports = {

  friendlyName: 'List',

  description: 'funcion find: entrega todos los datos encontrados de los usuarios.',

  extendedDescription: `Esta funcion recopila los datos de todos los usuarios en la DB
  los depocita al usuario autorizado para verlos, cuenta con:
  count: numero de resultados completo
  limit: limita la cantidad de datos a entregar
  skip: funciona para omisor de datos junto con el limit
  find: no funciona en esta accion`,

  inputs: {
    count: {
      type:'boolean',
      defaultsTo: false,
      description: `Permitira hacer el conteo de todos los usuarios
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
      description: 'Entrega de usuarios Exitosa.'
    },
    notFound: {
      responseType: 'notFound',
      description: 'Datos no encontrados de los usuario o no existe ninguno'
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
    let users = []; // array de usuario nuevo
    let userId = rq.session.userId;
    let isSocket = rq.isSocket;
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
    let autorize = user.role <= 2 ? true : false; // Autorización de usuarios

    // Verifico que usuario tiene pases de seguridad para ver todos los usuarios creados
    // de igual rol o hacia abajo.
    if (!autorize) {
      throw 'unauthorized';
    }

    /***************************************************************************************
     * BLOQUE DE DATOS OBLIGATORIOS Y REVISION DE DATA.
     ***************************************************************************************/
    // Devuelve la cantidad de datos almacenados
    count = await Users.count({
      role: {
        '>=': rq.me.role
      }
    });

    // Enviando Numero complto de registros que hay en la base de datos
    if (inputs.count) {
      return exits.success({
        model: 'users',
        count: count
      });
    }

    /***************************************************************************************
     * BLOQUE DE TRABAJO
     ***************************************************************************************/
    // Ejecucion luego entregar el contador y saber que esta autorizado
    // para visualizar estos datos
    let usersArray = await Users.find({
      role: {
        '>=': rq.me.role
      }
    })
    .omit([
      'avatar',
      'createdAt',
      'updatedAt',
      'password',
      'passwordResetToken',
      'passwordResetTokenExpiresAt',
      'emailProofToken',
      'emailProofTokenExpiresAt',
      'emailChangeCandidate',
      'tosAcceptedByIp',
      'lastSeenAt',
      'phone',
    ])
    .limit(inputs.lim)
    .skip(inputs.lim * inputs.sk); // Todos los usuarios

    // Protegiendo el Password para no visualizarlo en Json
    for (user of usersArray) {
      // Agrego un manejador en el FrontEnd
      user.check = false;

      // Entrega por Rol
      if (user.role > 0) {
        delete user.isSuperAdmin;
      }
      users.push(user);
    }


    // Retorno de datos
    return exits.success({
      model: 'users',
      count: count,
      list: users
    });
  }
};
