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
      status: 'A',
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
      status: {valid: '', mss: '* Campo necesario.'},
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

    // Llamando lista de empresas
    this.dataDb();
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
     * searchAnimated
     * @description :: Crea una animación para la alerta cuando no hay
     * resultados esperados, puede cerrar o abrir la alerta con la animación
     * @param {Boolean} act :: Activa o desactiva la animación
     * @param {String} ani :: Animación que se ejecutara
     * @author Saúl Navarrov <Sinavarrov@gmail.com>
     * @version 1.0
     */
    searchAnimated: async function (act, ani) {
      if (act) {
        this.alert.type = 'alert-info';
        this.alert.active = act;
        this.alert.animated = ani;
      } else {
        // Animación Salida
        this.alert.animated = 'fadeOut faster';
        setTimeout(() => {
          this.alert.active = act;
          this.alert.animated = '';
        }, 505);
      }
    },



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
      this.btnCerrar = 'Cerrar';

      // Rest validate
      this.resetValid();
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
            this.dataCreated.status = 'A';
            this.dataCreated.renewedDate = 0;
            this.dataCreated.createdDate = '';
            this.dataCreated.acronym = '';
            this.dataCreated.location = 'Medellín';
            this.dataCreated.maxCustomersEps = 200;
            this.dataCreated.maxCustomersArl = 200;
            this.dataCreated.maxCustomersCaja = 200;
            this.dataCreated.maxCustomersAfp = 200;

            // Rest validate
            this.resetValid();

            // Cerrando Modal
            $(`#pm-create`).modal('hide');
          }
        });
      }
    },



    /**
     * resetValid
     * @description :: Resetea la validación
     * @author Saúl Navarrov <Sinavarrov@gmail.com>
     * @version 1.0
     */
    resetValid: async function () {
      this.validateData.reasonName = {valid: '', mss: '* Campo necesario.'};
      this.validateData.enrollment = {valid: '', mss: '* Campo necesario.'};
      this.validateData.identification = {valid: '', mss: '* Campo necesario.'};
      this.validateData.consecutive = {valid: '', mss: '* Obligatorio'};
      this.validateData.status = {valid: '', mss: '* Campo necesario.'};
      this.validateData.renewedDate = {valid: '', mss: '* Campo necesario.'};
      this.validateData.createdDate = {valid: '', mss: '* Campo necesario.'};
      this.validateData.acronym = {valid: '', mss: '* Campo necesario.'};
      this.validateData.location = {valid: '', mss: '* Campo necesario.'};
      this.validateData.maxCustomersEps = {valid: '', mss: '* Campo necesario.'};
      this.validateData.maxCustomersArl = {valid: '', mss: '* Campo necesario.'};
      this.validateData.maxCustomersCaja = {valid: '', mss: '* Campo necesario.'};
      this.validateData.maxCustomersAfp = {valid: '', mss: '* Campo necesario.'};
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
        // reset valid data
        this.resetValid();

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
          this.createAssociatedCompanyOk(rsData);
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
      this.validateData.status.valid = isIncomplete ? '' : data.form.status === '' ? '' : data.form.status;
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
        this.validateData.enrollment.valid = isRepeat ? '' : js.data.enrollment === '' ? '' : js.data.enrollment;
        this.validateData.identification.valid = isRepeat ? '' : js.data.identification === '' ? '' : js.data.identification;
        this.validateData.reasonName.valid = isRepeat ? '' : js.data.reasonName === '' ? '' : js.data.reasonName;
        this.validateData.acronym.valid = isRepeat ? '' : js.data.acronym === '' ? '' : js.data.acronym;
        // Mostrando mensaje
        this.validateData.enrollment.mss = isRepeat ? '' : js.message.enrollment === '' ? '' : js.message.enrollment;
        this.validateData.identification.mss = isRepeat ? '' : js.message.identification === '' ? '' : js.message.identification;
        this.validateData.reasonName.mss = isRepeat ? '' : js.message.reasonName === '' ? '' : js.message.reasonName;
        this.validateData.acronym.mss = isRepeat ? '' : js.message.acronym === '' ? '' : js.message.acronym;
      }
    },



    /**
     * dataDb
     * @description :: Esta funcion llama a la base de datos y trae 10 primeros
     * resultados, el usuario puede tambien cambiar la cantidad de resultados
     * y la paginacion que desea ver.
     * Cuenta con la opcion de buscador integrado.
     * @author Saúl Navarrov <Sinavarrov@gmail.com>
     * @version 1.0
     */
    dataDb: async function () {
      const csrfToken = window.SAILS_LOCALS._csrf;
      let urls = '/api/v2/masters/holding/list';

      // Activa el ProgressBar de cargando usuarios
      !this.progressBar.active ? this.progressBarD(true, 'fadeInRight faster') : '';

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
        // En caso de error
        if (jwRs.error) {
          this.jwRsError(jwRs);
        }

        // Borrar alerta en caso de estar activa warning
        if (this.alert.active === true && this.alert.animated === 'zoomIn') {
          this.alert.animated = 'zoomOut faster';
          setTimeout(() => {
            this.alert.active = false;
            this.alert.animated = '';
          }, 505);
        }

        // Success
        if (jwRs.statusCode === 200) {
          this.progressBarD(false);
          this.tableData = this.search = this.footerTable = this.countData = true;
          this.listCount = rsData.list.length;
          this.listData = rsData.list;
          this.listFullCount = rsData.count;
          if (rsData.count > this.listCount) {
            this.navegationsData = this.numResult = true;
          }
          // Method Pagination()
          this.paginationCount();

          // cuando se realiza la busqueda
          if (this.searching && (this.listCount === 0)) {
            this.tableData = this.footerTable = false;
            this.alert.title = 'No hay Resultados';
            this.alert.message = `No se encontraron resultados para la busqueda: ${this.search}`;
            // Animación de entrada
            this.searchAnimated(true, 'bounceIn');
          } else {
            // Animación de salida.
            this.searchAnimated(false);
          }
        }
      });
    },



    /**
     * paginationCount
     * @description :: Configuracion y renderizacion de paginacion
     * para visualizarla en pantalla
     * @author Saúl Navarrov <Sinavarrov@gmail.com>
     * @version 1.0
     */
    paginationCount: async function () {
      // calcula la paginacion con desimales
      let a = Number(this.listFullCount) / Number(this.limit);
      // Calcula y redondea hacia arriba la paginacion
      let b = this.pagination.c = Math.ceil(a.toFixed(3));
      // para cuando es menor que 5 devuelva la cantidad de b
      let s = b > this.pagination.v ? this.pagination.v : b;

      // Nuevos calculos para paginacion
      // Variables de configuracion del paginador
      let o = 0; // Arranque del config render
      let p = 2; // Minimo numero antes de centrar select
      let q = 3; // Num Maximo para centrar select
      let r = this.skip; // Skip data
      let m = b; // Num Maximo de Paginaciones
      let l = s; // Num Minimo de Paginaciones Itera si es menor a 5
      let j = r > p ? r - p : 0; // Calculo de centrado
      let k = r > p ? l + r : l; // Calculo de centrado

      // Limpia la lista para volverla a renderizar
      this.pagination.list = [];

      // Config Render Page
      for (o; o < b; o++) {
        this.pagination.list[o] = {
          nn: o + 1,
          aa: '',
          ss: false
        };
      }

      // Renderiza los datos de paginacion activos
      for (j; j < k; j++) {
        // Para mantener la paginacion del 1 al 3
        if (r < q) {
          this.pagination.list[j] = {
            nn: j + 1,
            aa: j === this.pagination.a ? 'active' : '',
            ss: true
          };
        } else if (j < (k - p) && j < m) {
          // Para dar continuacion de 2 en adelante hasta donde
          // alcance la variable "b"
          this.pagination.list[j] = {
            nn: j + 1,
            aa: j === this.pagination.a ? 'active' : '',
            ss: true
          };
        }
      }

      // activate prev
      if (this.pagination.a > 0 && this.pagination.c > this.pagination.v) {
        this.pagination.prev = '';
        this.pagination.pre = true;
      } else {
        this.pagination.prev = 'disabled';
        this.pagination.pre = false;
      }

      // activate next
      if ((this.pagination.a + 1) < this.pagination.c && this.pagination.c > this.pagination.v) {
        this.pagination.next = '';
        this.pagination.nex = true;
      } else {
        this.pagination.next = 'disabled';
        this.pagination.nex = false;
      }
    },



    /**
     * paginationClick
     * @description :: control de la paginacion, esta me permite
     * omitir una cantidad de datos el modificador es skip
     * @param {Number} e :: Numero con el que se omitira una cantidad 'x'
     * de datos para ser visualizados, este funciona mucho con this.limit
     * @author Saúl Navarrov <Sinavarrov@gmail.com>
     * @version 1.0
     */
    paginationClick: async function (e) {
      // Cuando viene un numero
      if (typeof (e) === 'number') {
        // No sobrepase la paginacion
        if ((this.pagination.a > 0) || ((this.pagination.a + 1) < this.pagination.c)) {
          this.skip = e;
          this.pagination.a = e;
          this.dataDb();
        }
      }
    },



    /**
     * skipData
     * @description :: Calcula, cambia y activa la paginación minima, en caso
     * de que la paginación este en 10 y se cambie el limite de resultados
     * para que aparescan mas, esto selecciona en numero maximo que queda
     * y configura la pagianción para que se pueda ver.
     * fucniona con el limit y this.paginationCount();
     * @author Saúl Navarrov <Sinavarrov@gmail.com>
     * @version 1.0
     */
    skipData: async function () {
      // Calculando Skip
      let pres = this.listFullCount - (this.limit * this.skip);
      let p = pres / this.limit;
      p = Math.ceil(p.toFixed(2));

      // Entrando al bucle
      if (this.listFullCount !== 0 && p < 1) {
        let n = p;
        while (n < 1) {
          n++;
          this.skip = this.skip - 1;
          this.pagination.a = this.skip;
        }
      }

      // Ejecicion del request
      this.dataDb();
    },



    /**
     * selectAll
     * @description :: Selecciona todos los datos que estan en pantalla
     * si hay uno seleccionado o varios y selecciona todos, este realiza
     * una seleccion inversa a los datos seleccionados manualmente.
     * @param {Number} x :: DEpendiendo de lo que se halla sellecionado
     * aqui cambiara el tipo de seleccion: todo, nada o inverso
     * @author Saúl Navarrov <Sinavarrov@gmail.com>
     * @version 1.0
     */
    selectAll: async function (x) {
      // Activar Selección
      let selectActive = false;
      // Contador
      let cont = 0;
      // Cuenta la cantidad de repeticiones
      let verifica = 0;

      // Verificando Variable de selección
      if (typeof(x) === 'string') {
        // Evaluación de pantalla
        for (cont; cont < this.listData.length; cont++) {
          if (x === 'a') {
            verifica = !this.listData[cont].check ? verifica + 1 : verifica;
            console.log(verifica)
            if (verifica === 0 && cont === (this.listData.length - 1)) {
              selectActive = false;
              iziToast.error({
                title: 'Ok! Ya todo está seleccionado.',
                position: 'bottomCenter'
              });
            }else{
              selectActive = true;
            }
          } else if (x === 'z') {
            verifica = this.listData[cont].check ? verifica + 1 : verifica;
            if (verifica === 0 && cont === (this.listData.length - 1)) {
              selectActive = false;
              iziToast.error({
                title: 'Error! No hay nada Seleccionado.',
                position: 'bottomCenter'
              });
            } else {
              selectActive = true;
            }
          } else if (x === 'c') {
            selectActive = true;
          }
        }

        // Se activa la selección
        if (selectActive) {
          // llama la lista y los va seleccionando 1 por 1
          if (x === 'a' ) {
            for (let d of this.listData) {
              d.check = true;
            }
            iziToast.success({
              title: 'Se ha seleccionado todo.',
              position: 'bottomCenter'
            });
          }
          // Deseleccionar todo
          else if (x === 'z') {
            for (let d of this.listData) {
              d.check = false;
            }
            iziToast.success({
              title: 'Se ha deseleccionado todo.',
              position: 'bottomCenter'
            });
          }
          // invertir selección
          else if (x === 'c') {
            for (let d of this.listData) {
              if (!d.check) {
                d.check = true;
              } else {
                d.check = false;
              }
            }
            iziToast.success({
              title: 'Se ha Invertido la Selección.',
              position: 'bottomCenter'
            });
          }
          selectActive = false;
          verifica = 0;
        }
      }else{
        console.error(new Error(`Variable no admitida`));
      }
    },


    /**
     * OneViewCompany
     * @description ::
     * @param {String} id ::
     * @author Saúl Navarrov <Sinavarrov@gmail.com>
     * @version 1.0
     */
    OneViewCompany: async function (id, title) {
      const csrfToken = window.SAILS_LOCALS._csrf;
      const urls = '/api/v2/masters/holding/find-one';
      let modal = $('#pm-view-and-edit');
      this.titleModal = 'Datos de: ';
      this.progressBarD(true, 'fadeInRight faster');

      // Cambio de titulo de la ventana
      if (typeof (title) !== 'undefined') {
        this.titleModal = title;
      } else {
        // No permite editar
        this.editTrueData = true;
      }

      // request list users
      await io.socket.request({
        url: urls,
        method: 'post',
        data: {
          id: id
        },
        headers: {
          'content-type': 'application/json',
          'x-csrf-token': csrfToken
        }
      }, (rsData, jwRs) => {
        // En caso de error
        if (jwRs.error) {
          this.jwRsError(jwRs);
        }

        if (jwRs.statusCode === 200) {
          // Desactiva el progrees
          this.progressBarD(false);
          // carga los datos
          // this.userData = rsData.user;

          // pone el estado del modal en activo
          this.activeModal = true;

          // Eject Modal
          modal.modal('show');
          console.log(rsData);
        }

      });
    },


    /**
     * editOneCompany
     * @description ::
     * @param {String} id ::
     * @author Saúl Navarrov <Sinavarrov@gmail.com>
     * @version 1.0
     */
    editOneCompany: async function (id) {

    },


    /**
     * deleteCompany
     * @description ::
     * @param {String} id ::
     * @author Saúl Navarrov <Sinavarrov@gmail.com>
     * @version 1.0
     */
    deleteCompany: async function (id) {

    },
  }
});
