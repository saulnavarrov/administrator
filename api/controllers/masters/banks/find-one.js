/**
 * find-one.js
 * @description :: Mirar abajo la description ► ↓↓↓
 * @author Saul Navarrov <Sinavarrov@gmail.com>
 * @version 1.0
 */
module.exports = {

  friendlyName: 'Find one bank',

  description: `Busca un banco especifico y lo devuelve para ser visto en el modal.`,

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

    // funcion de buscador, donde buscara de los 3 la funcion
    let findOneBank = await Banks.findOne({
      'id': inputs.id,
    });

    // Busco el usuario asociado que lo ha creado
    findOneBank.userCreated = await User.findOne({'id': findOneBank.userCreated})
      .select(['id','name','lastName']);

    // Cuenta el numero de resultados
    count = 1;

    // Protegiendo el Password para no visualizarlo en Json

    // Change Data Time
    findOneBank.createdAt = moment(findOneBank.createdAt).format('llll');
    findOneBank.updatedAt = moment(findOneBank.updatedAt).format('llll');

    // Retorna todos los datos si es correcto
    return exits.success({
      model: 'banks',
      count: count,
      one: findOneBank
    });

  }


};

/*
  bankaccount: ""
  consecutive: "8"
  createdAt: "lun., 3 de dic. de 2018 18:41" ===
  id: "5c05bf1cbffc1c05e72023cc" ===
  nit: "890903938"
  nombre: "Bancolombia"
  pais: "Colombia"
  status: "A"
  updatedAt: "lun., 3 de dic. de 2018 18:41" ===
  userCreated: "" ===
*/

/*
<section class="row">

  <div class="col-sm-2">
    <p>Status: {{ bankData.status }}</p>
  </div>
  <div class="col-sm-4">
    <div class="form-group row">
      <div class="col-sm-2">Rol:</div>
      <div class="col-sm-10">
        <select class="form-control form-control-sm" style="font-size: 13px;height: 30px;line-height: 30px;padding: 0px 10px 2px 9px;margin: 0px;" v-bind:disabled="editTrueData" v-model="bankData.role">
        <% if(me.role < 1) { %>
          <option value="0">00 - Super Admin</option>
        <% } %>
          <option value="1">01 - Administrador</option>
          <option value="2">02 - Supervisor</option>
          <option value="3">03 - Secretario</option>
          <option value="4">04 - Vendedores</option>
          <option value="5">05 - </option>
          <option value="6">06 - </option>
          <option value="7">07 - Usuario</option>
          <option value="8">08 - Client</option>
          <option value="9">09 - Guest</option>
        </select>
      </div>
    </div>
  </div>
</section>

<hr>
<section class="row">
  <div class="col-sm-12 col-lg-4">
      <div class="form-group">
        <label>Nombres</label>
        <input type="text" class="form-control form-control-sm" v-model="bankData.nombre" v-bind:disabled="editTrueData">
    </div>
  </div>
  <div class="col-sm-12 col-lg-4">
      <div class="form-group">
        <label>Nit </label>
        <input type="text" class="form-control form-control-sm" v-model="bankData.nit" v-bind:disabled="editTrueData">
    </div>
  </div>
  <div class="col-sm-12 col-lg-4">
    <div class="form-group">
        <label>Consecutivo </label>
        <input type="text" class="form-control form-control-sm" v-model="bankData.consecutive" v-bind:disabled="editTrueData">
    </div>
  </div>
</section>
<section class="row">
  <div class="col-sm-12 col-lg-4">
      <div class="form-group">
        <label>E-mail</label>
        <input type="text" class="form-control form-control-sm" v-model="bankData.emailAddress" v-bind:disabled="editTrueData">
    </div>
  </div>
  <div class="col-sm-12 col-lg-4">
    <div class="form-group">
      <label>E-mail Status:</label>
      <select class="form-control form-control-sm" style="font-size: 13px;height: 30px;line-height: 30px;padding: 0px 10px 2px 9px;margin: 0px;" v-bind:disabled="editTrueData" v-model="bankData.emailStatus">
        <option value="unconfirmed">No Confirmado</option>
        <option value="changeRequested">Cambio Requisito</option>
        <option value="confirmed">Confirmado</option>
      </select>
    </div>
  </div>
  <div class="col-sm-12 col-lg-4">
      <div class="form-group">
        <label>Telefono</label>
        <input type="text" class="form-control form-control-sm" v-model="bankData.phone" v-bind:disabled="editTrueData">
    </div>
  </div>
</section>
<section class="row">
  <div class="col-sm-12 col-lg-4">
    <div class="form-group">
      <label for="">Ultima login:</label>
      <input type="text" class="form-control form-control-sm" v-model="bankData.lastSeenAt" disabled>
    </div>
  </div>

</section>


<section class="row">
  <div class="col-sm-12 col-lg-4">
    <h5>Miselanea</h5>
  </div>
</section>

<section class="row">
  <div class="col-sm-12 col-lg-4">
    <div class="form-group">
      <label for="">Ultima Ip:</label>
      <input type="text" class="form-control form-control-sm" v-model="bankData.tosAcceptedByIp" disabled>
    </div>
  </div>
  <div class="col-sm-12 col-lg-4">
    <div class="form-group">
      <label for="">Password Rest Token</label>
      <input type="text" class="form-control form-control-sm" v-model="bankData.passwordResetToken" disabled>
    </div>
  </div>
  <div class="col-sm-12 col-lg-4">
    <div class="form-group">
      <label for="">Password Reset Token Exp</label>
      <input type="text" class="form-control form-control-sm" v-model="bankData.passwordResetTokenExpiresAt" disabled>
    </div>
  </div>
</section>
<section class="row">
  <div class="col-sm-12 col-lg-4">
    <div class="form-group">
      <label for="">Email Proof Token</label>
      <input type="text" class="form-control form-control-sm" v-model="bankData.emailProofToken" disabled>
    </div>
  </div>
  <div class="col-sm-12 col-lg-4">
    <div class="form-group">
      <label for="">Email Proof Token Exp</label>
      <input type="text" class="form-control form-control-sm" v-model="bankData.emailProofTokenExpiresAt" disabled>
    </div>
  </div>
  <div class="col-sm-12 col-lg-4">
    <div class="form-group">
      <label for="">Email Change Candidate</label>
      <input type="text" class="form-control form-control-sm" v-model="bankData.emailChangeCandidate" disabled>
    </div>
  </div>
</section>

*/
