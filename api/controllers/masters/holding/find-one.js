/**
 * find-one.js
 *
 * @description :: Todas las funciones de la pagina.
 *
 * @src {{proyect}}/api/controllers/masters/holdings/find-one.js
 * @author Saul Navarrov <Sinavarrov@gmail.com>
 * @created 2019/02/17
 * @version 1.0
 */
module.exports = {

  friendlyName: 'Find one',

  description: 'usca una empresa en concreto para visualizarla',

  inputs: {
    id: {
      type: 'string',
      defaultsTo: '',
      description: `buscara el usuario con la id`
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
    const moment = require('moment');
    const userId = rq.session.userId;
    const isSocket = rq.isSocket;
    let count = 0;

    // Configurando Moment
    moment.locale(sails.config.custom.localeMoment);


    /***************************************************************************************
     * BLOQUE DE SEGURIDAD SOCKET
     ***************************************************************************************/
    // Solo se aceptan solicitudes atravez de socket.io
    if (!isSocket) {
      return exits.noAuthorize({
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
    let autorize = user.role <= 3 ? true : false; // Autorización de usuarios

    // Verifico que usuario tiene pases de seguridad para visualizar los datos del usuario
    // Solo los administradores y supervisores pueden ver los datos de los usuarios en concreto
    // para trabajar de uniempresas
    if (!autorize) {
      return exits.noAuthorize({
        error: true,
        message: `No tienes permisos para realizar esta acción.
        Comunicate con el Administrador para obtener permisos
        necesarios.`
      });
    }



    /***************************************************************************************
     * BLOQUE DE DATOS OBLIGATORIOS Y REVISION DE DATA.
     ***************************************************************************************/
    // Verificando que esta pidiendo datos de un usuario y no venga vacio
    if (inputs.id.length === 0) {
      return exits.notFound({
        model: 'holdigns',
        count: 0,
        error: true,
        message: `No se encontraron datos en la busqueda del id esta Empresa: '${inputs.id}'`
      });
    }



    /***************************************************************************************
     * BLOQUE DE TRABAJO
     ***************************************************************************************/
    // Buscando compañia
    let oneCompany = await Holdings.findOne({
      'id': inputs.id
    });

    // Numero de resultados
    count = 1;

    // Change Data Time
    oneCompany.createdDate = moment(oneCompany.createdDate).format('llll');
    oneCompany.createdAt = moment(oneCompany.createdAt).format('llll');
    oneCompany.updatedAt = moment(oneCompany.updatedAt).format('llll');

    // Devolviendo resultados.
    return exits.success({
      model: 'holdings',
      count: count,
      one: oneCompany
    });
  }
};
