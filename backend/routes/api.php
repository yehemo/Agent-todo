<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\StatsController;
use App\Http\Controllers\Api\TaskController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {

    Route::prefix('auth')->middleware('throttle:5,1')->group(function () {
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/login',    [AuthController::class, 'login']);

        Route::middleware('auth:sanctum')->group(function () {
            Route::post('/logout', [AuthController::class, 'logout']);
            Route::get('/user',    [AuthController::class, 'user']);
        });
    });

    Route::middleware(['auth:sanctum', 'throttle:60,1'])->group(function () {
        Route::apiResource('categories', CategoryController::class);

        Route::patch('tasks/{task}/status', [TaskController::class, 'updateStatus']);
        Route::apiResource('tasks', TaskController::class);

        Route::get('stats', StatsController::class);
    });
});
