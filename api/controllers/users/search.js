/**
 * find-search.js
 *
 * @description :: Mirar abajo la description ► ↓↓↓
 *
 * @src {{proyect}}/api/controllers/users/find-search.js
 * @author Saul Navarrov <Sinavarrov@gmail.com>
 * @created 2019/01/28
 * @version 1.0
 */
module.exports = {

  friendlyName: 'Find search',

  description: `Buscador de usuarios.`,

  extendedDescription: `Busca un usuario especifico en la base de datos y lo devuelve
  haciendolo funcionar, en 3 columnas
  el Nombre, Apellido, E-mail + id especifico`,

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
    finds: {
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

    return exits.success();
  }
};
