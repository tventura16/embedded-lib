// Ejemplo Node.js - Sintesis Pasarela Universal
// Ejecutar con: node examples/node.js

// Importar la librería
const SintesisPasarela = require("../embedded-intragation.js");

async function ejemploNodejs() {
  console.log("🚀 Iniciando ejemplo Node.js");
  console.log("Versión:", SintesisPasarela.version || "2.0.0");

  try {
    // Crear instancia de la pasarela
    const pasarela = SintesisPasarela.create({
      apiKey: "test-api-key-nodejs",
      baseUrl: "https://qa.sintesis.com.bo/pasarelapagos-msapi/embedded/api/v1",
      mode: "api-only", // En Node.js solo API
      debug: true,
      timeout: 30000,
      onSuccess: (data) => {
        console.log("✅ Callback onSuccess ejecutado:", data);
      },
      onError: (error) => {
        console.error("❌ Callback onError ejecutado:", error);
      },
      onTokenExpired: () => {
        console.log("🔄 Token expirado, renovando...");
      },
    });

    console.log("📝 Inicializando pasarela...");

    // Inicializar
    const initResult = await pasarela.init();
    console.log("✅ Inicialización completa:", initResult);

    // Obtener información
    console.log(
      "🔑 Access Token:",
      pasarela.getAccessToken() ? "***disponible***" : "no disponible"
    );
    console.log(
      "🔗 Embed URL:",
      pasarela.getEmbedUrl() ? "***disponible***" : "no disponible"
    );
    console.log("📊 Estado:", pasarela.getStatus());

    // Ejemplo de procesamiento de pago
    console.log("\n💳 Procesando pago de ejemplo...");

    const paymentResult = await pasarela.processPayment({
      amount: 250.5,
      currency: "BOB",
      description: "Pago desde Node.js - Producto ejemplo",
      reference: "NODE-REF-" + Date.now(),
      customer: {
        name: "María García",
        email: "maria@ejemplo.com",
        phone: "+591 70000000",
      },
    });

    console.log("✅ Pago procesado exitosamente:", paymentResult);

    // Limpiar recursos
    pasarela.destroy();
    console.log("🧹 Recursos limpiados");
  } catch (error) {
    console.error("❌ Error en ejemplo Node.js:", error.message);
    console.error("Stack:", error.stack);

    // Información de debugging
    console.log("\n🔍 Información de debugging:");
    console.log("- Node.js version:", process.version);
    console.log("- Platform:", process.platform);
    console.log("- Architecture:", process.arch);
  }
}

// Función para demostrar diferentes configuraciones
async function ejemploConfiguraciones() {
  console.log("\n⚙️ Probando diferentes configuraciones...");

  const configuraciones = [
    {
      nombre: "Desarrollo",
      config: {
        apiKey: "dev-api-key",
        debug: true,
        timeout: 15000,
      },
    },
    {
      nombre: "Producción",
      config: {
        apiKey: "prod-api-key",
        debug: false,
        timeout: 30000,
        baseUrl: "https://api.sintesis.com.bo/pasarelapagos/api/v1",
      },
    },
  ];

  for (const { nombre, config } of configuraciones) {
    console.log(`\n📋 Configuración: ${nombre}`);
    try {
      const pasarela = SintesisPasarela.create({
        ...config,
        mode: "api-only",
      });

      console.log(`✅ ${nombre} - Instancia creada correctamente`);
      console.log(`   Debug: ${config.debug}`);
      console.log(`   Timeout: ${config.timeout}ms`);

      // No inicializar para evitar llamadas reales
      pasarela.destroy();
    } catch (error) {
      console.error(`❌ ${nombre} - Error:`, error.message);
    }
  }
}

// Función principal
async function main() {
  console.log("=".repeat(60));
  console.log("    SINTESIS PASARELA UNIVERSAL - EJEMPLO NODE.JS");
  console.log("=".repeat(60));

  try {
    await ejemploNodejs();
    await ejemploConfiguraciones();

    console.log("\n✅ Ejemplo completado exitosamente");
  } catch (error) {
    console.error("\n❌ Error general:", error);
  }

  console.log("\n" + "=".repeat(60));
}

// Ejecutar si es el archivo principal
if (require.main === module) {
  main();
}

// Exportar funciones para uso en otros módulos
module.exports = {
  ejemploNodejs,
  ejemploConfiguraciones,
  main,
};
