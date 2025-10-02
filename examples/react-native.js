// Ejemplo React Native - Sintesis Pasarela Universal
// Para usar en una aplicación React Native

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TextInput,
} from "react-native";

// Importar la librería
import SintesisPasarela from "sintesis-pasarela-universal";

const PasarelaExample = () => {
  const [pasarela, setPasarela] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [status, setStatus] = useState("No inicializado");
  const [amount, setAmount] = useState("100.00");

  useEffect(() => {
    initializePasarela();

    // Cleanup al desmontar
    return () => {
      if (pasarela) {
        pasarela.destroy();
      }
    };
  }, []);

  const initializePasarela = async () => {
    try {
      setIsLoading(true);
      setStatus("Inicializando...");

      const nuevaPasarela = SintesisPasarela.create({
        apiKey: "react-native-api-key",
        mode: "api-only", // En React Native solo API
        debug: true,
        timeout: 30000,
        onSuccess: (data) => {
          console.log("✅ RN Success:", data);
          Alert.alert("Éxito", "Operación completada exitosamente");
        },
        onError: (error) => {
          console.error("❌ RN Error:", error);
          Alert.alert("Error", error.message);
        },
        onLoad: () => {
          setStatus("Cargando...");
        },
        onTokenExpired: () => {
          Alert.alert("Atención", "Token expirado, renovando...");
          reinitializePasarela();
        },
      });

      await nuevaPasarela.init();

      setPasarela(nuevaPasarela);
      setIsInitialized(true);
      setStatus("Inicializado correctamente");

      console.log(
        "🔑 Access Token disponible:",
        !!nuevaPasarela.getAccessToken()
      );
      console.log("🔗 Embed URL disponible:", !!nuevaPasarela.getEmbedUrl());
    } catch (error) {
      console.error("❌ Error inicializando:", error);
      setStatus("Error: " + error.message);
      Alert.alert("Error de Inicialización", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const reinitializePasarela = async () => {
    if (pasarela) {
      pasarela.destroy();
    }
    setIsInitialized(false);
    await initializePasarela();
  };

  const processPayment = async () => {
    if (!pasarela || !isInitialized) {
      Alert.alert("Error", "Pasarela no inicializada");
      return;
    }

    try {
      setIsLoading(true);
      setStatus("Procesando pago...");

      const paymentData = {
        amount: parseFloat(amount) || 100.0,
        currency: "BOB",
        description: "Pago desde React Native",
        reference: "RN-" + Date.now(),
        customer: {
          name: "Usuario React Native",
          email: "usuario@reactnative.com",
          phone: "+591 70000000",
        },
      };

      console.log("💳 Procesando pago:", paymentData);

      const result = await pasarela.processPayment(paymentData);

      console.log("✅ Pago procesado:", result);
      setStatus("Pago procesado exitosamente");

      Alert.alert(
        "Pago Exitoso",
        `Monto: ${paymentData.amount} ${paymentData.currency}\\nReferencia: ${paymentData.reference}`,
        [{ text: "OK" }]
      );
    } catch (error) {
      console.error("❌ Error en pago:", error);
      setStatus("Error en pago: " + error.message);
      Alert.alert("Error de Pago", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusInfo = () => {
    if (!pasarela) return "No disponible";

    return {
      status: pasarela.getStatus(),
      hasToken: !!pasarela.getAccessToken(),
      hasEmbedUrl: !!pasarela.getEmbedUrl(),
    };
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Sintesis Pasarela - React Native</Text>

      {/* Estado */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Estado Actual</Text>
        <Text style={styles.status}>{status}</Text>

        {isInitialized && (
          <View style={styles.info}>
            <Text>Estado: {getStatusInfo().status}</Text>
            <Text>Token: {getStatusInfo().hasToken ? "✅" : "❌"}</Text>
            <Text>
              URL Embebida: {getStatusInfo().hasEmbedUrl ? "✅" : "❌"}
            </Text>
          </View>
        )}
      </View>

      {/* Controles */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Controles</Text>

        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={initializePasarela}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isInitialized ? "Reinicializar" : "Inicializar"} Pasarela
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => {
            if (pasarela) {
              const info = getStatusInfo();
              Alert.alert("Información", JSON.stringify(info, null, 2));
            }
          }}
          disabled={!isInitialized || isLoading}
        >
          <Text style={styles.buttonText}>Ver Información</Text>
        </TouchableOpacity>
      </View>

      {/* Pago */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Procesar Pago</Text>

        <TextInput
          style={styles.input}
          placeholder="Monto (BOB)"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />

        <TouchableOpacity
          style={[styles.button, styles.successButton]}
          onPress={processPayment}
          disabled={!isInitialized || isLoading}
        >
          <Text style={styles.buttonText}>Procesar Pago</Text>
        </TouchableOpacity>
      </View>

      {/* Loading */}
      {isLoading && (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.loadingText}>Procesando...</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
    color: "#333",
  },
  section: {
    backgroundColor: "white",
    padding: 20,
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  status: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
  },
  info: {
    backgroundColor: "#f8f9fa",
    padding: 10,
    borderRadius: 5,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    marginVertical: 5,
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: "#007bff",
  },
  secondaryButton: {
    backgroundColor: "#6c757d",
  },
  successButton: {
    backgroundColor: "#28a745",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  loading: {
    alignItems: "center",
    marginVertical: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
});

export default PasarelaExample;

// Ejemplo de uso en App.js:
/*
import React from 'react';
import PasarelaExample from './PasarelaExample';

const App = () => {
  return <PasarelaExample />;
};

export default App;
*/

// Hook personalizado para usar la pasarela
export const useSintesisPasarela = (config) => {
  const [pasarela, setPasarela] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (config && config.apiKey) {
      initPasarela();
    }

    return () => {
      if (pasarela) {
        pasarela.destroy();
      }
    };
  }, [config]);

  const initPasarela = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const nuevaPasarela = SintesisPasarela.create({
        ...config,
        mode: "api-only",
      });

      await nuevaPasarela.init();

      setPasarela(nuevaPasarela);
      setIsInitialized(true);
    } catch (err) {
      setError(err);
      console.error("Error inicializando pasarela:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const processPayment = async (paymentData) => {
    if (!pasarela || !isInitialized) {
      throw new Error("Pasarela no inicializada");
    }

    return await pasarela.processPayment(paymentData);
  };

  return {
    pasarela,
    isInitialized,
    isLoading,
    error,
    processPayment,
    reinit: initPasarela,
  };
};
