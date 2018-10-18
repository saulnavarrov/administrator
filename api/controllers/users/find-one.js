module.exports = {


  friendlyName: 'Find one',


  description: `Busca un usuario especifico en la base de datos y lo devuelve
  haciendolo funcionar con el buscador si contontine tal dato, en 3 columnas
  el Nombre, Apellido, E-mail`,


  inputs: {
    id: {
      type:'string',
      defaultsTo: '',
      description: `buscara el usuario con la id`
    },
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


  // funcion final de entraga de datos
  fn: async function (inputs, exits) {
    let _ = require('lodash');
    let moment = require('moment');
    let rq = this.req;
    let users = []; // array de usuario nuevo
    let userId = rq.session.userId;
    let isSocket = rq.isSocket;
    let count = 0;

    // Configurando Moment
    moment.locale(sails.config.custom.localeMoment);

    // Verificando que esta pidiendo datos de un usuario y no venga vacio
    if(inputs.id.length === 0){
      return exits.notFound({
        model: 'users',
        count: 0,
        error: true,
        message: `No se encontraron datos en la busqueda del id este usuario: '${inputs.id}'`
      });
    }

    // Verificacion de usuario
    if (!userId && !isSocket) {
      return exits.unauthorized({
        error: true,
        message: 'Unauthorized'
      });
    }

    // funcion de buscador, donde buscara de los 3 la funcion
    let findOneUser = await User.findOne({
      'id': inputs.id
    });


    // Cuenta el numero de resultados
    count = 1;

    // Protegiendo el Password para no visualizarlo en Json
    delete findOneUser.password;
    if (findOneUser.role > 1) {
      delete findOneUser.isSuperAdmin;
    }

    // Change Data Time
    findOneUser.lastSeenAt = moment(findOneUser.lastSeenAt).fromNow();

    // Retorna todos los datos si es correcto
    return exits.success({
      model: 'users',
      count: count,
      list: findOneUser
    });
  }
};
