# Sintesis Pasarela Universal

[![npm version](https://badge.fury.io/js/sintesis-pasarela-universal.svg)](https://badge.fury.io/js/sintesis-pasarela-universal)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

SDK Universal para Sintesis Pasarela de Pagos - Compatible con Web, Mobile y Desktop.

## 🚀 Características

- ✅ **Universal**: Compatible con Web, Node.js, React Native, Deno
- ✅ **UMD**: Soporte para AMD, CommonJS y browser globals
- ✅ **TypeScript**: Definiciones de tipos incluidas
- ✅ **Auto-detección de entorno**: Detecta automáticamente el entorno de ejecución
- ✅ **Logging integrado**: Sistema de logging universal con soporte de debug
- ✅ **Manejo de errores robusto**: Retry automático y manejo de errores
- ✅ **Múltiples modos**: WebView, iFrame, API-only

## 📦 Instalación

### NPM
```bash
npm install sintesis-pasarela-universal
```

### Yarn
```bash
yarn add sintesis-pasarela-universal
```

### CDN (Browser)
```html
<script src="https://unpkg.com/sintesis-pasarela-universal@latest/embedded-intragation.js"></script>
```

## 🔧 Uso

### Node.js / CommonJS

```javascript
const SintesisPasarela = require('sintesis-pasarela-universal');

const pasarela = SintesisPasarela.create({
  apiKey: 'tu-api-key-aqui',
  debug: true,
  onSuccess: (data) => {
    console.log('Pago exitoso:', data);
  },
  onError: (error) => {
    console.error('Error en pago:', error);
  }
});

// Inicializar
await pasarela.init();
```

### ES6 Modules

```javascript
import SintesisPasarela from 'sintesis-pasarela-universal';

const pasarela = SintesisPasarela.create({
  apiKey: 'tu-api-key-aqui',
  mode: 'iframe',
  debug: false
});
```

### Browser / HTML

#### Usando CDN
```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://unpkg.com/sintesis-pasarela-universal@latest/embedded-intragation.js"></script>
</head>
<body>
  <div id="pasarela-container"></div>
  
  <script>
    const pasarela = SintesisPasarela.create({
      apiKey: 'tu-api-key-aqui',
      debug: true
    });
    
    pasarela.render('#pasarela-container');
  </script>
</body>
</html>
```

#### Auto-inicialización
```html
<div 
  data-sintesis-pasarela
  data-api-key="tu-api-key-aqui"
  data-mode="auto"
  data-width="100%"
  data-height="600px"
  data-debug>
</div>
```

### React Native

```javascript
import SintesisPasarela from 'sintesis-pasarela-universal';

const pasarela = SintesisPasarela.create({
  apiKey: 'tu-api-key-aqui',
  mode: 'api-only'
});

const processPayment = async () => {
  try {
    await pasarela.init();
    const result = await pasarela.processPayment({
      amount: 100.00,
      currency: 'BOB',
      description: 'Pago de prueba'
    });
    console.log('Pago procesado:', result);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

## ⚙️ Configuración

### Opciones de configuración

```javascript
const config = {
  apiKey: 'string',              // Requerido: Tu API key de Sintesis
  baseUrl: 'string',             // Opcional: URL base de la API (default: QA)
  autoInit: boolean,             // Opcional: Auto-inicialización (default: true en web)
  debug: boolean,                // Opcional: Habilitar logging (default: false)
  timeout: number,               // Opcional: Timeout en ms (default: 30000)
  mode: 'string',                // Opcional: 'auto', 'webview', 'iframe', 'api-only'
  
  // Información del cliente (opcional)
  customerInfo: {
    email: 'string',             // Opcional: Email del cliente
    firstName: 'string',         // Opcional: Nombre del cliente
    lastName: 'string',          // Opcional: Apellido del cliente
    identityNumber: 'string'     // Opcional: Número de identidad
  },
  
  // Callbacks
  onSuccess: function,           // Callback de éxito
  onError: function,             // Callback de error
  onLoad: function,              // Callback de carga
  onTokenExpired: function       // Callback de token expirado
};
```

### Configurar información del cliente

```javascript
// Durante la inicialización
const pasarela = SintesisPasarela.create({
  apiKey: 'tu-api-key',
  customerInfo: {
    email: 'bolivia@sintesis.com.bo',
    firstName: 'Alejandro',
    lastName: 'Montero',
    identityNumber: '8569751'
  }
});

// O dinámicamente después de la inicialización
await pasarela.setCustomerInfo({
  email: 'nuevo@email.com',
  firstName: 'Nuevo',
  lastName: 'Cliente',
  identityNumber: '1234567'
});

// Obtener información actual del cliente
const customerInfo = pasarela.getCustomerInfo();
console.log(customerInfo);
```

### Modos de operación

- **`auto`**: Detecta automáticamente el mejor modo según el entorno
- **`webview`**: Usa WebView para la integración
- **`iframe`**: Usa iFrame embebido
- **`api-only`**: Solo API, sin UI embebida

## 🌍 Compatibilidad de entornos

| Entorno | Soporte | Notas |
|---------|---------|-------|
| **Browser** | ✅ | Soporte completo con auto-detección |
| **Node.js** | ✅ | Requiere `node-fetch` como peer dependency |
| **React Native** | ✅ | Usa fetch nativo |
| **Deno** | ✅ | Soporte nativo |
| **Web Workers** | ✅ | Detectado automáticamente |

## 🔧 API Reference

### Métodos principales

#### `SintesisPasarela.create(config)`
Crea una nueva instancia de la pasarela.

#### `pasarela.init()`
Inicializa la pasarela y obtiene el token de acceso.

#### `pasarela.render(container, options)`
Renderiza la pasarela en el contenedor especificado.

#### `pasarela.processPayment(paymentData)`
Procesa un pago (modo API-only).

#### `pasarela.destroy()`
Destruye la instancia y limpia recursos.

#### `pasarela.setCustomerInfo(customerInfo)`
Configura la información del cliente y regenera el enlace embebido si es necesario.

#### `pasarela.getCustomerInfo()`
Obtiene la información actual del cliente configurada.

### Métodos de utilidad

- `pasarela.getStatus()`: Obtiene el estado actual
- `pasarela.getEmbedUrl()`: Obtiene la URL embebida
- `pasarela.getAccessToken()`: Obtiene el token de acceso

## 🛠️ Desarrollo

### Requisitos de desarrollo

```bash
# Instalar dependencias para Node.js (opcional)
npm install node-fetch
```

### Testing

La librería incluye detección automática de entorno y logging para facilitar el debugging.

```javascript
const pasarela = SintesisPasarela.create({
  apiKey: 'test-key',
  debug: true  // Habilita logging detallado
});
```

## 🤝 Contribuir

1. Fork el repositorio
2. Crea una branch para tu feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -am 'Añadir nueva característica'`)
4. Push a la branch (`git push origin feature/nueva-caracteristica`)
5. Crear un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 🆘 Soporte

- **Email**: soporte@sintesis.com.bo
- **Documentación**: [https://docs.sintesis.com.bo](https://docs.sintesis.com.bo)
- **Issues**: [GitHub Issues](https://github.com/sintesis/embedded-lib/issues)

## 📋 Changelog

### v2.0.0
- ✅ Soporte universal para múltiples entornos
- ✅ Implementación UMD completa
- ✅ Auto-detección de entorno
- ✅ Logging universal mejorado
- ✅ Soporte TypeScript

---

Desarrollado con ❤️ por [Sintesis](https://sintesis.com.bo)