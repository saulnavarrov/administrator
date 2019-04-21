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

parasails.registerPage('holdings-list', {
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

  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    //…

    /**
     * btnCreateHolding
     * @description :: Funcion del boton para crear nueva empresa
     * @author Saúl Navarrov <Sinavarrov@gmail.com>
     * @version 1.0
     */
    btnCreateHolding: async function () {
      let csrfToken = window.SAILS_LOCALS._csrf;
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
          this.modalCreatedProgress = true;
          this.openCloseProgressData('show', 'Creando nueva empresa...');
          this.createAssociatedCompany(csrfToken);
        }
      });
    },

    /**
     * createAssociatedCompany
     * @description :: funcion para crear la nueva empresa
     * @author Saúl Navarrov <Sinavarrov@gmail.com>
     * @version 1.0
     */
    createAssociatedCompany: async function (token) {
      let urls = '/api/v2/masters/holding/create';

      // setTimeout(() => {
      //   this.openCloseProgressData('hide', 'clear');
      // }, 15000);

      console.log('Ejecutando request');

      // Request to backEnd
      await io.socket.request({
        url: urls,
        method: 'post',
        data: this.dataCreated,
        headers: {
          'content-type': 'application/json',
          'x-csrf-token': token
        }
      }, async (rsData, jwRs) => {
        this.openCloseProgressData('hide', 'clear');

        console.log(jwRs);
      });
    }
  }
});
