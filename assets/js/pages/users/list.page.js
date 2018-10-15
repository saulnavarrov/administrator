parasails.registerPage('listUsers', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    //…
    c: 1,
    listData: {},
    listCount: 0,
    listFullCount: 0,

    limit: 10,
    skip: 0,
    allSelect: false,
    searchs: '',
    searching: false,

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

    progressBar: true,
    tableData: false,
    footerTable: false,
    search: false,
    countData: false,
    navegationsData: false,
    numResult: false,

    alert: {
      active: false,
      icon: 'ion-ios-information-outline',
      title: 'Titulo de la alerta',
      message: 'Mensaje de la alerta content',
      type: 'alert-info'
    }
  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: async function() {
    // Attach any initial data from the server.
    _.extend(this, SAILS_LOCALS);

    // trae toda la base de datos de usuarios
    await this.dataDb();

    // Conexion con Socket.io Model
    io.socket.on('users', msg =>{
      console.log(msg);
      //  console.log();
    });
  },
  mounted: async function() {
    //…
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {

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
      var urls = '/api/v1/users';
      let csrfToken = window.SAILS_LOCALS._csrf;
      this.progressBar = true;

      // Control de urls find or findOne
      if(this.searching){
        urls = '/api/v1/users/find-search';
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
          this.progressBar = false;
          if (jwres.statusCode >= 500 && jwres.statusCode <= 502) {
            this.alert = {
              active: true,
              type: 'alert-danger',
              icon: 'ion-ios-close-outline',
              title: `Error: ${jwres.statusCode} - ${jwres.body}`,
              message: jwres.error.message
            };
          } else if (jwres.statusCode >= 400 && jwres.statusCode <= 499){
            this.alert = {
              active: true,
              type: 'alert-warning',
              icon: 'ion-ios-close-outline',
              title: `Error: ${jwres.statusCode} - ${jwres.body}`,
              message: jwres.error.message
            };
          }
        }

        if(jwres.statusCode === 200) {
          this.progressBar = false;
          this.tableData = this.search = this.footerTable = this.countData = true;
          this.listCount = resData.list.length;
          this.listData = resData.list;
          this.listFullCount = resData.count;
          if (resData.count > this.listCount) {
            this.navegationsData = this.numResult = true;
          }
          this.paginationCount();
        }
      });
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
      for ( o; o < b; o++ ) {
        this.pagination.list[o] = {
          nn: o + 1,
          aa: '',
          ss: false
        };
      }

      // Renderiza los datos de paginacion activos
      for( j; j < k; j++ ) {
        // Para mantener la paginacion del 1 al 3
        if (r < q) {
          this.pagination.list[j] = {
            nn: j + 1,
            aa: j === this.pagination.a ? 'active' : '',
            ss: true
          };
        }else if( j < ( k-p ) && j < m ) {
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
      if(this.pagination.a > 0 && this.pagination.c > this.pagination.v) {
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
      if (typeof (e) === 'number'){
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
      if(this.listFullCount !== 0 && p < 1){
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
      for (d of this.listData) {
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
      this.searching = true;
      // realiza la busqueda si searching esta en true y
      // si hay al menos 3 caracteres en pantalla escrito
      if(this.searching && this.searchs.length !== 0) {
        this.dataDb();
      }else{
        this.searching = false;
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
      if (this.searching && this.searchs.length === 0) {
        this.searchs = '';
        this.searching = false;

        // Ejecicion del request
        this.dataDb();
      }
    },

    /**
     * findOneUser
     * @description
     * @author SaulNavarrov <sinavarrov@gmail.com>
     * @version 1.0
     */
    findOneUser: async function (id) {
      var urls = '/api/v1/users/findOne';
      let csrfToken = window.SAILS_LOCALS._csrf;
      this.progressBar = true;

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
        // if (jwres.error) {
        //   this.progressBar = false;
        //   if (jwres.statusCode >= 500 && jwres.statusCode <= 502) {
        //     this.alert = {
        //       active: true,
        //       type: 'alert-danger',
        //       icon: 'ion-ios-close-outline',
        //       title: `Error: ${jwres.statusCode} - ${jwres.body}`,
        //       message: jwres.error.message
        //     };
        //   } else if (jwres.statusCode >= 400 && jwres.statusCode <= 499){
        //     this.alert = {
        //       active: true,
        //       type: 'alert-warning',
        //       icon: 'ion-ios-close-outline',
        //       title: `Error: ${jwres.statusCode} - ${jwres.body}`,
        //       message: jwres.error.message
        //     };
        //   }
        // }

        // if(jwres.statusCode === 200) {
          this.progressBar = false;
        //   this.tableData = this.search = this.footerTable = this.countData = true;
        //   this.listCount = resData.list.length;
        //   this.listData = resData.list;
        //   this.listFullCount = resData.count;
        //   if (resData.count > this.listCount) {
        //     this.navegationsData = this.numResult = true;
        //   }
        //   this.paginationCount();
        // }
      });

    },

    /**
     * findOneUserEdith
     * @description
     * @author SaulNavarrov <sinavarrov@gmail.com>
     * @version 1.0
     */
    findOneUserEdith: async function (id) {
      console.log(`findOneUserEdith: ${id}`);
    },

    /**
     * updateUser
     * @description
     * @author SaulNavarrov <sinavarrov@gmail.com>
     * @version 1.0
     */
    updateUser: async function (id) {
      console.log(`updateUser: ${id}`);
    },

    /**
     * toUnlockUser
     * @description
     * @author SaulNavarrov <sinavarrov@gmail.com>
     * @version 1.0
     */
    toUnlockUser: async function (id) {
      console.log(`toUnlockUser: ${id}`);
    },

    /**
     * deleteUser
     * @description
     * @author SaulNavarrov <sinavarrov@gmail.com>
     * @version 1.0
     */
    deleteUser: async function (id) {
      console.log(`deleteUser: ${id}`);
    }
  }
});
