/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {


  //  ╦ ╦╔═╗╔╗ ╔═╗╔═╗╔═╗╔═╗╔═╗
  //  ║║║║╣ ╠╩╗╠═╝╠═╣║ ╦║╣ ╚═╗
  //  ╚╩╝╚═╝╚═╝╩  ╩ ╩╚═╝╚═╝╚═╝

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` your home page.            *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  'GET /':                    { action: 'view-pages/view-dashboard', locals:{ layout:'layouts/dashboard' } },
  'GET /contacto':            { action: 'view-pages/view-contact', locals:{layout:'layouts/login'} },
  // ---
  'GET /singup':              { action: 'view-pages/view-registers', locals:{layout:'layouts/login'} },
  'GET /email/confirm':       { action: 'users/confirm-emails' },
  'GET /email/confirmed':     { action: 'users/view-confirmed-user-email', locals:{layout:'layouts/login'} },
  // ---
  'GET /login':               { action: 'view-pages/view-login',      locals:{layout:'layouts/login'} },
  'GET /password/forgot':     { action: 'users/view-forgot-password', locals:{layout:'layouts/login'} },
  'GET /password/new':        { action: 'users/view-new-password',    locals:{layout:'layouts/login'} },
  'GET /logout':              { action: 'auth/logout' },


  // --- USER CONTROL
  'GET /users':               { action: 'users/view-list', locals: { layout:'layouts/dashboard' } },
  'GET /users/create':        { action: 'users/view-create-users', locals: { layout:'layouts/dashboard' } },


  /***************************************************************************
  *                                                                          *
  * More custom routes here...                                               *
  * (See https://sailsjs.com/config/routes for examples.)                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the routes in this file, it   *
  * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
  * not match any of those, it is matched against static assets.             *
  *                                                                          *
  ***************************************************************************/


  //  ╔═╗╔═╗╦  ╔═╗╔╗╔╔╦╗╔═╗╔═╗╦╔╗╔╔╦╗╔═╗
  //  ╠═╣╠═╝║  ║╣ ║║║ ║║╠═╝║ ║║║║║ ║ ╚═╗
  //  ╩ ╩╩  ╩  ╚═╝╝╚╝═╩╝╩  ╚═╝╩╝╚╝ ╩ ╚═╝

  // USUARIOS Y LOGING
  'POST /api/v2/login':                         { action: 'auth/login' },
  'POST /api/v2/logout':                        { action: 'auth/logout' },

  'POST /api/v2/users':                         { action: 'users/list' },
  'POST /api/v2/users/create':                  { action: 'users/create-users' },
  'POST /api/v2/users/find-one':                { action: 'users/find-one' },
  'POST /api/v2/users/search':                  { action: 'users/search' },
  'PATCH /api/v2/users/update-avatar':          { action: 'users/update-avatar' },
  'PATCH /api/v2/users/update-data-user':       { action: 'users/update-data-user' },
  'PATCH /api/v2/users/update-unblock':             { action: 'users/updated-unblock' },
  'PATCH /api/v2/users/update-active-account':      { action: 'users/updated-active-account' },
  'PATCH /api/v2/users/update-change-email':        { action: 'users/updated-change-email' },
  'PATCH /api/v2/users/update-reconfirm-email':     { action: 'users/updated-reconfirm-email' },
  'PATCH /api/v2/users/forgot-passwords':           { action: 'users/forgot-passwords' },
  'PATCH /api/v2/users/update-password-and-login':  { action: 'users/update-password-and-login' },
  'DELETE /api/v2/users/delete-users':              { action: 'users/delete' },



  // Mensajes de soporte y contactenos
  'POST /api/v2/deliver-contact-form-message':      { action: 'deliver-contact-form-messages' },

  //  ╦ ╦╔═╗╔╗ ╦ ╦╔═╗╔═╗╦╔═╔═╗
  //  ║║║║╣ ╠╩╗╠═╣║ ║║ ║╠╩╗╚═╗
  //  ╚╩╝╚═╝╚═╝╩ ╩╚═╝╚═╝╩ ╩╚═╝


  //  ╔╦╗╦╔═╗╔═╗
  //  ║║║║╚═╗║
  //  ╩ ╩╩╚═╝╚═╝


};


let ro = {
  // ---
  // '/faq':                  { action: '', locals:{layout:'layouts/a'} },
  // '/legal':                { action: '', locals:{layout:'layouts/a'} },
  // '/legal/terminos':       { action: '', locals:{layout:'layouts/a'} },
  // '/legal/privacidad':     { action: '', locals:{layout:'layouts/a'} },
  // '/term':                 { action: '', locals:{layout:'layouts/a'} },
  'GET /contacto':            { action: 'view-pages/contact', locals:{layout:'layouts/login'} },
  // ---
  'GET /singup':              { action: 'view-pages/register', locals:{layout:'layouts/login'} },
  'GET /email/confirm':       { action: 'users/confirm-email' },
  'GET /email/confirmed':     { action: 'users/view-confirmed-user-email', locals:{layout:'layouts/login'} },
  // ---
  'GET /login':               { action: 'view-pages/login', locals:{layout:'layouts/login'} },
  'GET /password/forgot':     { action: 'users/view-forgot-password', locals:{layout:'layouts/login'} },
  'GET /password/new':        { action: 'users/view-new-password', locals:{layout:'layouts/login'} },
  'GET /logout':              { action: 'auth/logout' },
  // ---
  // '/acount':               { action: '', locals:{layout:'layouts/a'} },
  // '/acount/password':      { action: '', locals:{layout:'layouts/a'} },
  // '/acount/profile':       { action: '', locals:{layout:'layouts/a'} },

  'GET /users':               { action: 'users/view-list', locals: { layout:'layouts/dashboard' } },
  'GET /users/new':           { action: 'users/view-register', locals: { layout:'layouts/dashboard' } },


// /***************************************************************************
// * Archivos Maestros
// **************************************************************************/

// // Clientes de la empresa
// 'GET /customers':                 { action: 'customers/view-list', locals: { layout:'layouts/dashboard' } },

// // Cuentas de bancos
// 'GET /masterFul/bankAccounts':    { action: 'masters/bank-accounts/view-list', locals: { layout:'layouts/dashboard' } },

// // BANCOS
// 'GET /masterFul/banks':           { action: 'masters/banks/view-list', locals: { layout: 'layouts/dashboard'} },

// // Empresas Asociadas
// 'GET /masterFul/holdings':        { action: 'masters/holding/view-list', locals: { layout:'layouts/dashboard' } },

// // AFP
// 'GET /masterFul/afp':             { action: 'masters/afp/view-list', locals: { layout: 'layouts/dashboard'} },
// // ARL
// 'GET /masterFul/arl':             { action: 'masters/arl/view-list', locals: { layout: 'layouts/dashboard'} },
// // CCF
// 'GET /masterFul/ccf':             { action: 'masters/ccf/view-list', locals: { layout: 'layouts/dashboard'} },
// // EPS
// 'GET /masterFul/eps':             { action: 'masters/eps/view-list', locals: { layout: 'layouts/dashboard'} },
};

// /***************************************************************************
// *                                                                          *
// * More custom routes here...                                               *
// * (See https://sailsjs.com/config/routes for examples.)                    *
// *                                                                          *
// * If a request to a URL doesn't match any of the routes in this file, it   *
// * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
// * not match any of those, it is matched against static assets.             *
// *                                                                          *
// ***************************************************************************/


// //  ╔═╗╔═╗╦  ╔═╗╔╗╔╔╦╗╔═╗╔═╗╦╔╗╔╔╦╗╔═╗
// //  ╠═╣╠═╝║  ║╣ ║║║ ║║╠═╝║ ║║║║║ ║ ╚═╗
// //  ╩ ╩╩  ╩  ╚═╝╝╚╝═╩╝╩  ╚═╝╩╝╚╝ ╩ ╚═╝

// // USUARIOS Y LOGING
// 'POST /api/v1/login':                         { action: 'auth/login' },
// 'POST /api/v1/users':                         { action: 'users/list' },
// 'POST /api/v1/users/findOne':                 { action: 'users/find-one' },
// 'POST /api/v1/users/find-search':             { action: 'users/find-search' },
// 'POST /api/v1/users/create':                  { action: 'users/create-user' },
// 'PATCH /api/v1/users/update-avatar':          { action: 'users/update-avatar' },
// 'PATCH /api/v1/users/update-data-user':       { action: 'users/update-data-user' },
// 'PATCH /api/v1/users/forgot-passwords':           { action: 'users/forgot-passwords' },
// 'PATCH /api/v1/users/update-password-and-login':  { action: 'users/update-password-and-login' },
// 'DELETE /api/v1/users/delete-users':              { action: 'users/delete' },

// // BANCOS
// 'POST /api/v1/masters/banks':               { action: 'masters/banks/list' },
// 'POST /api/v1/masters/banks/find-one':      { action: 'masters/banks/find-one' },
// 'POST /api/v1/masters/banks/find-search':   { action: 'masters/banks/find-search' },
// 'POST /api/v1/masters/banks/create':        { action: 'masters/banks/create' },
// 'PATCH /api/v1/masters/banks/update':       { action: 'masters/banks/update' },
// 'DELETE /api/v1/masters/banks/delete':      { action: 'masters/banks/delete' },

// // CUENTAS DE BANCOS
// 'POST /api/v1/masters/bankAccounts/find-one':  { action: 'masters/bank-accounts/find-one' },

// // Mensajes de soporte y contactenos
// 'POST /api/v1/deliver-contact-form-message':      { action: 'deliver-contact-form-message' },

// //  ╦ ╦╔═╗╔╗ ╦ ╦╔═╗╔═╗╦╔═╔═╗
// //  ║║║║╣ ╠╩╗╠═╣║ ║║ ║╠╩╗╚═╗
// //  ╚╩╝╚═╝╚═╝╩ ╩╚═╝╚═╝╩ ╩╚═╝
// // 'GET /csrfToken': { action: 'security/grant-csrf-token' },

// //  ╔╦╗╦╔═╗╔═╗
// //  ║║║║╚═╗║
// //  ╩ ╩╩╚═╝╚═╝

// //  ╔═╗╔═╗╦  ╔═╗╦ ╦ ╔═╗ ╔═╗
// //  ╠═╣╠═╝║  ╠╣ ║ ║ ╠╣  ╚═╗
// //  ╩ ╩╩  ╩  ╩  ╩ ╚═╚═╝ ╚═╝
// 'GET /v/upld/imgs/vtrs/*':          { action: 'files/avatars', skipAssets: false},
// 'GET /v/upld/files/:idClient/*':    { action: 'files/files-clients', skipAssets: false},
