# FROM php:8.1-apache

# WORKDIR /var/www/html

# COPY . .
FROM php:8.1-apache

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

WORKDIR /app/backend
COPY . .
RUN composer install


EXPOSE 8000

CMD php artisan serve 
