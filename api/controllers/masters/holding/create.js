/**
 * create.js
 *
 * @description :: Todas las funciones de la pagina.
 *
 * @src {{proyect}}/api/controllers/masters/holdings/create.js
 * @author Saul Navarrov <Sinavarrov@gmail.com>
 * @created 2019/02/16
 * @version 1.0
 */
module.exports = {

  friendlyName: 'Create',

  description: 'Create holding.',

  inputs: {
    reasonName: {
      type: 'string',
      maxLength: 256,
      description: `nombre completa de la razon social`
    },
    enrollment: {
      type: 'number',
      description: `numero de registro de camara de comercio`
    },
    identification: {
      type: 'number',
      description: `numero de identificación tributaria (NIT), que expide la camara de comercio`
    },
    consecutive: {
      type: 'number',
      max: 10,
      min: 0,
      description: `consecutivo del nit`
    },
    status: {
      type: 'string',
      defaultsTo: 'A',
      isIn: ['A', 'I', 'S', 'C'],
      description: `Estado en el que se encuntra la empresa ante camara de comercio`
    },
    renewedDate: {
      type: 'number',
      description: `Ultimo año de renovación`
    },
    createdDate: {
      type: 'string',
      description: `Fecha de creación por lo general solo el Año-Mes`
    },
    acronym: {
      type: 'string',
      description: `nombre corto de la empresa o siglas de esta`
    },
    location: {
      type: 'string',
      description: `Ubicación o ciudad donde se registro esta empresa`
    },
    emailAddress: {
      type: 'string',
      description: `Email principal de la empresa que se esta creando`
    },
    own: {
      type: 'string',
      isIn: ['P','T',''],
      description: 'La empresa pertenece a nosotros o es de un tercero'
    },
    maxCustomersEps: {
      type: 'number',
      defaultsTo: 200,
      description: `numero maximo de personas que podran ser afiliados a EPS`
    },
    maxCustomersArl: {
      type: 'number',
      defaultsTo: 200,
      description: `numero maximo de personas que podran ser afiliados a ARL`
    },
    maxCustomersCaja: {
      type: 'number',
      defaultsTo: 200,
      description: `numero maximo de personas que podran ser afiliados a CAJA`
    },
    maxCustomersAfp: {
      type: 'number',
      defaultsTo: 200,
      description: `numero maximo de personas que podran ser afiliados a AFP`
    },
  },

  exits: {
    success: {
      statusCode: 200
    },
    unauthorized: {
      statusCode: 401,
      responseType: 'unauthorized',
      description: 'No autorizado para realizar esta accion'
    },
    notFound: {
      responseType: 'notFoundData',
      description: 'No se puede encontrar para crear'
    },
    badRequest: {
      statusCode: 400,
      responseType: 'badRequest',
      description: 'Error que pueda suceder en change-passwords'
    }
  },

  fn: async function (inputs, exits) {
    /***************************************************************************************
     * VARIABLES INICIALES
     ***************************************************************************************/
    const rq = this.req;
    const rs = this.res;
    const _ = require('lodash');
    const moment = require('moment');
    const userId = rq.session.userId;
    const isSocket = rq.isSocket;
    let dataForm = {};

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
    let autorize = user.role <= 3 ? true : false; // Autorización de usuarios

    // Verifico que usuario tiene pases de seguridad para crear el nuevo usuario
    // Solo los administradores y supervisores pueden crear nuevos usuarios para trabajar
    //  en uniempresas
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
    let ev = dataForm = {
      reasonName: _.isUndefined(inputs.reasonName) ? false : inputs.reasonName.length < 5 ? false : inputs.reasonName,
      acronym: _.isUndefined(inputs.acronym) ? false : inputs.acronym.length < 4 ? false : inputs.acronym,
      enrollment: _.isUndefined(inputs.enrollment) ? false : inputs.enrollment < 1000 ? false : inputs.enrollment,
      identification: _.isUndefined(inputs.identification) ? false : inputs.identification < 1000 ? false : inputs.identification,
      consecutive: inputs.consecutive,
      status: _.isUndefined(inputs.status) ? false : inputs.status,
      renewedDate: _.isUndefined(inputs.renewedDate) ? false : inputs.renewedDate,
      createdDate: _.isUndefined(inputs.createdDate) ? false : inputs.createdDate,
      location: _.isUndefined(inputs.location) ? false : inputs.location,
      maxCustomersEps: _.isUndefined(inputs.maxCustomersEps) ? false : inputs.maxCustomersEps,
      maxCustomersArl: _.isUndefined(inputs.maxCustomersArl) ? false : inputs.maxCustomersArl,
      maxCustomersCaja: _.isUndefined(inputs.maxCustomersCaja) ? false : inputs.maxCustomersCaja,
      maxCustomersAfp: _.isUndefined(inputs.maxCustomersAfp) ? false : inputs.maxCustomersAfp,
    };

    sails.log('Entradas comparacion');
    sails.log(inputs);
    sails.log('-_-_----------------------------');
    sails.log(' Revision de data');
    sails.log(ev);
    // if (
    //   !ev.reasonName ||
    //   !ev.enrollment ||
    //   !ev.identification ||
    //   //  ev.consecutive > -1 ||
    //   !ev.status ||
    //   !ev.renewedDate ||
    //   !ev.createdDate ||
    //   !ev.acronym ||
    //   !ev.location ||
    //   !ev.maxCustomersEps ||
    //   !ev.maxCustomersArl ||
    //   !ev.maxCustomersCaja ||
    //   !ev.maxCustomersAfp
    // ) {
    //   rs.status(409);
    //   return rs.badRequest({
    //     status: 409,
    //     error: true,
    //     data: 'Faltan datos.',
    //     code: 'incomplete_data',
    //     form: {
    //       reasonName: !ev.reasonName ? 'is-invalid' : '',
    //       enrollment: !ev.enrollment ? 'is-invalid' : '',
    //       identification: !ev.identification ? 'is-invalid' : '',
    //       // consecutive: ev.consecutive > -1 ? 'is-invalid' : '',
    //       state: !ev.status ? 'is-invalid' : '',
    //       renewedDate: !ev.renewedDate ? 'is-invalid' : '',
    //       createdDate: !ev.createdDate ? 'is-invalid' : '',
    //       acronym: !ev.acronym ? 'is-invalid' : '',
    //       location: !ev.location ? 'is-invalid' : '',
    //       maxCustomersEps: !ev.maxCustomersEps ? 'is-invalid' : '',
    //       maxCustomersArl: !ev.maxCustomersArl ? 'is-invalid' : '',
    //       maxCustomersCaja: !ev.maxCustomersCaja ? 'is-invalid' : '',
    //       maxCustomersAfp: !ev.maxCustomersAfp ? 'is-invalid' : '',
    //     }
    //   });
    // }



    /***************************************************************************************
     * BLOQUE IDENTIFICACIÓN DE DUPLICIDAD
     ***************************************************************************************/
    // let evalEnrollment = await Holdings.findOne({
    //   enrollment: ev.enrollment
    // }).select(['id']);
    // let evalIdentification = await Holdings.findOne({
    //   identification: ev.identification
    // }).select(['id']);
    // let evalReasonName = await Holdings.findOne({
    //   reasonName: ev.reasonName
    // }).select(['id']);
    // let evalAcronym = await Holdings.findOne({
    //   acronym: ev.acronym
    // }).select(['id']);

    // if (
    //   !_.isUndefined(evalEnrollment) ||
    //   !_.isUndefined(evalIdentification) ||
    //   !_.isUndefined(evalReasonName) ||
    //   !_.isUndefined(evalAcronym)
    // ) {
    //   rs.status(409);
    //   return rs.badRequest({
    //     status: 409,
    //     error: true,
    //     code: 'existing_data',
    //     data: {
    //       enrollment: !_.isUndefined(evalEnrollment) ? 'is-invalid' : '',
    //       identification: !_.isUndefined(evalIdentification) ? 'is-invalid' : '',
    //       reasonName: !_.isUndefined(evalReasonName) ? 'is-invalid' : '',
    //       acronym: !_.isUndefined(evalAcronym) ? 'is-invalid' : '',
    //     },
    //     message: {
    //       enrollment: !_.isUndefined(evalEnrollment) ? 'Ya Existe.' : '',
    //       identification: !_.isUndefined(evalIdentification) ? 'Ya Existe.' : '',
    //       reasonName: !_.isUndefined(evalReasonName) ? 'Ya Existe.' : '',
    //       acronym: !_.isUndefined(evalAcronym) ? 'Ya Existe.' : '',
    //     }
    //   });
    // }



    /***************************************************************************************
     * BLOQUE DE TRABAJO
     ***************************************************************************************/
    // // Organizando Datos
    // dataForm.reasonName = _.startCase(_.toLower(dataForm.reasonName));
    // dataForm.status = _.startCase(_.toLower(dataForm.status));
    // dataForm.renewedDate = _.toNumber(dataForm.renewedDate);
    // dataForm.createdDate = moment(dataForm.createdDate).format();
    // dataForm.acronym = _.startCase(_.toLower(dataForm.acronym));
    // dataForm.location = _.startCase(_.toLower(dataForm.location));
    // dataForm.userCreated = userId;

    // // Guardando información
    // let saveCompany = await Holdings.create(dataForm).fetch();

    // Respondiendo si todo sale bien
    return exits.success({
      message: 'Se ha creado correctamente.',
      one: 'saveCompany'
    });
  }
};
