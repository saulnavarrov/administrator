/**
 * list.page.js
 *
 * @description :: Todas las funciones de la pagina.
 *
 * @src {{proyect}}/assets/js/page/masters/holding/list.page.js
 * @author Saul Navarrov <Sinavarrov@gmail.com>
 * @created 2019/02/14
 * @version 1.0
 */
var d = {};
parasails.registerPage('holdingsList', {
  //  ╔╗ ╔╗╦╔╗ ╔╗╦╔╗ ╦╔═╗
  //  ║╚╦╝║║ ╠═╣ ║║╚╗║╚═╗
  //  ╩   ╩╩╚╝ ╚╝╩╩ ╚╝╚═╝
  mixins: [globalData, globalFunctions],

  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ╠═
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    //…
    modalCreatedProgress: false,

    // Datos para Crear nuevas empresas asociadas
    dataCreated: {
      reasonName: '',
      enrollment: 0,
      identification: 0,
      consecutive: 0,
      status: 'A',
      renewedDate: 0,
      createdDate: '',
      acronym: '',
      emailAddress: '',
      own: '',
      location: 'Medellín',
      maxCustomersEps: 200,
      maxCustomersArl: 200,
      maxCustomersCaja: 200,
      maxCustomersAfp: 200,
    },

    // formCreat

    // Validate Create and Edit
    validateData: {
      reasonName:       { valid: '', mss: '* Campo necesario.'},
      enrollment:       { valid: '', mss: '* Campo necesario.'},
      identification:   { valid: '', mss: '* Campo necesario.'},
      consecutive:      { valid: '', mss: '* Obligatorio'},
      status:           { valid: '', mss: '* Campo necesario.'},
      renewedDate:      { valid: '', mss: '* Campo necesario.'},
      createdDate:      { valid: '', mss: '* Campo necesario.'},
      acronym:          { valid: '', mss: '* Campo necesario.'},
      emailAddress:     { valid: '', mss: '* Campo necesario.'},
      own:              { valid: '', mss: '* Campo necesario.'},
      location:         { valid: '', mss: '* Campo necesario.'},
      maxCustomersEps:  { valid: '', mss: '* Campo necesario.'},
      maxCustomersArl:  { valid: '', mss: '* Campo necesario.'},
      maxCustomersCaja: { valid: '', mss: '* Campo necesario.'},
      maxCustomersAfp:  { valid: '', mss: '* Campo necesario.'},
    }
  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ╠═ ║  ╚╦╝║  ║  ╠═
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function() {
    // Attach any initial data from the server.
    _.extend(this, SAILS_LOCALS);

  },
  mounted: async function() {
    //…
    // Probando las funcionalidades de los mixins integrados
    if (SAILS_LOCALS['_environment'] === 'development') {
      console.log('> Init Holdings list.page');
      console.log(this.globalData);
      console.log(this.globalFunctions);
    }



    // Get Data List
    this.getData();

    // Pruebas create
    this.dataCreated = {
      reasonName: `Name ${String(Date.now())}`,
      enrollment: `${String(Date.now()).substring(3,10)}`,
      identification: Number(String(Date.now()).substring(2,11)),
      consecutive: 0,
      status: 'A',
      renewedDate: 2019,
      createdDate: '2010-02',
      acronym: `Name ${String(Date.now()).substring(9)}`,
      emailAddress: `empresa${String(Date.now()).substring(9)}@example.com`,
      own: 'P',
      location: 'Medellín',
      maxCustomersEps: 200,
      maxCustomersArl: 200,
      maxCustomersCaja: 200,
      maxCustomersAfp: 200,
    },

    this.OpensModals('createHoldings');

    d = this.dataCreated;
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    //…

    /**
     * resetDataMix
     * @description Reiniciara los valores de los campos de formularios
     * y de validacion una vez se cierre el modal.
     * Esta ejecucion viene desde el mixins para todas las funciones.
     * @author Saúl Navarrov <Sinavarrov@gmail.com>
     * @version 1.0
     */
    resetDataMix: async function (){
      // Limpia los valores
      this.resetDataCreated({all:true});
    },

    /**
     * resetDataCreated
     * @description Reiniciara los data del formulario de crecion
     * de nuevas empresas.
     * @param {object} reset contenido para reiniciar los campos sean
     *  form: true => formularios
     *  valid: true => Validaciones
     *  all: true => Todo a la vez
     * @author Saúl Navarrov <Sinavarrov@gmail.com>
     * @version 1.0
     */
    resetDataCreated: async function (reset) {
      // usage
      if (!reset) {throw new Error('El argumento (reset) es de uso obligatorio');}
      if (typeof(reset) !== 'object') {throw new Error('El argumento (reset) solo puede ser de tipo object');}

      // Desglosando variables
      let all = reset.all;
      let form = reset.form;
      let valid = reset.valid;

      // Mandando error sin escoger alguna variable
      if (_.isUndefined(all) && _.isUndefined(form) && _.isUndefined(valid)) {
        throw new Error(`El objecto es invalido. por favor utilize all, form or valid al
        momento de pedir el reinicio de estos datos`);
      }

      // Reinicinado Formulario
      if (all || form) {
        this.dataCreated.reasonName = '';
        this.dataCreated.enrollment = 0;
        this.dataCreated.identification = 0;
        this.dataCreated.consecutive = 0;
        this.dataCreated.status = 'A';
        this.dataCreated.renewedDate = 0;
        this.dataCreated.createdDate = '';
        this.dataCreated.acronym = '';
        this.dataCreated.emailAddress= '';
        this.dataCreated.own = '';
        this.dataCreated.location = 'Medellín';
        this.dataCreated.maxCustomersEps = 200;
        this.dataCreated.maxCustomersArl = 200;
        this.dataCreated.maxCustomersCaja = 200;
        this.dataCreated.maxCustomersAfp = 200;
      }

      // Reiniciando validacion
      if (all || valid) {
        this.validateData.reasonName = {valid: '', mss: '* Campo necesario.'};
        this.validateData.enrollment = {valid: '', mss: '* Campo necesario.'};
        this.validateData.identification = {valid: '', mss: '* Campo necesario.'};
        this.validateData.consecutive = {valid: '', mss: '* Obligatorio'};
        this.validateData.status = {valid: '', mss: '* Campo necesario.'};
        this.validateData.renewedDate = {valid: '', mss: '* Campo necesario.'};
        this.validateData.createdDate = {valid: '', mss: '* Campo necesario.'};
        this.validateData.acronym = {valid: '', mss: '* Campo necesario.'};
        this.validateData.emailAddress = {valid: '', mss: '* Campo necesario.'};
        this.validateData.own = {valid: '', mss: '* Campo necesario.'};
        this.validateData.location = {valid: '', mss: '* Campo necesario.'};
        this.validateData.maxCustomersEps = {valid: '', mss: '* Campo necesario.'};
        this.validateData.maxCustomersArl = {valid: '', mss: '* Campo necesario.'};
        this.validateData.maxCustomersCaja = {valid: '', mss: '* Campo necesario.'};
        this.validateData.maxCustomersAfp = {valid: '', mss: '* Campo necesario.'};
      }
    },


    /**
     * validateData
     * @description Validara los datos antes de ser creados o editados.
     * @returns {boolean}
     * @author Saúl Navarrov <Sinavarrov@gmail.com>
     * @version 1.0
     */
    // validateData: async function (){
    //   let ev = {};


    //   return false;
    // },

    /**
     * btnCreateHolding
     * @description :: Funcion del boton para crear nueva empresa
     * @author Saúl Navarrov <Sinavarrov@gmail.com>
     * @version 1.0
     */
    btnCreateHolding: async function () {
      let csrfToken = window.SAILS_LOCALS._csrf;

      // alert('falta por validar los datos antes de crearlos y confirmar los datos creados, luego mostrar los datos en vista individual rapida')

      // if (this.validateData() || true) {
      if (true) {
        // Aviso
        swal({
          type: 'warning',
          title: 'Creando una nueva empresa',
          text: 'Confirme para crearla',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Confirmar',
          showCancelButton: true,
          cancelButtonText: 'Cancelar'
        }).then(async e => {
          if (e.value) {
            this.openCloseProgressData('show', 'Creando nueva empresa...'); // progress
            this.createAssociatedCompany(csrfToken);
          }
        });
      }
    },

    /**
     * createAssociatedCompany
     * @description :: funcion para crear la nueva empresa
     * @author Saúl Navarrov <Sinavarrov@gmail.com>
     * @version 1.0
     */
    createAssociatedCompany: async function (token) {
      // let urls = '/api/v2/masters/holding/create';

      await Cloud.mastersHoldingCreate.with(d)
        .protocol('io.socket')
        .exec(async (eR, rsData, jwRs) => {
          console.log(eR);
          console.log(rsData);
          console.log(jwRs);
        });

      // let createHol = await Cloud.mastersHoldingCreate.with(this.dataCreated)
      // .protocol('io.socket');

      // console.log(createHol);
      // console.log(createHol.body);

      // Request to backEnd
      // await io.socket.request({
      //   url: urls,
      //   method: 'post',
      //   data: this.dataCreated,
      //   headers: {
      //     'content-type': 'application/json',
      //     'x-csrf-token': token
      //   }
      // }, async (rsData, jwRs) => {
      //   // reset validaciones
      //   this.resetDataCreated({valid:true});
        this.openCloseProgressData('hide', 'clear');

      //   if (jwRs.error) {
      //     // Datos incompeltos
      //     this.createdIncompleteData(rsData, _.isUndefined(rsData.form));
      //     // // Datos repetidos
      //     this.createdDataExisting(rsData, _.isUndefined(rsData.message));
      //     // Mensajes de error
      //     if (jwRs.statusCode >= 499) {
      //       // this.jwRsError(jwRs);
      //       console.error(jwRs);
      //       this.$find(`[id="pm-createHoldings"]`).modal('hide');
      //     }
      //   }

      //   // creado exitosamente
      //   if (jwRs.statusCode === 200) {
      //     // Datos incompeltos
      //     this.createdIncompleteData(false, true);
      //     // Datos repetidos
      //     this.createdDataExisting(false, true);

      //     // fucion para ejcutar aqui


      //   }
      // });
    },


    /**
     * createdIncompleteData
     * @description: Para cuando los datos sean incompletos los muestre en pantalla o borra el mensaje
     * @param {*} dat
     * @param {*} isIncomplete
     * @author Saúl Navarro <Sinavarrov@gmail.com>
     * @version 1.0
     */
    createdIncompleteData: async function (dat, isIncomplete) {
      // mensaje en pantalla
      if (!isIncomplete) {
        swal({
          type: 'info',
          title: dat.data,
          text: 'Por favor, rellene los campos requeridos en rojo'
        });
      }

      // Organizando data
      this.validateData.reasonName.valid = isIncomplete ? '' : dat.form.reasonName === '' ? '' : dat.form.reasonName;
      this.validateData.enrollment.valid = isIncomplete ? '' : dat.form.enrollment === '' ? '' : dat.form.enrollment;
      this.validateData.identification.valid = isIncomplete ? '' : dat.form.identification === '' ? '' : dat.form.identification;
      this.validateData.consecutive.valid = isIncomplete ? '' : dat.form.consecutive === '' ? '' : dat.form.consecutive;
      this.validateData.status.valid = isIncomplete ? '' : dat.form.status === '' ? '' : dat.form.status;
      this.validateData.renewedDate.valid = isIncomplete ? '' : dat.form.renewedDate === '' ? '' : dat.form.renewedDate;
      this.validateData.createdDate.valid = isIncomplete ? '' : dat.form.createdDate === '' ? '' : dat.form.createdDate;
      this.validateData.acronym.valid = isIncomplete ? '' : dat.form.acronym === '' ? '' : dat.form.acronym;
      this.validateData.location.valid = isIncomplete ? '' : dat.form.location === '' ? '' : dat.form.location;
      this.validateData.maxCustomersEps.valid = isIncomplete ? '' : dat.form.maxCustomersEps === '' ? '' : dat.form.maxCustomersEps;
      this.validateData.maxCustomersArl.valid = isIncomplete ? '' : dat.form.maxCustomersArl === '' ? '' : dat.form.maxCustomersArl;
      this.validateData.maxCustomersCaja.valid = isIncomplete ? '' : dat.form.maxCustomersCaja === '' ? '' : dat.form.maxCustomersCaja;
      this.validateData.maxCustomersAfp.valid = isIncomplete ? '' : dat.form.maxCustomersAfp === '' ? '' : dat.form.maxCustomersAfp;
      this.validateData.emailAddress.valid = isIncomplete ? '' : dat.form.emailAddress === '' ? '' : dat.form.emailAddress;
      this.validateData.own.valid = isIncomplete ? '' : dat.form.own === '' ? '' : dat.form.own;
    },


    /**
     * createdDataExisting
     * @description: Para los 3 principales datos si estan repetidos o ya existen
     * @param {*} js
     * @param {*} isRepeat
     * @author Saúl Navarro <Sinavarrov@gmail.com>
     * @version 1.0
     */
    createdDataExisting: async function (js, isRepeat) {
      // Mostrando camposo invalidos
      if (!isRepeat) {
        swal({
          type: 'warning',
          title: 'Los siguientes datos ya existen',
          text: 'Por favor, revise los campos en rojo, ya que existen para otro usuario'
        });

        // Poner campos en rojo
        this.validateData.enrollment.valid = isRepeat ? '' : js.data.enrollment === '' ? '' : js.data.enrollment;
        this.validateData.identification.valid = isRepeat ? '' : js.data.identification === '' ? '' : js.data.identification;
        this.validateData.reasonName.valid = isRepeat ? '' : js.data.reasonName === '' ? '' : js.data.reasonName;
        this.validateData.acronym.valid = isRepeat ? '' : js.data.acronym === '' ? '' : js.data.acronym;
        this.validateData.emailAddress.valid = isRepeat ? '' : js.data.emailAddress === '' ? '' : js.data.emailAddress;
        // Mostrando mensaje
        this.validateData.enrollment.mss = isRepeat ? '' : js.message.enrollment === '' ? '' : js.message.enrollment;
        this.validateData.identification.mss = isRepeat ? '' : js.message.identification === '' ? '' : js.message.identification;
        this.validateData.reasonName.mss = isRepeat ? '' : js.message.reasonName === '' ? '' : js.message.reasonName;
        this.validateData.acronym.mss = isRepeat ? '' : js.message.acronym === '' ? '' : js.message.acronym;
        this.validateData.emailAddress.mss = isRepeat ? '' : js.message.emailAddress === '' ? '' : js.message.emailAddress;
      }
    },

    /**
     * getData
     * @description :: Esta funcion llama a la base de datos y trae 10 primeros
     * resultados, el usuario puede tambien cambiar la cantidad de resultados
     * y la paginacion que desea ver.
     * Cuenta con la opcion de buscador integrado.
     * @author Saúl Navarrov <Sinavarrov@gmail.com>
     * @version 1.0
     */
    getData: async function () {
      const csrfToken = window.SAILS_LOCALS._csrf;
      let urls = '/api/v2/masters/holding/list';

      // this.saludos();

      // console.log / Activa el ProgressBar de cargando usuarios
      // !this.progressBar.active ? this.progressBarD(true, 'fadeInRight faster') : '';

      // Data enviada a la API
      let data = {
        lim: this.limit,
        sk: this.skip,
      };

      // Control de urls find or findOne
      if (this.searching) {
        urls = '/api/v2/masters/holding/search';
        data.finds = this.searchsText;
      }

      // Request list users
      await io.socket.request({
        url: urls,
        method: 'post',
        data: data,
        headers: {
          'content-type': 'application/json',
          'x-csrf-token': csrfToken
        }
      }, async (rsData, jwRs) => {
        // // En caso de error
        // if (jwRs.error) {
        //   this.jwRsError(jwRs);
        // }

        // // Borrar alerta en caso de estar activa warning
        // if (this.alert.active === true && this.alert.animated === 'zoomIn') {
        //   this.alert.animated = 'zoomOut faster';
        //   setTimeout(() => {
        //     this.alert.active = false;
        //     this.alert.animated = '';
        //   }, 505);
        // }

        // Success
        // if (jwRs.statusCode === 200) {
          // this.progressBarD(false);
          // this.tableData = this.search = this.footerTable = this.countData = true;
          // this.listCount = rsData.list.length;
          // this.listData = rsData.list;
          // this.listFullCount = rsData.count;
          // if (rsData.count > this.listCount) {
          //   this.navegationsData = this.numResult = true;
          // }
          // // Method Pagination()
          // this.paginationCount();

          // // cuando se realiza la busqueda
          // if (this.searching && (this.listCount === 0)) {
          //   this.tableData = this.footerTable = false;
          //   this.alert.title = 'No hay Resultados';
          //   this.alert.message = `No se encontraron resultados para la busqueda: ${this.search}`;
          //   // Animación de entrada
          //   this.searchAnimated(true, 'bounceIn');
          // } else {
          //   // Animación de salida.
          //   this.searchAnimated(false);
          // }
        // }
        console.log(jwRs);
      });
    },
  }
});
