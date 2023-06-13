<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->group(function () {

    //get authenthicated user
    Route::get('/user', [UserController::class, 'getAuthUser']);

    // get all users
    Route::apiResource('/users', UserController::class);

    Route::apiResource('/calendar', TaskController::class);


    // admin middleware control
    Route::middleware('admin')->group(function () {

        // get a user with roles
        Route::get('/roles/{id}', [RoleController::class, 'getUserWithRoles']);
        
        // get all roles
        Route::apiResource('/roles', RoleController::class);
        

    });

    //logout user
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/calendar/{date}', [TaskController::class, 'indexByDate']);

});



// create user
Route::post('/signup', [AuthController::class, 'signup']);

// authenticate user
Route::post('/login', [AuthController::class, 'login']);