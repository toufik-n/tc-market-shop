# 🛍️ TC MARKET SHOP

**TC MARKET SHOP** es una plataforma web de marketplace completa donde los usuarios pueden registrarse, crear sus propias tiendas online, gestionar productos y realizar compras.

---

## 🌐 Ver la página online (GitHub Pages)

Una vez que el repositorio tenga **GitHub Pages** activado, la página estará disponible en:

```
https://toufik-n.github.io/tc-market-shop/
```

### ¿Cómo activar GitHub Pages?

1. Ve a tu repositorio en GitHub: `https://github.com/toufik-n/tc-market-shop`
2. Haz clic en **Settings** (Configuración)
3. En el menú lateral izquierdo, selecciona **Pages**
4. En **Source**, selecciona **GitHub Actions**
5. ¡Listo! Cada vez que hagas un `push` a `main`, el sitio se desplegará automáticamente

> ℹ️ El workflow `.github/workflows/deploy.yml` ya está configurado para desplegar automáticamente.

---

## 💻 Ver la página en local (sin internet requerido)

### Opción 1 — Python (recomendado, viene preinstalado)

```bash
# 1. Clona el repositorio
git clone https://github.com/toufik-n/tc-market-shop.git
cd tc-market-shop

# 2. Inicia un servidor local
python3 -m http.server 8080

# 3. Abre tu navegador en:
#    http://localhost:8080
```

### Opción 2 — Node.js / npx

```bash
# 1. Clona el repositorio
git clone https://github.com/toufik-n/tc-market-shop.git
cd tc-market-shop

# 2. Inicia un servidor local
npx serve .

# 3. Abre tu navegador en la URL que muestre la terminal
#    (normalmente http://localhost:3000)
```

### Opción 3 — VS Code Live Server

1. Instala la extensión **Live Server** en VS Code
2. Abre la carpeta del proyecto en VS Code
3. Haz clic derecho sobre `index.html` → **Open with Live Server**
4. El navegador se abrirá automáticamente

### Opción 4 — Abrir directamente (sin servidor)

> ⚠️ Algunas funciones pueden no estar disponibles sin servidor HTTP (depende del navegador).

1. Abre el explorador de archivos y navega hasta la carpeta del proyecto
2. Haz doble clic en `index.html`

---

## 🔑 Credenciales de demo

| Campo       | Valor                    |
|-------------|--------------------------|
| **Email**   | `demo@tcmarket.com`      |
| **Password**| `demo123`                |

---

## 📄 Páginas disponibles

| Página                 | Archivo               | Descripción                          |
|------------------------|-----------------------|--------------------------------------|
| 🏠 Inicio              | `index.html`          | Página principal del marketplace     |
| 🔐 Iniciar sesión      | `login.html`          | Formulario de login                  |
| 📝 Registro            | `register.html`       | Formulario de registro               |
| 📊 Dashboard           | `dashboard.html`      | Panel de control del vendedor        |
| 🏪 Crear tienda        | `create-store.html`   | Crear una nueva tienda               |
| 🏪 Mi tienda           | `my-store.html`       | Ver y editar tu tienda               |
| 📦 Añadir producto     | `add-product.html`    | Gestión de productos                 |
| 🔍 Detalle producto    | `product-detail.html` | Página de detalle de un producto     |
| 🛒 Carrito             | `cart.html`           | Carrito de compras                   |
| 💳 Checkout            | `checkout.html`       | Proceso de pago                      |
| 📋 Mis pedidos         | `orders.html`         | Historial y estado de pedidos        |
| 🔍 Explorar            | `explore.html`        | Buscar y filtrar productos           |
| 🏬 Ver tienda          | `store-view.html`     | Página pública de una tienda         |
| 👤 Perfil              | `profile.html`        | Perfil y configuración del usuario   |

---

## 🗂️ Estructura del proyecto

```
tc-market-shop/
├── index.html              # Página principal
├── login.html              # Login
├── register.html           # Registro
├── dashboard.html          # Panel vendedor
├── create-store.html       # Crear tienda
├── my-store.html           # Mi tienda
├── add-product.html        # Añadir producto
├── product-detail.html     # Detalle de producto
├── cart.html               # Carrito
├── checkout.html           # Checkout
├── orders.html             # Pedidos
├── explore.html            # Explorar
├── store-view.html         # Vista de tienda
├── profile.html            # Perfil
├── css/
│   ├── style.css           # Estilos globales
│   ├── components.css      # Componentes reutilizables
│   ├── responsive.css      # Media queries
│   └── animations.css      # Animaciones
├── js/
│   ├── app.js              # Lógica principal
│   ├── auth.js             # Autenticación
│   ├── store.js            # Gestión de tiendas
│   ├── products.js         # Gestión de productos
│   ├── cart.js             # Carrito de compras
│   ├── orders.js           # Pedidos
│   ├── search.js           # Búsqueda y filtros
│   ├── dashboard.js        # Dashboard
│   └── utils.js            # Utilidades y datos demo
└── assets/
    └── images/
```

---

## 🛠️ Stack Tecnológico

- **HTML5** — Semántico y accesible
- **CSS3** — Variables CSS, Flexbox, Grid, animaciones
- **JavaScript** — Vanilla JS, sin frameworks
- **Almacenamiento** — `localStorage` (no requiere backend)
- **Fuentes** — Google Fonts: Poppins + Inter
- **Iconos** — Font Awesome 6

---

## 🎨 Diseño

| Color       | Hex       | Uso               |
|-------------|-----------|-------------------|
| Primario    | `#6C63FF` | Botones, enlaces  |
| Secundario  | `#FF6584` | Highlights        |
| Acento      | `#00C9A7` | Badges, éxito     |
| Fondo       | `#F8F9FE` | Background        |
| Texto       | `#2D3436` | Texto principal   |

---

## 📦 Datos de demo precargados

Al abrir la aplicación por primera vez se cargan automáticamente:
- **3 tiendas** de ejemplo (TechZone, ModaStyle, HomeDecor)
- **15 productos** en diversas categorías
- **Categorías**: Electrónica, Moda, Hogar, Deportes, Libros, Juguetes
- **Códigos de descuento**: `BIENVENIDO10`, `VERANO20`, `TECH15`

> Los datos se guardan en `localStorage` del navegador. Para reiniciar los datos, abre las DevTools del navegador → Application → Local Storage → Borrar todo.

---

## ⚠️ Nota de seguridad (demo)

Este proyecto es un **prototipo/demo** con almacenamiento en `localStorage`. En producción se debería:
- Usar autenticación con hashing de contraseñas (bcrypt/argon2)
- Integrar pasarela de pago certificada (Stripe, PayPal)
- Usar un backend con base de datos real
