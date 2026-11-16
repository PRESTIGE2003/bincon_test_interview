<?php

use App\Http\Controllers\PollingUnitController;
use App\Http\Controllers\PollingUnitResultController;
use Illuminate\Support\Facades\Route;

Route::redirect('/', '/bicon');

Route::prefix('bicon')->name('bicon.')->controller(PollingUnitController::class)->group(function () {
    Route::get('/', 'index')->name('index');
    Route::get('show/{state}/{lga}', 'lga')->name('show.lga');
    Route::get('show/{state}/{lga}/{ward}/{unit}', 'polling')->name('show.polling');

    Route::get('/polling-units/create', [PollingUnitResultController::class, 'create'])->name('create.polling');
    Route::post('/polling-units', [PollingUnitResultController::class, 'store'])->name('store.polling');
    Route::get('/locations/wards', [PollingUnitResultController::class, 'wards'])->name('locations.wards');
});
