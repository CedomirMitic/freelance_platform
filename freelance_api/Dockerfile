FROM php:8.3-cli

# Instalacija sistemskih zavisnosti i PHP ekstenzija koje Laravel zahteva
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip

# Instalacija ekstenzija
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Instalacija Composer-a
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Postavljanje radnog direktorijuma
WORKDIR /var/www

# Kopiranje fajlova projekta
COPY . .

# Instalacija composer paketa
RUN composer install --no-dev --optimize-autoloader

# Dozvole za storage i bootstrap/cache
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

# Otvaranje porta
EXPOSE 8001

# Pokretanje Laravel servera
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8001"]
