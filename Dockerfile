# FROM php:8.1-apache


FROM php:8.1-apache

WORKDIR /app/backend

# Install necessary tools for Composer installation
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Enable necessary PHP extensions
RUN docker-php-ext-install mysqli pdo pdo_mysql && docker-php-ext-enable mysqli pdo pdo_mysql
RUN a2enmod rewrite
RUN a2enmod headers

COPY ./.docker/vhost.conf /etc/apache2/sites-available/000-default.conf

COPY . .
RUN composer install
RUN php artisan migrate
RUN php artsian db:seed RolesTableSeeder


CMD ["php", "artisan", "serve", "--host", "0.0.0.0"]
