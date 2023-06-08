<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\api\RoleController;
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

Route::middleware('auth:sanctum')->group(function() {

Route::get('/user', function (Request $request) {
    return $request->user();
});
// Route::get('/calendar/user/{user_id}', [TaskController::class, 'indexByUser']);
//logout user
Route::post('/logout', [AuthController::class, 'logout']);



});
Route::apiResource('/users', UserController::class);

// create user
Route::post('/signup', [AuthController::class, 'signup']);

// authenticate user
Route::post('/login', [AuthController::class, 'login']);


Route::get('/calendar/{date}', [TaskController::class, 'indexByDate']);
Route::apiResource('/calendar', TaskController::class);

Route::middleware('admin')->group(function() {
    Route::apiResource('/roles', RoleController::class);
});
// Route::middleware('admin')->get('/users/roles',[ RoleController::class, 'index']);
