<?php

use Illuminate\Support\Facades\Route;

Route::get('/php-version', function () {
    return PHP_VERSION;
});
