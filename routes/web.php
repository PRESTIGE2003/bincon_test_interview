<?php

use App\Http\Controllers\PollingUnitController;
use Illuminate\Support\Facades\Route;

Route::redirect('/', '/bicon');

Route::prefix('bicon')->name('bicon.')->controller(PollingUnitController::class)->group(function () {
    Route::get('/', 'index')->name('index');
    Route::get('show/{state}/{lga}', 'lga')->name('show.lga');
    Route::get('show/{state}/{lga}/{ward}/{unit}', 'polling')->name('show.polling');
    Route::get('/create', 'pollingForm')->name('create.polling');
    Route::post('/store', 'storePollingForm')->name('store.polling');
});
