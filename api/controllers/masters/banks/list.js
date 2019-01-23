/**
 * list.js
 * @description :: Mirar abajo la description ► ↓↓↓
 * @author Saul Navarrov <Sinavarrov@gmail.com>
 * @version 1.0
 */
module.exports = {

  friendlyName: 'Listado de bancos',

  description: `Reune todos el listado de todos los bancos en los que estamos, y los
  asociamos con las cuentas que tenemos creadas.`,

  inputs: {
    count: {
      type: 'boolean',
      defaultsTo: false,
      description: `Permitira hacer el conteo de todos los bancos
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
      description: 'Entrega de listado de bancos Exitosa.'
    },
    notFound: {
      responseType: 'notFound',
      description: 'Datos no encontrados de los bancos o no existe ninguno'
    },
    unauthorized: {
      statusCode: 401,
      responseType: 'unauthorized',
      description: 'No autorizado para ver los resultados de la pagina bancos'
    }
  },


  fn: async function (inputs, exits) {
    /***************************************************************************************
     * VARIABLES INICIALES
     ***************************************************************************************/
    let rq = this.req;
    let userId = rq.session.userId;
    let isSocket = rq.isSocket;
    let count = 0;

    /***************************************************************************************
     * BLOQUE DE SEGURIDAD DE USUARIOS HABILITADOS
     ***************************************************************************************/
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



    /***************************************************************************************
     * TRABAJO DE DATOS DEL SISTEMA
     ***************************************************************************************/
    // Devuelve la cantidad de datos almacenados
    count = await Banks.count();

    // Enviando Numero complto de registros que hay en la base de datos
    if (inputs.count) {
      return exits.success({
        model: 'banks',
        count: count
      });
    }

    // Busco los bancos guardados para entregarlos
    let banks = await Banks.find()
    .limit(inputs.lim)
    .skip(inputs.lim * inputs.sk)
    .select(['id', 'nombre', 'nit', 'consecutive', 'status'])
    .populate('bankAccount');

    // Regresa el numero de los banksAccounts en vez de todos los datos
    if (banks.length > 0) {
      banks.forEach(el => {
        el.bankAccount = el.bankAccount.length;
      });
    }

    // Retorno de datos
    return exits.success({
      model: 'banks',
      count: count,
      list: banks
    });
  }
};
