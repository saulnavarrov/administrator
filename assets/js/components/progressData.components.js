/**
 * progressData.components.js
 *
 * @description :: Todas las funciones de la pagina.
 *
 * @src {{proyect}}/assets/js/components/progressData.components.js
 * @author Saul Navarrov <Sinavarrov@gmail.com>
 * @created 2019/04/20
 * @version 1.0
 *
 * @usage ::
 *
 * <progress-data></progress-data>
 */

parasails.registerComponent('progress-data', {

  //  ╔╗ ╔╗╦╔╗ ╔╗╦╔╗ ╦╔═╗
  //  ║╚╦╝║║ ╠═╣ ║║╚╗║╚═╗
  //  ╩   ╩╩╚╝ ╚╝╩╩ ╚╝╚═╝
  // mixins: [],

  //  ╔═╗╦═╗╔═╗╔═╗╔═╗
  //  ╠═╝╠╦╝║ ║╠═╝╚═╗
  //  ╩  ╩╚═╚═╝╩  ╚═╝
  props: [
    'act',
    'h1'
  ],

  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: function () {
    return {
      //…
    };
  },

  //  ╦ ╦╔╦╗╔╗ ╔╗╦
  //  ╠═╣ ║ ║╚╦╝║║
  //  ╩ ╩ ╩ ╩   ╩╩═╝
  template: `
    <div class="container-fluit m-loading-content animated fadeIn faster" v-show="act" style="display:none;">
    <div class="row m-loading-popup">
      <div class="col-12 text-center">
        <h1>{{ h1 }}</h1>
      </div>
      <div class="col-12">
        <div class="progress">
          <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="75"
            aria-valuemin="0" aria-valuemax="100" style="width: 100%"></div>
        </div>
      </div>
    </div>
  </div>
  `,

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function() {
    //…
  },
  mounted: async function(){
    //…
    // Probando las funcionalidades de los mixins integrados
    if (SAILS_LOCALS['_environment'] === "development") {
      console.log('> Init progressData.components');
    }
  },
  beforeDestroy: function() {
    //…
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {

  }
});
