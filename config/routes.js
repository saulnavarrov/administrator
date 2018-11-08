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

  // 'GET /':              {action:'view-pages/index', locals: {layout:'layouts/layout'}},

  // '/wellcome':           {action: '', locals:{layout:'layouts/a'}},
  'GET /':         {action: 'view-pages/dashboard', locals:{layout:'layouts/dashboard'}},
  // //---
  // '/faq':                {action: '', locals:{layout:'layouts/a'}},
  // '/legal':              {action: '', locals:{layout:'layouts/a'}},
  // '/legal/terminos':     {action: '', locals:{layout:'layouts/a'}},
  // '/legal/privacidad':   {action: '', locals:{layout:'layouts/a'}},
  // '/term':               {action: '', locals:{layout:'layouts/a'}},
  // //---
  'GET /singup':             {action: 'view-pages/register', locals:{layout:'layouts/login'}},
  'GET /email/confirm':      {action: 'users/confirm-email'},
  // '/email/confirmed':    {action: '', locals:{layout:'layouts/a'}},
  // //---
  'GET /login':              {action: 'view-pages/login', locals:{layout:'layouts/login'}},
  'GET /password/forgot':    {action: 'view-pages/forgot-password', locals:{layout:'layouts/login'}},
  'GET /password/new':       {action: 'view-pages/reset-password', locals:{layout:'layouts/login'}},
  'GET /logout':             {action: 'auth/logout'},
  // //---
  // '/acount':             {action: '', locals:{layout:'layouts/a'}},
  // '/acount/password':    {action: '', locals:{layout:'layouts/a'}},
  // '/acount/profile':     {action: '', locals:{layout:'layouts/a'}},

  'GET /users':             {action: 'users/view-list', locals:{layout:'layouts/dashboard'}},
  'GET /users/new':         {action: 'users/view-register', locals:{layout:'layouts/dashboard'}},

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
  'POST /api/v1/login':                   { action: 'auth/login' },
  'POST /api/v1/users':                   { action: 'users/list' },
  'POST /api/v1/users/findOne':           { action: 'users/find-one' },
  'POST /api/v1/users/find-search':       { action: 'users/find-search' },
  'POST /api/v1/users/create':            { action: 'users/create-user' },
  'PATCH /api/v1/users/update-avatar':    { action: 'users/update-avatar' },
  'PATCH /api/v1/users/update-data-user': { action: 'users/update-data-user' },
  'DELETE /api/v1/users/delete-users':    { action: 'users/delete' },

  //  ╦ ╦╔═╗╔╗ ╦ ╦╔═╗╔═╗╦╔═╔═╗
  //  ║║║║╣ ╠╩╗╠═╣║ ║║ ║╠╩╗╚═╗
  //  ╚╩╝╚═╝╚═╝╩ ╩╚═╝╚═╝╩ ╩╚═╝
  // 'GET /csrfToken': { action: 'security/grant-csrf-token' },

  //  ╔╦╗╦╔═╗╔═╗
  //  ║║║║╚═╗║
  //  ╩ ╩╩╚═╝╚═╝

  //  ╔═╗╔═╗╦  ╔═╗╦ ╦ ╔═╗ ╔═╗
  //  ╠═╣╠═╝║  ╠═ ║ ║ ║╣  ╚═╗
  //  ╩ ╩╩  ╩  ╩  ╩ ╚═╚═╝ ╚═╝
  'GET /v/upld/imgs/vtrs/*':      { action: 'files/avatars', skipAssets: false},
  'GET /v/upld/files/:idClient/*':  { action: 'files/files-clients', skipAssets: false},
};
