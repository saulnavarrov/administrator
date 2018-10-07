parasails.registerPage('login', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    //…
    // Main syncing/loading state for this page.
    syncing: false,

    // Form data
    formData: {
      emailAddress: null,
      password: null
    },

    // For tracking client-side validation errors in our form.
    // > Has property set to `true` for each invalid property in `formData`.
    formErrors: {
      /* … */
      emailAddress: false,
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

    // Validacion de Emails
    validateEmail: async function () {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (re.test(this.formData.emailAddress)){
        this.formErrors.emailAddress = false;
        return true;
      }else{
        this.formErrors.emailAddress = true;
        return false;
      }
    },

    // Validación de Passwords
    validatePassword: async function () {
      if(this.formData.password && this.formData.password.length > 5){
        this.formErrors.password = false;
        return true;
      }else{
        this.formErrors.password = true;
        return false;
      }
    },

    submitLogin: async function () {
      let csrfToken = window.SAILS_LOCALS._csrf;

      io.socket.request({
        url: '/api/v1/login',
        method: 'POST',
        data: {
          // _csrf: csrfToken
          emailAddress: this.formData.emailAddress,
          password: this.formData.password,
          rememberMe: this.formData.rememberMe
        },
        headers: {
          'content-type': 'application/json',
          'x-csrf-token': csrfToken
        }
      },(resData, jwres) => {
        if (jwres.error) {
          // console.log(jwres); // => e.g. 403
          return;
        }

        if (jwres.statusCode === 200) {
          location.href = '/dashboard';
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
        console.log(`Email: ${validateEmail} + Pass: ${validatePassword} + ${window.SAILS_LOCALS._csrf}`);
        this.submitLogin();
      }
    }
  }
});
