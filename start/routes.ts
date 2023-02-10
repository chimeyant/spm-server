/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return "API SERVICE V2"
})


Route.get("sliders", "HalamanDepan/SlidersController.publish")

Route.group(()=>{
  Route.group(()=>{
    Route.post("token","Auth/LoginController.login")
    Route.post('registrasi-perusahaan',"Auth/RegistrasiPerusahaansController.registrasi")
    Route.post('registrasi-user', "Auth/RegisterUsersController.registrasi")
  }).prefix("auth")

  Route.get("info","AppsController.index")

  Route.get("menus","AppsController.menus").middleware('auth')
  Route.get("user-info","Utility/UsersController.userInfo").middleware(['auth'])

  //Route public images

  //route media
  Route.post("media", "MediaController.store").middleware(["auth"]);
  Route.get("dashboard","DashboardController.index").middleware(['auth'])

  //route superadmin
  Route.group(()=>{
    Route.group(()=>{
      Route.resource("app-info","MasterData/AppInfosController")
    }).prefix("master-data").middleware(['auth'])
  }).prefix("superadmin")

  //route manajemen
  Route.group(()=>{
    Route.resource("category","Manajemen/CategoriesController")
    Route.resource("domain","Manajemen/DomainsController")
    Route.post("export-domain", "Manajemen/DomainsController.exportTxtFile")
  }).prefix('manajemen')


  //Route Combo'
  Route.group(()=>{
    Route.get("category","Manajemen/CategoriesController.combo")
  }).prefix('combo').middleware(['auth'])

  //route utility
  Route.group(()=>{
    //Route manajemen pengguna
    Route.resource("users","Utility/UsersController")
    Route.post("update-profil","Utility/UsersController.updateProfil")
    Route.post("change-pwd","Utility/UsersController.changePwd")

    //Route manajemen fitur administrator
    Route.resource("fiturs","Utility/FitursController")
    Route.post("fiturs-set-progress","Utility/FitursController.setprogress")
    Route.post("fiturs-set-selesai","Utility/FitursController.setselesai")

    //Route manajemen fitur userr
    Route.resource("manajemen-fiturs","Utility/FiturUsersController")

    //Route Update History
    Route.resource("updates","Utility/UpdateHistoriesController")

  }).prefix('utility').middleware(['auth'])

  Route.group(()=>{
    Route.resource("sliders","HalamanDepan/SlidersController")
  }).prefix("halaman-depan").middleware(['auth'])

}).prefix("api/v2")

