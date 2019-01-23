/**
 * find-one.js
 *
 * @description :: Mirar abajo la description ► ↓↓↓
 *
 * @src {{proyect}}/api/controllers/masters/bank-accounts/find-one.js
 * @author Saul Navarrov <Sinavarrov@gmail.com>
 * @version 1.0
 */

module.exports = {

  friendlyName: 'Find one bank Accounts',

  description: `Busca la cuenta del banco especifico y lo devuelve para ser visto en el modal.`,

  inputs: {
    id: {
      type: 'string',
      defaultsTo: '',
      description: `buscara el banco con la id`
    },
  },

  exits: {
    success: {
      description: 'Entrega de banco Exitosa.'
    },

    notFound: {
      responseType: 'notFound',
      description: 'Datos no encontrados de los banco o no existe ninguno'
    },

    unauthorized: {
      statusCode: 401,
      responseType: 'unauthorized',
      description: 'No autorizado para ver los resultados de la pagina'
    }
  },

  fn: async function (inputs, exits) {
    // Variables principales
    let _ = require('lodash');
    let moment = require('moment');
    let rq = this.req;
    let userId = rq.session.userId;
    let isSocket = rq.isSocket;
    let count = 0;

    // Configurando Moment
    moment.locale(sails.config.custom.localeMoment);

    /******************** BLOQUE DE SEGURIDAD DE USUARIOS HABILITADOS *********************/

    // Verificacion de usuario
    if (!userId && !isSocket) {
      return exits.unauthorized({
        error: true,
        message: 'Unauthorized'
      });
    }

    // Busco el usuario para verificar si tiene el roll suficiente para  hacer el procedimiento
    let user = await User.findOne({'id': userId});
    // Autorización de usuarios
    let autorize = user.role <= 2 ? true : false;
    // Verifico que usuario tiene pases de seguridad para ver el listado de bancos
    if (!autorize) { throw 'unauthorized'; }

    /******************** BLOQUE DE SEGURIDAD DE USUARIOS HABILITADOS *********************/
    //                                                                                    *
    //                                                                                    *
    //                                                                                    *
    //                                                                                    *
    /*********************** BLOQUE DE TRABAJO DE DATOS DEL SISTEMA ***********************/

    // Buscando la cuenta de banco correspondiente
    let findOneAccount = await BankAccounts.findOne({
      'id': inputs.id
    });

    // Llamada al nombre de empresa holding
    findOneAccount.holding = await Holdings.findOne({'id': findOneAccount.holding})
      .select(['acronym']);

    // Formateando datos de holding name
    findOneAccount.holding = findOneAccount.holding.acronym;



    // Traigo el nombre de quien creo la cuenta
    findOneAccount.userCreated = await User.findOne({'id': findOneAccount.userCreated})
      .select(['id','name','lastName']);

    // cantidad de resultados esperados
    count = 1;

    // Formateando fecha de apertura de la cuenta.
    findOneAccount.fechaApertura = `${_.startCase(moment(findOneAccount.fechaApertura, 'YYYYMM').format('dddd'))} - ${_.startCase(moment(findOneAccount.fechaApertura, 'YYYYMM').format('LL'))} - ${moment(findOneAccount.fechaApertura, 'YYYYMM').fromNow()}`;

    // Change Data Time
    findOneAccount.createdAt = moment(findOneAccount.createdAt).format('llll');
    findOneAccount.updatedAt = moment(findOneAccount.updatedAt).format('llll');

    // retorno los datos si es correcto todo
    return exits.success({
      model: 'bankAccounts',
      count: count,
      one: findOneAccount
    });
  }
};
