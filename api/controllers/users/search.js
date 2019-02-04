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
      responseType: 'notFoundData',
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
    const _ = require('lodash');
    const userId = rq.session.userId;
    const isSocket = rq.isSocket;
    let users = []; // array de usuario nuevo
    let count = 0;


    /***************************************************************************************
     * BLOQUE DE SEGURIDAD SOCKET
     ***************************************************************************************/
    // Solo se aceptan solicitudes atravez de socket.io
    if (!isSocket) {
      return exits.unauthorized({
        error: true,
        message: `Solicitud Rechazada.`
      });
    }


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

    // Busco el usuario para verificar si tiene el roll suficiente para  hacer el procedimiento
    let user = await Users.findOne({
      'id': userId
    });
    let autorize = user.role <= 2 ? true : false; // Autorización de usuarios

    // Verifico que usuario tiene pases de seguridad para buscar usuarios
    // Solo los administradores y supervisores pueden hacer una busqueda de los usuario
    // de uniempresas
    if (!autorize) {
      return exits.unauthorized({
        error: true,
        message: `No tienes permisos para realizar esta acción.
        Comunicate con el Administrador para obtener permisos
        necesarios.`
      });
    }


    /***************************************************************************************
     * BLOQUE DE DATOS OBLIGATORIOS Y REVISION DE DATA.
     ***************************************************************************************/
    // Organizando data
    let textSearch = _.isUndefined(inputs.finds) ? false : inputs.finds;

    // Datos necesarios para buscar
    if (!textSearch) {
      this.res.status(406);
      return this.res.badRequest({
        status: 406,
        error: true,
        data: 'Proporcione datos para la busqueda',
        type: 'find_incomplete_Data',
      });
    }


    /***************************************************************************************
     * BLOQUE DE TRABAJO
     ***************************************************************************************/
    // formateando datos para busquedas exactas ya que sin camelcase
    let uid = String(textSearch);
    let searchEmail = _.lowerCase(String(textSearch));
    let searchName = _.startCase(_.lowerCase(String(textSearch)));
    let searchLastName = _.startCase(_.lowerCase(String(textSearch)));

    // Filtro
    let findContainer = [
      { 'id':  uid  },
      // Mayusculas inciales ↓↓↓
      { 'emailAddress': { 'contains': searchEmail } },
      { 'name':         { 'contains': searchName } },
      { 'lastName':     { 'contains': searchLastName } },
      // Texto Bruto ↓↓↓
      { 'emailAddress': { 'contains': textSearch } },
      { 'name':         { 'contains': textSearch } },
      { 'lastName':     { 'contains': textSearch } },
      // Todo en mayusculas ↓↓↓
      { 'emailAddress': { 'contains': _.upperCase(textSearch) } },
      { 'name':         { 'contains': _.upperCase(textSearch) } },
      { 'lastName':     { 'contains': _.upperCase(textSearch) } },
      // { 'role':         { '>=': rq.me.role } }
    ];

    // funcion de buscador, donde buscara de los 3 la funcion
    let findUsers = await Users.find()
      .where({
        'or': findContainer,
        'and': [{'role': {'>=':rq.me.role}}]
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
      .skip(inputs.lim * inputs.sk);

    // Cuenta el numero de resultados
    count = findUsers.length;

    // Protegiendo el Password para no visualizarlo en Json
    for (user of findUsers) {
      // Agrego un manejador en el FrontEnd
      user.check = false;

      delete user.password;
      if (user.role > 1) {
        delete user.isSuperAdmin;
      }
      users.push(user);
    }

    // Retorna todos los datos si es correcto
    return exits.success({
      model: 'users',
      count: count,
      list: users
    });
  }
};
