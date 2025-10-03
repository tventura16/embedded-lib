// Type definitions for sintesis-pasarela-universal v2.0.0
// Project: https://github.com/sintesis/embedded-lib
// Definitions by: Sintesis Team

declare namespace SintesisPasarela {
  interface CustomerInfo {
    email?: string;
    firstName?: string;
    lastName?: string;
    identityNumber?: string;
  }

  interface Config {
    apiKey: string;
    baseUrl?: string;
    autoInit?: boolean;
    debug?: boolean;
    timeout?: number;
    mode?: "auto" | "webview" | "iframe" | "api-only";
    customerInfo?: CustomerInfo;
    onSuccess?: (data: SuccessData) => void;
    onError?: (error: ErrorData) => void;
    onLoad?: () => void;
    onTokenExpired?: () => void;
  }

  interface SuccessData {
    accessToken: string;
    embedUrl: string;
    environment: string;
    timestamp: string;
  }

  interface ErrorData {
    message: string;
    code?: string;
    timestamp: string;
    environment: string;
  }

  interface RenderOptions {
    width?: string;
    height?: string;
    mode?: "auto" | "webview" | "iframe" | "api-only";
  }

  interface InitResult {
    success: boolean;
    accessToken?: string;
    embedUrl?: string;
    environment?: string;
    timestamp?: string;
  }

  interface PaymentData {
    amount: number;
    currency: string;
    description?: string;
    reference?: string;
    customer?: {
      name?: string;
      email?: string;
      phone?: string;
    };
  }

  class SintesisPasarelaCore {
    constructor(config: Config);

    init(): Promise<InitResult>;
    render(
      container: HTMLElement | string,
      options?: RenderOptions
    ): Promise<void>;
    processPayment(paymentData: PaymentData): Promise<any>;
    setCustomerInfo(customerInfo: CustomerInfo): Promise<void>;
    getCustomerInfo(): CustomerInfo | null;
    destroy(): void;
    getStatus(): string;
    getEmbedUrl(): string | null;
    getAccessToken(): string | null;
  }

  interface SintesisPasarelaStatic {
    create(config: Config): SintesisPasarelaCore;
    init(config: Config): SintesisPasarelaCore;
    new (config: Config): SintesisPasarelaCore;
    autoInit(): void;
    version: string;
  }
}

declare const SintesisPasarela: SintesisPasarela.SintesisPasarelaStatic;

declare module "sintesis-pasarela-universal" {
  export = SintesisPasarela;
}

// Global declaration for browser usage
declare global {
  interface Window {
    SintesisPasarela: SintesisPasarela.SintesisPasarelaStatic;
  }
}

export = SintesisPasarela;
