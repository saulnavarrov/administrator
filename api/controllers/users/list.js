module.exports = {
  friendlyName: '',

  description: '',

  extendedDescription: ``,

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

    let rq = this.req;
    let users = []; // array de usuario nuevo
    let userId = rq.session.userId;
    let isSocket = rq.isSocket;

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
    let usersArray = await User.find()
                            .limit(inputs.lim)
                            .skip(inputs.lim * inputs.sk); // Todos los usuarios

    // Protegiendo el Password para no visualizarlo en Json
    for (user of usersArray) {
      delete user.password;
      users.push(user);
    }

    return exits.success({
      model: 'users',
      list: users
    });
  }
};
