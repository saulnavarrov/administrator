/**
 * cloud.setup.js
 *
 * Configuration for this Sails app's generated browser SDK ("Cloud").
 *
 * Above all, the purpose of this file is to provide endpoint definitions,
 * each of which corresponds with one particular route+action on the server.
 *
 * > This file was automatically generated.
 * > (To regenerate, run `sails run rebuild-cloud-sdk`)
 */
/* eslint-disable */
Cloud.setup({

  methods: {"dashboard":{"verb":"GET","url":"/","args":[]},"register":{"verb":"GET","url":"/singup","args":[]},"login":{"verb":"POST","url":"/api/v1/login","args":["emailAddress","password","rememberMe"]},"forgotPassword":{"verb":"GET","url":"/password/forgot","args":[]},"resetPassword":{"verb":"GET","url":"/password/new","args":[]},"logout":{"verb":"GET","url":"/logout","args":[]},"list":{"verb":"POST","url":"/api/v1/users","args":["count","lim","sk"]},"createUser":{"verb":"POST","url":"/api/v1/users/create","args":["emailAddress","password","name","lastName","phone","role","roleName","isSuperAdmin","emailStatus"]}}

});
/* eslint-enable */
