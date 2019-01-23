/**
 * update.js
 *
 * @description :: Mirar abajo la description ► ↓↓↓
 *
 * @src {{proyect}}/api/controllers/masters/banks/update.js
 * @author Saul Navarrov <Sinavarrov@gmail.com>
 * @version 1.0
 */
module.exports = {

  friendlyName: 'Update',

  description: 'actualización de datos de los bancos seleccionados',

  inputs: {
    id: {
      type: 'string',
      defaultsTo: '',
      example: 'akdñfjasdf6a8sd4f6as4dfa2sd6fa',
      description: `Id del usuario que se va actualizar los datos`
    },
    nombre: {
      type: 'string',
      example: '',
      description: `Razón social del banco`
    },
    pais: {
      type: 'string',
      example: 'Colombia',
      description: `País de origen del banco`
    },
    nit: {
      type: 'string',
      example: '800123456',
      description: `Numero de identificación tributaria`
    },
    consecutive: {
      type: 'string',
      maxLength: 2,
      example: '0',
      description: `Numero Consecutivo del Nit o de confirmación`
    },
    phone: {
      type: 'string',
      example: '01 8000 912345',
      description: `Numero de atención al cliente`
    },
    ach: {
      type: 'string',
      example: '00',
      description: `Numero unico tributario para giros de cheques en colombia`
    },
    BankNacional: {
      type: 'string',
      isIn: ['', '**', 'Si', 'No'],
      example: 'Si',
      description: `Banco nacional o internacional.`
    },
  },

  exits: {
    success: {
      description: 'Actualización del banco exitosa.'
    },

    notFoundData: {
      responseType: 'notFoundData',
      description: 'Datos no encontrados del banco para actualizar'
    },

    badRequest: {
      responseType: 'badRequest',
      description: `Faltan datos o los datos estan incorrectos`
    },

    unauthorized: {
      statusCode: 401,
      responseType: 'unauthorized',
      description: 'No autorizado actualizar el banco seleccionado'
    }
  },

  fn: async function (inputs, exits) {
    // Variables principales
    let _ = require('lodash');
    let moment = require('moment');
    let rq = this.req;
    let userId = rq.session.userId;
    let isSocket = rq.isSocket;
    let updAt = moment().format();
    let count = 0;

    // Configurando Moment
    moment.locale(sails.config.custom.localeMoment);

    /*************************** BLOQUE DE DATOS OBLIGATORIOS. ****************************/

    sails.log(inputs);
    // ID
    if (inputs.id === '') {
      return exits.badRequest({
        error: true,
        message: 'Faltan datos, por favor verifique e intente nuevamente'
      });
    }


    /******************** BLOQUE DE SEGURIDAD DE USUARIOS HABILITADOS *********************/

    // // Verificacion de usuario
    // if (!userId && !isSocket) {
    //   return exits.unauthorized({
    //     error: true,
    //     message: 'Unauthorized'
    //   });
    // }

    // // Busco el usuario para verificar si tiene el roll suficiente para  hacer el procedimiento
    // let user = await User.findOne({'id': userId});
    // // Autorización de usuarios
    // let autorize = user.role <= 2 ? true : false;
    // // Verifico que usuario tiene pases de seguridad para ver el listado de bancos
    // if (!autorize) { throw 'unauthorized'; }

    /******************** BLOQUE DE SEGURIDAD DE USUARIOS HABILITADOS *********************/
    //                                                                                    *
    //                                                                                    *
    //                                                                                    *
    //                                                                                    *
    /*********************** BLOQUE DE TRABAJO DE DATOS DEL SISTEMA ***********************/

    // Verificación de datos
    let verifiBank = await Banks.count({id: inputs.id});
    // En caso de que el banco no exite, return noFound
    if (verifiBank === 0) {
      return exits.notFoundData({
        error: true,
        message: `No se encontro ningun banco con la Id: ${inputs.id}.
        Verifiquela y vuelva a intentarlos nuevamente.`
      });
    }




    let upBank = [{na:'bank'}];

    return exits.success({
      model: 'banks',
      message: ``,
      bank: upBank[0]
    });
  }
};
