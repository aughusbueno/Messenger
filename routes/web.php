<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\MessengerController;
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

// LOG IN PAGE ROUTE
Route::get('/auth/signin', [AuthController::class, 'signin'])
                    ->middleware(['guest'])
                    ->name('auth.signin');

//  LOG IN ACTION POST METHOD
Route::post('/auth/login', [AuthController::class, 'login'])
                    ->middleware(['guest'])
                    ->name('auth.login');

// REGISTER PAGE ROUTE
Route::get('/auth/signup', [AuthController::class, 'signup'])
                    ->middleware(['guest'])
                    ->name('auth.signup');

//  REGISTER ACTION POST METHOD
Route::post('/auth/register', [AuthController::class, 'register'])
                    ->middleware(['guest'])
                    ->name('auth.register');

// LOG OUT ACTION POST METHOD
Route::post('/auth/logout', [AuthController::class, 'logout'])
                    ->middleware(['auth'])
                    ->name('auth.logout');

// MESSENGER PAGE ROUTE
Route::get('/messenger', [MessengerController::class, 'messenger'])
                    ->middleware(['auth'])
                    ->name('messenger');

/*
|--------------------------------------------------------------------------
| API
|--------------------------------------------------------------------------
*/

Route::get('/api/contacts',[MessengerController::class, 'getContacts'])
                    ->middleware(['auth'])
                    ->name('user.contacts');

Route::get('/api/groups',[MessengerController::class, 'getGroups'])
                    ->middleware(['auth'])
                    ->name('user.groups');

Route::post('/api/createGroup',[MessengerController::class, 'createGroup'])
                    ->middleware(['auth'])
                    ->name('user.newGroup');

Route::get('/api/search/{name}/{groupid}',[AuthController::class, 'search'])
                    ->middleware(['auth'])
                    ->name('user.search');

Route::post('/api/send',[MessengerController::class, 'sendMessage'])
                    ->middleware(['auth'])
                    ->name('user.sendMessage');

Route::post('/api/addtogroup', [AuthController::class, 'addToGroup'])
                    ->middleware(['auth'])
                    ->name('user.addToGroup');

Route::post('/api/messages',[MessengerController::class, 'getMessages'])
                    ->middleware(['auth'])
                    ->name('user.messages');


