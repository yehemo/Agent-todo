FROM php:8.2-cli

# System dependencies
RUN apt-get update && apt-get install -y \
    git curl zip unzip libzip-dev libpng-dev libonig-dev libxml2-dev \
    && docker-php-ext-install pdo_mysql mbstring zip bcmath \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Create fresh Laravel 11 project (skeleton only)
RUN composer create-project laravel/laravel . --no-interaction --prefer-dist \
    && composer require laravel/sanctum --no-interaction

# Overlay our custom application files on top of the skeleton
COPY app/            app/
COPY database/       database/
COPY routes/         routes/
COPY config/cors.php config/cors.php
COPY bootstrap/app.php bootstrap/app.php
COPY tests/ tests/
RUN rm -f tests/Feature/ExampleTest.php tests/Unit/ExampleTest.php

# Entrypoint script
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 8000

ENTRYPOINT ["/docker-entrypoint.sh"]
