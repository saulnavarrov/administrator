parasails.registerPage('contacto', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    //…
    // Main syncing/loading state for this page.
    syncing: false,

    // Form data
    formData: { /* … */
      fullName: '',
      emailAddress: '',
      phone: '',
      topic: '',
      message: ''
    },

    // For tracking client-side validation errors in our form.
    // > Has property set to `true` for each invalid property in `formData`.
    formErrors: { /* … */
      fullName: '',
      emailAddress: '',
      phone: '',
      topic: '',
      message: ''
    },

    // Server error state for the form
    cloudError: '',

    // Success state when form has been submitted
    cloudSuccess: false,

    // Modal del envio del mensaje
    sendMessageModal: false
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
     * sendMessageContact
     * @description :: Envio del mensaje interno al correo electronico
     * @author SaulNavarrov <sinavarrov@gmail.com>
     * @version 1.0
     */
    sendMessageContact: async function () {
      let csrfToken = window.SAILS_LOCALS._csrf;
      let urls = '/api/v1/deliver-contact-form-message';
      let send = false;

      // Validando datos
      let fullName =      this.formData.fullName.length === 0 ?     true : false;
      let emailAddress =  this.formData.emailAddress.length === 0 ? true : false;
      let phone =         this.formData.phone.length === 0 ?        true : false;
      let topic =         this.formData.topic.length === 0 ?        true : false;
      let message =       this.formData.message.length === 0 ?      true : false;

      // evaluando data
      this.formErrors.fullName = fullName ? 'is-invalid' : '';
      this.formErrors.emailAddress = emailAddress ? 'is-invalid' : '';
      this.formErrors.phone = phone ? 'is-invalid' : '';
      this.formErrors.topic = topic ? 'is-invalid' : '';
      this.formErrors.message = message ? 'is-invalid' : '';
      if (fullName || emailAddress || phone || topic || message) {
        send = false;
      }else{
        send = true;
      }

      // Enviando data
      if (send) {
        this.sendMessageModal = true;
        await io.socket.request({
          url:urls,
          method: 'POST',
          data: this.formData,
          headers: {
            'content-type': 'application/json',
            'x-csrf-token': csrfToken
          }
        }, (resData, jwRes) => {
          this.sendMessageModal = false;
          // En caso de error
          if (jwRes.error) {
            swal({
              title: 'Mensaje no enviado',
              text: 'Tu mensaje no puede ser entregado en este instante, por favor intentalo mas tarde o comunicate a los numeros que estan en la parte derecha. Con gusto te atenderemos.',
              type: 'warning'
            });
          }

          if (jwres.statusCode === 200) {
            swal('Mensaje enviado', 'El mensaje se envio con exito', 'success');
            this.formData.fullName = '';
            this.formData.emailAddress = '';
            this.formData.phone = '';
            this.formData.topic = '';
            this.formData.message = '';
          }
        });
      }
    },

    modalMapa: async function () {
      //
      $('#m-mapa').modal('show');
    }
  }
});
