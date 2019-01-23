parasails.registerPage('banks-list', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    //…
    listData: {}, // Listado de Bancos
    bankData: {
      userCreated: {name: '', lastName: '', },
      bankAccount: [],
    }, // Bancos individuales
    bankAccountOne: { userCreated: {name: '', lastName: '', }, }, // Datos de las cuentas para visualizarlas de manera individual
    listCount: 0, // cantidad de resultados en pantalla
    listFullCount: 0, // Total de resultados
    activeModal: false, // Si el modal de Edicion o edicion esta activo
    titleModal: 'Datos de: ', // Titulo del modal que se abrira
    editTrueData: true, // Habilitar las casillas para editar el usuario
    btnCerrar: 'Cerrar', // Nombre del Btn de cerrar o descartar cambios
    updateProgress: false, // Loading Progress Update ajax Modal
    modalProgress: false, // Loading Progress ajax Modal

    limit: 10, // Limite por reques
    skip: 0, // Omision de datos * limit
    allSelect: false, // selecionar todos
    searchs: '', // Palabras de busquedas
    searching: false, // Buscando o visualizando todos los datos

    // Config display
    progressBar: true,
    tableData: false,
    footerTable: false,
    search: false,
    countData: false,
    navegationsData: false,
    numResult: false,

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

    // Config Alert Display
    alert: {
      active: false,
      icon: 'ion-ios-information-outline',
      title: 'Titulo de la alerta',
      message: 'Mensaje de la alerta content',
      type: 'alert-info'
    },
  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: async function () {
    // Attach any initial data from the server.
    _.extend(this, SAILS_LOCALS);

    // trae toda la base de datos de usuarios
    await this.dataDb();
  },
  mounted: async function () {
    //…

    console.log(' ✔ ');
    console.log('============== Borrar apenas Termine ==============');
    console.log('============== Linea 68 - list.page.js => banks js assets ==============');
    console.log(' ✔ ');
    // await this.findOneView('5c05bf1cbffc1c05e72023cc');
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    //…

    /**
     * dataDb
     * @description Esta funcion llama a la base de datos y trae 10 primeros
     * resultados, el usuario puede tambien cambiar la cantidad de resultados
     * y la paginacion que desea ver.
     * Cuenta con la opcion de buscador integrado.
     *
     * @author SaulNavarrov <sinavarrov@gmail.com>
     * @version 1.0
     */
    dataDb: async function () {
      let urls = '/api/v1/masters/banks';
      let csrfToken = window.SAILS_LOCALS._csrf;
      this.progressBar = true;

      // Control de urls find or findOne
      if (this.searching) {
        urls = '/api/v1/masters/banks/find-search';
      }

      // request list users
      await io.socket.request({
        url: urls,
        method: 'POST',
        data: {
          lim: this.limit,
          sk: this.skip,
          finds: this.searchs
        },
        headers: {
          'content-type': 'application/json',
          'x-csrf-token': csrfToken
        }
      }, (resData, jwres) => {

        // En caso de error
        if (jwres.error) {
          this.jwresError(jwres);
        }

        if (jwres.statusCode === 200) {
          this.progressBar = false;
          this.tableData = this.search = this.footerTable = this.countData = true;
          this.listCount = resData.list.length;
          this.listData = resData.list;
          this.listFullCount = resData.count;
          // Paginación
          if (resData.count > this.listCount) {
            this.navegationsData = this.numResult = true;
          }

          // Funcion de paginación
          this.paginationCount();

          // cuando se realiza la busqueda
          if (this.searching && (this.listCount === 0)) {
            this.tableData = this.footerTable = false;
            this.alert.title = 'No hay Resultados';
            this.alert.message = `No se encontraron resultados para la busqueda: ${this.search}`;
            this.alert.active = true;
          } else {
            this.alert.active = false;
          }
        }
      });
    },

    /**
     * jwresError
     * @description alertas en pantalla en caso de haber un error
     * @param {json} jwres Datos del error
     */
    jwresError: async function (jwres) {
      this.progressBar = false;
      if (jwres.statusCode >= 500 && jwres.statusCode <= 502) {
        this.alert = {
          active: true,
          type: 'alert-danger',
          icon: 'ion-ios-close-outline',
          title: `Error: ${jwres.statusCode} - ${jwres.body}`,
          message: jwres.error.message
        };
      } else if (jwres.statusCode >= 400 && jwres.statusCode <= 499) {
        this.alert = {
          active: true,
          type: 'alert-warning',
          icon: 'ion-ios-close-outline',
          title: `Error: ${jwres.statusCode} - ${jwres.body}`,
          message: jwres.error.message
        };
      }
    },

    /**
     * paginationCount
     * @description Configuracion y renderizacion de paginacion
     * para visualizarla en pantalla
     * @author SaulNavarrov <sinavarrov@gmail.com>
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
     * @description control de la paginacion, esta me permite
     * omitir una cantidad de datos el modificador es skip
     * @author SaulNavarrov <sinavarrov@gmail.com>
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
     * @description Calcula, cambia y activa la paginación minima, en caso
     * de que la paginación este en 10 y se cambie el limite de resultados
     * para que aparescan mas, esto selecciona en numero maximo que queda
     * y configura la pagianción para que se pueda ver.
     * fucniona con el limit y paginationCount
     * @author SaulNavarrov <sinavarrov@gmail.com>
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
     * @description Selecciona todos los datos que estan en pantalla
     * si hay uno seleccionado o varios y selecciona todos, este realiza
     * una seleccion inversa a los datos seleccionados manualmente.
     * @author SaulNavarrov <sinavarrov@gmail.com>
     * @version 1.0
     */
    selectAll: async function () {
      // llama la lista y los va seleccionando 1 por 1
      for (let d of this.listData) {
        // verifica el check que se crea desde el html
        // porque en la DB no viene.
        if (!d.check) {
          d.check = true;
        } else {
          d.check = false;
        }
      }
    },


    /**
     * findOne
     * @description Realiza una busqueda en la base de datos que coincidan
     * con lo escrito en pantalla
     * @author SaulNavarrov <sinavarrov@gmail.com>
     * @version 1.0
     */
    findOneSearch: async function () {

      // Reinicia el buscador
      if (!this.searching) {
        if (this.skip > 0) {
          this.skip = 0;
          this.pagination.a = 0;
        }
        if (this.limit > 10) {
          this.limit = 10;
        }
      }

      // Se activa el modo busqueda en la funcion this.dataDB()
      this.searching = true;

      // realiza la busqueda si searching esta en true y
      // si hay al menos 3 caracteres en pantalla escrito
      if (this.searching && this.searchs.length !== 0) {
        this.dataDb();
      } else {
        this.searching = false;
        this.alert.active = false;
        this.dataDb();
      }
    },


    /**
     * findEnd
     * @description Reinicia la busqueda y pone en pantalla
     * el listado original de datos sin busqueda
     * @author SaulNavarrov <sinavarrov@gmail.com>
     * @version 1.0
     */
    findEndSearch: async function () {
      if (this.searching && this.searchs.length > 0) {
        this.searchs = '';
        this.searching = false;
        this.alert.active = false;
        // Ejecicion del request
        this.dataDb();
      } else {
        // Blanqueando Caja
        this.searchs = '';
      }
    },

    /**
     * findOneView
     * @description
     * @author SaulNavarrov <sinavarrov@gmail.com>
     * @version 1.0
     */
    findOneView: async function (id, title) {
      let csrfToken = window.SAILS_LOCALS._csrf;
      this.titleModal = 'Datos de: ';
      this.progressBar = true;
      let urls = '/api/v1/masters/banks/find-one';
      let modal = $('#pm-bank-view');

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
        method: 'POST',
        data: {
          id: id
        },
        headers: {
          'content-type': 'application/json',
          'x-csrf-token': csrfToken
        }
      }, (resData, jwres) => {

        // En caso de error
        if (jwres.error) {
          this.jwresError(jwres);
        }

        if (jwres.statusCode === 200) {
          // Desactiva el progrees
          this.progressBar = false;
          // carga los datos
          this.bankData = resData.one;
          // pone el estado del modal en activo
          this.activeModal = true;

          // Limpio los datos de las cuentas de bancos.
          this.bankAccountOne = { userCreated: {name: '', lastName: '', } };


          // Eject Modal
          modal.modal('show');

        }
      });
    },


    /**
     * findOneEdith
     * @description Habilita la edicion del banco en la ventana del view
     * para mayor facilidad y trabajo
     * @author SaulNavarrov <sinavarrov@gmail.com>
     * @version 1.0
     */
    findOneEdit: async function (id) {
      // Verifica si el modal esta activo para ejecutar
      // el request
      if (!this.activeModal) {
        this.btnCerrar = 'Descartar Cambios';
        this.editTrueData = false; // Permite editar los datos
        this.findOneView(id, 'Editar datos de: ');
      } else {
        // Si el modal esta habierto cambia el titulo habilita
        // la edicion del usuario
        this.btnCerrar = 'Descartar Cambios';
        this.titleModal = 'Editar datos de: '; // Cambia el titulo del modal
        this.editTrueData = false; // Permite editar los datos
      }
    },

    /**
     * btnUpdateBank
     * @description Guarda los datos editados,
     * pregunta si desea confirmar si desea hacer los cambios.
     * @author SaulNavarrov <sinavarrov@gmail.com>
     * @version 1.0
     */
    btnUpdateBank: async function (id) {
      swal.fire({
        type: 'warning',
        title: '¿Actualizar Cambios?',
        text: `Confirme se desea actualizar el Banco: ${this.bankData.nombre}`,
        showCancelButton: true,
        cancelButtonColor: '#d33',
        confirmButtonColor: '#616161',
        confirmButtonText: 'Actualizar'
      }).then((result) => {
        if (result.value) {
          // Ejecutar el Actualizar Datos.
          this.updateBankData(id);
        }
      });
    },

    /**
     * updateBankData
     * @description request de actualización de datos de los bancos
     * en caso de que acepte que se realizaran los cambios al banco
     * seleccionado.
     * @param {string} id
     * @author SaulNavarrov <sinavarrov@gmail.com>
     * @version 1.0
     */
    updateBankData: async function (id) {
      let csrfToken = window.SAILS_LOCALS._csrf;
      let urls = '/api/v1/masters/banks/update';
      this.updateProgress = true;
      let modal = $('#pm-bank-view');


      // request list update user
      await io.socket.request({
        url: urls,
        method: 'PATCH',
        data: {
          id: this.bankData.id,
          nombre: this.bankData.nombre,
          pais: this.bankData.pais,
          nit: this.bankData.nit,
          consecutive: this.bankData.consecutive,
          phone: this.bankData.phone,
          ach: this.bankData.ach,
          BankNacional: this.bankData.bankNacional,
        }, // this.bankData.
        headers: {
          'content-type': 'application/json',
          'x-csrf-token': csrfToken
        }
      }, (rsData, jwRs) => {

        // En caso de error
        if (jwRs.error) {
          swal({
            type: 'error',
            title: 'Error al actualizar datos',
            text: `Se ha presentado un error inesperado, intentelo nuevamente o consulte con el administrador del sistema`
          });
          console.error(new Error(jwRs));
        }

        // Success Update
        if (jwRs.statusCode === 200) {
          console.log(rsData);

          // Actualización de  datos en pantalla de la lista.
          // this.listData.forEach((el, ix) =>{
          //   if (el.id === id) {
          //     this.listData[ix]. =rsData.bank.
          //   }
          // });
          this.findOneView(id);
          this.closeModalView('pm-user-view'); // Cierra el modal
          this.updateProgress = false;
        }
      });
    },

    /**
     * closeModalView
     * @description Cierra el modal que esta abierto y deja los estados
     * como active modal el false, y editTrueModal false
     * por si se abre el modal en modo vista no abra en modo edición
     * @param {string} modal titulo del modal
     * @author SaulNavarrov <sinavarrov@gmail.com>
     * @version 1.0
     */
    closeModalView: async function (modal, c) {
      this.activeModal = false;
      this.editTrueData = true;
      $(`#${modal}`).modal('hide');
      this.btnCerrar = 'cerrar';

      // limpieza de variables
      if (c === 'bankAccount') {
        this.bankAccountOne = { userCreated: {name: '', lastName: '', } }; // Limpia los Datos
      }
    },

    /**
     * viewAccountBank
     * @description Mostrara en pantalla en modo modal los datos de la cuenta
     * sin momvimientos
     * @param {string} id Cuenta que se buscara para verla en pantalla
     * @author SaulNavarrov <sinavarrov@gmail.com>
     * @version 1.0
     */
    viewAccountBank: async function (id) {
      let csrfToken = window.SAILS_LOCALS._csrf;
      this.modalProgress = true;
      let urls = '/api/v1/masters/bankAccounts/find-one';
      let modal = $('#pm-bankAccount-view');

      // request list users
      await io.socket.request({
        url: urls,
        method: 'POST',
        data: {
          id: id
        },
        headers: {
          'content-type': 'application/json',
          'x-csrf-token': csrfToken
        }
      }, (resData, jwres) => {
        console.log(jwres);

        // En caso de error
        if (jwres.error) {
          this.jwresError(jwres);
        }

        if (jwres.statusCode === 200) {
          // Desactiva el progrees
          this.modalProgress = false;
          // Cargo los datos de la cuenta de banco
          this.bankAccountOne = resData.one;
          // Abrir modal
          modal.modal('show');
        }
      });

    }
  }
});
