parasails.registerPage('login', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    //…
    // Main syncing/loading state for this page.
    syncing: false,

    // Progress
    progressLogin: false,

    // Form data
    formData: {
      emailAddress: null,
      password: null,
      rememberMe: false,
    },

    // For tracking client-side validation errors in our form.
    // > Has property set to `true` for each invalid property in `formData`.
    formErrors: {
      /* … */
      emailAddress: false,
      emailLoginError: false,
      emailValid: false,
      password: false
    },

    // A set of validation rules for our form.
    // > The form will not be submitted if these are invalid.
    formRules: {
      emailAddress: {
        required: true,
        isEmail: true
      },
      password: {
        required: true
      },
    },

    // Server error state for the form
    cloudError: '',
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
    // Validacion de Emails
    validateEmail: async function () {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (re.test(this.formData.emailAddress)) {
        this.formErrors.emailAddress = false;
        this.formErrors.emailValid = false;
        return true;
      } else {
        this.formErrors.emailAddress = true;
        this.formErrors.emailValid = true;
        return false;
      }
    },

    // Validación de Passwords
    validatePassword: async function () {
      if (this.formData.password && this.formData.password.length > 5) {
        this.formErrors.password = false;
        return true;
      } else {
        this.formErrors.password = true;
        return false;
      }
    },

    submitLogin: async function () {
      let csrfToken = window.SAILS_LOCALS._csrf;
      let formLogin = new FormData();
      this.progressLogin = true;

      // Creando datos para enviar


      // request login
      axios.post('/api/v2/login', {
        'emailAddress': this.formData.emailAddress,
        'password': this.formData.password,
        'rememberMe': this.formData.rememberMe
      }, {headers: {
        'content-type': 'application/json',
        'x-csrf-token': csrfToken
      }})
        .then(resp => {
          return resp;
        })
        .then(resp => {
          let resData = resp.data;
          location.href = '/';
        })
        .catch(err => {
          this.progressLogin = false;
          this.formErrors.emailAddress = true;
          this.formErrors.emailLoginError = true;
          let data = err.response.data;
          let resp = err.response;

          // Errores
          if (data === 'Unauthorized') {
            swal({
              title: 'Error: Usuario y Contraseña',
              text: 'Error al iniciar sesión, por favor verifique su credencial e intentelo de nuevo, si se equiboca 5 veces el usuario y contraseña se bloqueara. y tendras que solicitar el cambio de contraseña.',
              type: 'warning'
            });
          }

          else if (data.type === 'E-Sr-Ps-NF' || data.type === 'Block-user') {
            swal({
              title: 'Error al iniciar sesión',
              text: data.text,
              type: 'warning'
            });
          }

          else if (data.type === 'E-Sr-Blck-N-Confir') {
            swal({
              title: 'Error al iniciar sesión',
              text: `${data.text.Inactive}
              ${data.text.block}
              ${data.text.confirmed}`,
              type: 'warning'
            });
          }

          else {

            // console.log(resp);
            // console.log(data);
            // console.log(new Error(err));
          }

        });
    },

    /**
     * submittedLogin
     */
    submittedLogin: async function () {
      let validateEmail = await this.validateEmail().then((r)=>{return r;});
      let validatePassword = await this.validatePassword().then((r)=>{return r;});


      if(validateEmail && validatePassword){
        // console.log(`Email: ${validateEmail} + Pass: ${validatePassword} + ${window.SAILS_LOCALS._csrf}`);
        this.submitLogin();
      }
    }
  }
});
