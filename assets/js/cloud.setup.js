
/**
 * cloud.setup.js
 *
 * Configuration for this Sails app's generated browser SDK ("Cloud").
 *
 * Above all, the purpose of this file is to provide endpoint definitions,
 * each of which corresponds with one particular route+action on the server.
 *
 * This file was automatically generated. +new Date()+
 * > This file was automatically generated.
 * > (To regenerate, run sails run rebuild-cloud-sdk)
 *
 */

Cloud.setup({
  /* eslint-disable */
  methods: {
  "usersConfirmEmails": {
    "verb": "GET",
    "url": "/email/confirm",
    "args": [
      "token"
    ]
  },
  "usersViewConfirmedUserEmail": {
    "verb": "GET",
    "url": "/email/confirmed",
    "args": []
  },
  "usersViewForgotPassword": {
    "verb": "GET",
    "url": "/password/forgot",
    "args": []
  },
  "usersViewNewPassword": {
    "verb": "GET",
    "url": "/password/new",
    "args": [
      "token"
    ]
  },
  "authLogout": {
    "verb": "GET",
    "url": "/logout",
    "args": []
  },
  "usersViewList": {
    "verb": "GET",
    "url": "/users",
    "args": []
  },
  "usersViewCreateUsers": {
    "verb": "GET",
    "url": "/users/create",
    "args": []
  },
  "customersViewList": {
    "verb": "GET",
    "url": "/customers",
    "args": []
  },
  "mastersHoldingViewList": {
    "verb": "GET",
    "url": "/masterFul/holdings",
    "args": []
  },
  "mastersHoldingList": {
    "verb": "POST",
    "url": "/api/v2/masters/holding/list",
    "args": [
      "count",
      "lim",
      "sk"
    ]
  },
  "mastersHoldingCreate": {
    "verb": "POST",
    "url": "/api/v2/masters/holding/create",
    "args": [
      "reasonName",
      "enrollment",
      "identification",
      "consecutive",
      "status",
      "renewedDate",
      "createdDate",
      "acronym",
      "location",
      "emailAddress",
      "own",
      "maxCustomersEps",
      "maxCustomersArl",
      "maxCustomersCaja",
      "maxCustomersAfp"
    ]
  },
  "mastersHoldingFindOne": {
    "verb": "POST",
    "url": "/api/v2/masters/holding/find-one",
    "args": [
      "id"
    ]
  },
  "mastersHoldingSearch": {
    "verb": "POST",
    "url": "/api/v2/masters/holding/search",
    "args": []
  },
  "authLogin": {
    "verb": "POST",
    "url": "/api/v2/login",
    "args": [
      "emailAddress",
      "password",
      "rememberMe"
    ]
  },
  "usersList": {
    "verb": "POST",
    "url": "/api/v2/users",
    "args": [
      "count",
      "lim",
      "sk"
    ]
  },
  "usersCreateUsers": {
    "verb": "POST",
    "url": "/api/v2/users/create",
    "args": [
      "identification",
      "emailAddress",
      "password",
      "name",
      "lastName",
      "phone",
      "role",
      "isSuperAdmin",
      "emailStatus",
      "status"
    ]
  },
  "usersFindOne": {
    "verb": "POST",
    "url": "/api/v2/users/find-one",
    "args": [
      "id"
    ]
  },
  "usersSearch": {
    "verb": "POST",
    "url": "/api/v2/users/search",
    "args": [
      "count",
      "lim",
      "sk",
      "finds"
    ]
  },
  "usersUpdateAvatar": {
    "verb": "PATCH",
    "url": "/api/v2/users/update-avatar",
    "args": [
      "uid",
      "type",
      "nameFile",
      "sizeFile"
    ]
  },
  "usersUpdateDataUser": {
    "verb": "PATCH",
    "url": "/api/v2/users/update-data-user",
    "args": [
      "id",
      "role",
      "name",
      "lastName",
      "superAdmin",
      "emailAddress",
      "emailStatus",
      "phone",
      "status"
    ]
  },
  "usersUpdatedUnblock": {
    "verb": "PATCH",
    "url": "/api/v2/users/update-unblock",
    "args": [
      "id",
      "ed"
    ]
  },
  "usersUpdatedActiveAccount": {
    "verb": "PATCH",
    "url": "/api/v2/users/update-active-account",
    "args": [
      "id",
      "status"
    ]
  },
  "usersUpdatedChangeEmail": {
    "verb": "PATCH",
    "url": "/api/v2/users/update-change-email",
    "args": [
      "id",
      "newEmail",
      "confirmNewEmail"
    ]
  },
  "usersUpdatedReconfirmEmail": {
    "verb": "PATCH",
    "url": "/api/v2/users/update-reconfirm-email",
    "args": [
      "id"
    ]
  },
  "usersUpdatedChangePassword": {
    "verb": "PATCH",
    "url": "/api/v2/users/update-change-password",
    "args": [
      "id",
      "confirm"
    ]
  },
  "usersForgotPasswords": {
    "verb": "PATCH",
    "url": "/api/v2/users/forgot-passwords",
    "args": [
      "emailAddress"
    ]
  },
  "usersUpdatePasswordAndLogin": {
    "verb": "PATCH",
    "url": "/api/v2/users/update-password-and-login",
    "args": [
      "password",
      "token"
    ]
  },
  "usersDeletes": {
    "verb": "DELETE",
    "url": "/api/v2/users/delete-users",
    "args": [
      "id"
    ]
  },
  "deliverContactFormMessages": {
    "verb": "POST",
    "url": "/api/v2/deliver-contact-form-message",
    "args": [
      "emailAddress",
      "phone",
      "topic",
      "fullName",
      "message"
    ]
  },
  "filesAvatars": {
    "verb": "GET",
    "url": "/v/upld/imgs/vtrs/*",
    "args": []
  },
  "filesFilesClients": {
    "verb": "GET",
    "url": "/v/upld/files/:idClient/*",
    "args": []
  }
}
  /* eslint-enable */
});
