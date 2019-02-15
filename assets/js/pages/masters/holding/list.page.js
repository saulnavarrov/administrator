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
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    //…
    listData: {}, // Listado de empresas
    oneData: {}, // Datos de la Empresa individuales
    listCount: 0, // cantidad de resultados en pantalla
    listFullCount: 0, // Total de resultados
    activeModal: false, // Si el modal de Edicion o edicion esta activo
    titleModal: 'Datos de: ', // Titulo del modal que se abrira
    editTrueData: true, // Habilitar las casillas para editar el Datos de la Empresa
    btnCerrar: 'Cerrar', // Nombre del Btn de cerrar o descartar cambios
    updateProgress: false, // Loading Progress ajax Modal Actualización de datos
    modalProgress: false, // Progreso para nuevos modales
    modalCreatedProgress: false, // Progreso para nuevos modales

    limit: 10, // Limite por reques
    skip: 0, // Omision de datos * limit
    allSelect: false, // selecionar todos
    searchsText: '', // Palabras de busquedas
    searching: false, // Buscando o visualizando todos los datos

    // control de paginación
    pagination: {
      a: 0,
      c: 0,
      v: 5,
      list: [],
      pre: false,
      prev: 'disabled',
      nex: false,
      next: 'disabled'
    },

    // Config display
    progressBar: {
      active: true,
      animated: ''
    },
    tableData: false,
    footerTable: false,
    search: false,
    countData: false,
    navegationsData: false,
    numResult: false,

    // Config Alert Display
    alert: {
      active: false,
      icon: 'ion-ios-information-outline',
      title: 'Titulo de la alerta',
      message: 'Mensaje de la alerta content',
      type: 'alert-info',
      animated: '',
    },

    // Datos para Crear nuevas empresas asociadas
    dataCreated: {
      reasonName: '',
      enrollment: 0,
      identification: 0,
      consecutive: 0,
      state: 'A',
      renewedDate: 0,
      createdDate: '',
      acronym: '',
      location: 'Medellín',
      maxCustomersEps: 200,
      maxCustomersArl: 200,
      maxCustomersCaja: 200,
      maxCustomersAfp: 200,
    },

    // Validate Create and Edit
    validateData: {
      reasonName: {valid: '', mss: '* Campo necesario.'},
      enrollment: {valid: '', mss: '* Campo necesario.'},
      identification: {valid: '', mss: '* Campo necesario.'},
      consecutive: {valid: '', mss: '* Obligatorio'},
      state: {valid: '', mss: '* Campo necesario.'},
      renewedDate: {valid: '', mss: '* Campo necesario.'},
      createdDate: {valid: '', mss: '* Campo necesario.'},
      acronym: {valid: '', mss: '* Campo necesario.'},
      location: {valid: '', mss: '* Campo necesario.'},
      maxCustomersEps: {valid: '', mss: '* Campo necesario.'},
      maxCustomersArl: {valid: '', mss: '* Campo necesario.'},
      maxCustomersCaja: {valid: '', mss: '* Campo necesario.'},
      maxCustomersAfp: {valid: '', mss: '* Campo necesario.'},
    }
  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function() {
    // Attach any initial data from the server.
    _.extend(this, SAILS_LOCALS);
  },
  mounted: async function() {
    //…
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    //…
    /**
     * closeAlertD
     * @description :: Cierra el alerta en pantalla.
     * @param {Boolean} act :: Activa o desactiva la alerta
     * @param {String} ani :: Tipo de animación
     * @author Saúl Navarrov <Sinavarrov@gmail.com>
     * @version 1.0
     */
    closeAlertD: async function (act, ani) {
      this.alert.animated = 'fadeOut faster';
      setTimeout(() => {
        this.alert.active = false;
        this.alert.animated = '';
      }, 505);
    },


    /**
     * progressBarD
     * @description :: Control de la barra de carga en pantalla, la cual
     * tendra un efecto y un control de entrada y salida.
     * @param {Boolean} act :: Activar o desactivar
     * @param {String} ani :: Animación que se vera en pantalla
     * @author Saúl Navarrov <Sinavarrov@gmail.com>
     * @version 1.0
     */
    progressBarD: async function (act, ani) {
      // Activar
      if (act) {
        this.progressBar.active = true;
        this.progressBar.animated = ani;
      } else {
        this.progressBar.animated = 'fadeOut faster';
        setTimeout(() => {
          this.progressBar.active = false;
          this.progressBar.animated = '';
        }, 505);
      }
    },


    /**
     * closeModalView
     * @description ::  Cierra el modal que esta abierto y deja los estados
     * como active modal el false, y editTrueModal false
     * por si se abre el modal en modo vista no abra en modo edición
     * @param {string} modal titulo del modal
     * @author Saúl Navarrov <Sinavarrov@gmail.com>
     * @version 1.0
     */
    closeModalView: async function (modal) {
      this.activeModal = false;
      this.editTrueData = true;
      $(`#${modal}`).modal('hide');
      this.btnCerrar = 'cerrar';
      this.userData = {}; // Limpia los Datos
    },



    /**
     * jwRsError
     * @description :: alertas en pantalla en caso de haber un error
     * @param {json} jwRs Datos del error
     * @param {Boolean} display :: Usado solo para el Error 404 en caso de
     * querer ver el error 'NotFound' en ventana emergente. y no como una alerta
     * @author Saúl Navarrov <Sinavarrov@gmail.com>
     * @version 1.0
     */
    jwRsError: async function (jwRs, display) {
      this.progressBarD(false);
      if (jwRs.statusCode >= 500 && jwRs.statusCode <= 502) {
        this.alert = {
          active: true,
          animated: 'zoomIn',
          type: 'alert-danger',
          icon: 'ion-ios-close-outline',
          title: `Error: ${jwRs.statusCode} - ${jwRs.body}`,
          message: jwRs.error.message
        };
      } else if (jwRs.statusCode >= 400 && jwRs.statusCode <= 403) {
        this.alert = {
          active: true,
          animated: 'zoomIn',
          type: 'alert-warning',
          icon: 'ion-ios-close-outline',
          title: `Error: ${jwRs.statusCode} - ${jwRs.body.code}`,
          message: jwRs.body.message
        };
      } else if (jwRs.statusCode === 404) {
        if (display) {
          swal({
            type: 'warning',
            title: `${jwRs.statusCode} - ${jwRs.body.title}`,
            text: `${jwRs.body.message}`,
            showCancelButton: false,
            confirmButtonColor: '#616161',
            confirmButtonText: 'Aceptar'
          });
        } else {
          this.alert = {
            active: true,
            animated: 'zoomIn',
            type: 'alert-warning',
            icon: 'ion-ios-close-outline',
            title: `Error: ${jwRs.statusCode} - ${jwRs.body}`,
            message: jwRs.body.data
          };
        }
      } else if (jwRs.statusCode === 406) {
        this.alert = {
          active: true,
          type: 'alert-warning',
          animated: 'zoomIn',
          icon: 'ion-ios-close-outline',
          title: `Error: ${jwRs.statusCode} - ${jwRs.body.type}`,
          message: jwRs.body.data
        };
      }
    },



    /**
     * btnOpenModalCreateH
     * @description :: Abrira o cerrara el modal para crear nuevas
     * empresas asociadas al holding
     * @param {string} oc :: Corresponde a 2 estados:
     * open: Abrira el modal,
     * close: Cerrara el modal y reseteara los datos
     * @author Saúl Navarrov <Sinavarrov@gmail.com>
     * @version 1.0
     */
    btnOpenModalCreateH: async function (oc) {
      // Abrir modal
      if (oc === 'open') {
        $(`#pm-create`).modal('show');
      }
      // Cerrar modal y resetear datos
      if (oc === 'close') {
        swal({
          type: 'warning',
          title: 'Cuidado',
          text: 'Esta a punto de perder todos los cambios realizados. ¿Desea proseguir?',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Confirmar',
          showCancelButton: true,
          cancelButtonText: 'volver'
        }).then(async e => {
          if (e.value) {
            // reset
            this.dataCreated.reasonName = '';
            this.dataCreated.enrollment = 0;
            this.dataCreated.identification = 0;
            this.dataCreated.consecutive = 0;
            this.dataCreated.state = 'A';
            this.dataCreated.renewedDate = 0;
            this.dataCreated.createdDate = '';
            this.dataCreated.acronym = '';
            this.dataCreated.location = 'Medellín';
            this.dataCreated.maxCustomersEps = 200;
            this.dataCreated.maxCustomersArl = 200;
            this.dataCreated.maxCustomersCaja = 200;
            this.dataCreated.maxCustomersAfp = 200;

            // Cerrando Modal
            $(`#pm-create`).modal('hide');
          }
        });
      }
    },


    /**
     * btnCreateAssociatedCompany
     * @description :: Funcion del boton para crear nueva empresa
     * @author Saúl Navarrov <Sinavarrov@gmail.com>
     * @version 1.0
     */
    btnCreateAssociatedCompany: async function () {
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

      await io.socket.request({
        url: urls,
        method: 'post',
        data: this.dataCreated,
        headers: {
          'content-type': 'application/json',
          'x-csrf-token': token
        }
      }, async (rsData, jwRs) => {
        if (jwRs.error) {
          // Datos incompeltos
          this.createdIncompleteData(rsData, _.isUndefined(rsData.form));
          // Datos repetidos
          this.createdDataExisting(rsData, _.isUndefined(rsData.message));
          // Mensajes de error
          if (jwRs.statusCode >= 499) {
            this.jwRsError(jwRs);
            $(`#pm-create`).modal('hide');
          }
        }

        if (jwRs.statusCode === 200) {
          // Datos incompeltos
          this.createdIncompleteData(false, true);
          // Datos repetidos
          this.createdDataExisting(false, true);

          // Mostrar datos de la nueva empresa
          this.createAssociatedCompanyOk(rsData)
        }
        this.modalCreatedProgress = false;
      });
    },



    /**
     * createAssociatedCompanyOk
     * @description :: Se ha guardado la información de manera correcta y se
     * visualizara en pantalla
     * @param {json} js :: Información del Empresa para mostrar en pantalla.
     * @author Saúl Navarro <Sinavarrov@gmail.com>
     * @version 1.0
     */
    createAssociatedCompanyOk: async function (js) {
      console.log('Se ha creado por completo la nueva empresa');
      console.log(js);
      console.log('a trabajar en el resto de la app');
    },



    /**
     * createdIncompleteData
     * @description :: Para cuando los datos sean incompletos los muestre en pantalla o borra el mensaje
     * @param {json} data :: Datos desde el servidor para validar en pantalla
     * @param {boolean} isIncomplete :: Valida si viene datos a validar en pantalla
     * @author Saúl Navarro <Sinavarrov@gmail.com>
     * @version 1.0
     */
    createdIncompleteData: async function (data, isIncomplete) {
      if (!isIncomplete) {
        swal({
          type: 'info',
          title: 'Datos incompletos',
          text: 'Por favor, rellene los campos requeridos en rojo'
        });
      }
      this.validateData.reasonName.valid = isIncomplete ? '' : data.form.reasonName === '' ? '' : data.form.reasonName;
      this.validateData.enrollment.valid = isIncomplete ? '' : data.form.enrollment === '' ? '' : data.form.enrollment;
      this.validateData.identification.valid = isIncomplete ? '' : data.form.identification === '' ? '' : data.form.identification;
      this.validateData.consecutive.valid = isIncomplete ? '' : data.form.consecutive === '' ? '' : data.form.consecutive;
      this.validateData.state.valid = isIncomplete ? '' : data.form.state === '' ? '' : data.form.state;
      this.validateData.renewedDate.valid = isIncomplete ? '' : data.form.renewedDate === '' ? '' : data.form.renewedDate;
      this.validateData.createdDate.valid = isIncomplete ? '' : data.form.createdDate === '' ? '' : data.form.createdDate;
      this.validateData.acronym.valid = isIncomplete ? '' : data.form.acronym === '' ? '' : data.form.acronym;
      this.validateData.location.valid = isIncomplete ? '' : data.form.location === '' ? '' : data.form.location;
      this.validateData.maxCustomersEps.valid = isIncomplete ? '' : data.form.maxCustomersEps === '' ? '' : data.form.maxCustomersEps;
      this.validateData.maxCustomersArl.valid = isIncomplete ? '' : data.form.maxCustomersArl === '' ? '' : data.form.maxCustomersArl;
      this.validateData.maxCustomersCaja.valid = isIncomplete ? '' : data.form.maxCustomersCaja === '' ? '' : data.form.maxCustomersCaja;
      this.validateData.maxCustomersAfp.valid = isIncomplete ? '' : data.form.maxCustomersAfp === '' ? '' : data.form.maxCustomersAfp;
    },


    /**
     * createdDataExisting
     * @description :: Para los 3 principales datos si estan repetidos o ya existen
     * @param {json} js :: Datos a validar en pantalla
     * @param {boolean} isRepeat :: Valida si vienen datos a validar en patalla
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
        this.validateData.enrollment = js.data.enrollment === '' ? '' : js.data.enrollment;
        this.validateData.identification = js.data.identification === '' ? '' : js.data.identification;
        this.validateData.reasonName = js.data.reasonName === '' ? '' : js.data.reasonName;
        this.validateData.acronym = js.data.acronym === '' ? '' : js.data.acronym;
        // Mostrando mensaje
        this.validateData.enrollment = js.message.enrollment === '' ? '' : js.message.enrollment;
        this.validateData.identification = js.message.identification === '' ? '' : js.message.identification;
        this.validateData.reasonName = js.message.reasonName === '' ? '' : js.message.reasonName;
        this.validateData.acronym = js.message.acronym === '' ? '' : js.message.acronym;
      }

      // Rest Data
      else {
        this.validateData.reasonName = {valid: '', mss: '* Campo necesario.'};
        this.validateData.enrollment = {valid: '', mss: '* Campo necesario.'};
        this.validateData.identification = {valid: '', mss: '* Campo necesario.'};
        this.validateData.acronym = {valid: '', mss: '* Campo necesario.'};
      }
    }
  }
});
