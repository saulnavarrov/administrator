/**
 * list.js
 * @description :: Mirar abajo la description ► ↓↓↓
 * @author Saul Navarrov <Sinavarrov@gmail.com>
 * @version 1.0
 */
module.exports = {
  friendlyName: 'users/list',

  description: 'funcion find: entrega todos los datos encontrados de los usuarios',

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
    },
    find: {
      type: 'string',
      defaultsTo: '',
      description: `Se usaria para hacer busqueda en la tabla de usuarios, actualmente
      no funciona en la accion "users/list" sino que va a funcionar en la
      accion "users/find-one"`
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

    let rq = this.req;
    let users = []; // array de usuario nuevo
    let userId = rq.session.userId;
    let isSocket = rq.isSocket;
    let count = 0;

    // Verificacion de usuario
    if(!userId && !isSocket){
      return exits.unauthorized({
        error: true,
        message: 'Unauthorized'
      });
    }

    // Enviando Numero complto de registros que hay en la base de datos
    if(inputs.count){
      return exits.success({
        model: 'users',
        count: await User.count()
      });
    }

    // Ejecucion luego entregar el contador y saber que esta autorizado
    // para visualizar estos datos
    let usersArray = await User.find({
      role: { '>=': rq.me.role }
    })
    .limit(inputs.lim)
    .skip(inputs.lim * inputs.sk); // Todos los usuarios

    // Devuelve la cantidad de datos almacenados
    count = await User.count();

    // Protegiendo el Password para no visualizarlo en Json
    for (user of usersArray) {

      delete user.password;
      // Organizando data entrega
      delete user.avatar;
      delete user.createdAt;
      delete user.updatedAt;
      delete user.password;
      delete user.passwordResetToken;
      delete user.passwordResetTokenExpiresAt;
      delete user.emailProofToken;
      delete user.emailProofTokenExpiresAt;
      delete user.emailChangeCandidate;
      delete user.tosAcceptedByIp;
      delete user.lastSeenAt;
      delete user.phone;
      delete user.status;

      // Entrega por Rol
      if(user.role > 0){
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
