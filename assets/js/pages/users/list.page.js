parasails.registerPage('list', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    //…
    c: 1,
    listData: {},
    listCount: 0,
    listCountComplete: 0,
    h: 'Data Null',

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
    await this.countComplete();

  },
  mounted: async function() {
    //…
    console.log(this.listData);
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {

    //…
    dataDb: async function () {
      let csrfToken = window.SAILS_LOCALS._csrf;

      await io.socket.request({
        url: '/api/v1/users',
        method: 'POST',
        data: {},
        headers: {
          'content-type': 'application/json',
          'x-csrf-token': csrfToken
        }
      }, (resData, jwres) => {
        // En caso de error
        if (jwres.error) {
          this.progressBar = false;
          if (jwres.statusCode >= 500 && jwres.statusCode <= 599) {
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
        }
      });
    },

    countComplete: async function() {
      let csrfToken = window.SAILS_LOCALS._csrf;
      await io.socket.request({
        url: '/api/v1/users',
        method: 'POST',
        data: {
          count: true
        },
        headers: {
          'content-type': 'application/json',
          'x-csrf-token': csrfToken
        }
      }, (resData, jwres) => {
        if (jwres.statusCode === 200) {
          if(resData.count > this.listCount){
            this.navegationsData = this.numResult = true;
          }
          this.listCountComplete = resData.count;
        }
      });
    }
  }
});
