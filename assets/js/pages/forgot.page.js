parasails.registerPage('forgot', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    //…

    // Datos que envia
    formData: {
      emailAddress: ''
    },

    // Error en formato
    formError: {
      emailAddress: ''
    },

    // Error en el servidor
    error: '',

    // Envio exitoso
    success: false,

    // Modal del envio del mensaje
    sendForgotModal: false
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
     * sendForgotPassword
     * @description :: Envia los datos para que pueda generar la nueva
     * solicitud de cambio de contraseña o que se le olvido contraseña
     * @author SaulNavarrov <sinavarrov@gmail.com>
     * @version 1.0
     */
    sendForgotPasswordReset: async function () {
      let csrfToken = window.SAILS_LOCALS._csrf;
      let urls = '/api/v1/users/forgot-passwords';
      let send = false;
      let emailRegex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
      let emailAddress = this.formData.emailAddress;

      // validando datos
      send = emailRegex.test(emailAddress);
      this.formError.emailAddress = _.isUndefined(emailAddress) ? 'is-invalid' : '';
      this.formError.emailAddress = emailAddress.length === 0 ? 'is-invalid' : '';
      this.formError.emailAddress = _.isNull(emailAddress) ? 'is-invalid' : '';
      this.formError.emailAddress = !emailRegex.test(emailAddress) ? 'is-invalid' : '';


      // request
      if (send) {
        this.sendForgotModal = true;

        io.socket.request({
          url: urls,
          method: 'PATCH',
          data: {
            emailAddress: emailAddress
          },
          headers: {
            'content-type': 'application/json',
            'x-csrf-token': csrfToken
          }
        }, (resData, jwRes) => {
          console.log(jwRes);

          this.sendForgotModal = false;
          if (jwRes.error) {
            swal({
              title: 'Se ha presentado un Error',
              text: 'Error: Por favor vuelva a intentarlo, si el error persiste, comuniquese con soporte.',
              type: 'warning'
            });
          }

          if (jwRes.statusCode === 200) {
            this.success = true;
            this.formData.emailAddress = '';
          }
        });
      }
    }
  }
});
