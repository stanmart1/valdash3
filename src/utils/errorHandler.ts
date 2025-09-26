export enum ErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  API_ERROR = 'API_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export interface AppError {
  type: ErrorType;
  message: string;
  details?: string;
  timestamp: Date;
  retryable: boolean;
}

export class ErrorHandler {
  static createError(type: ErrorType, message: string, details?: string, retryable: boolean = false): AppError {
    return {
      type,
      message,
      details,
      timestamp: new Date(),
      retryable,
    };
  }

  static handleSolanaError(error: any): AppError {
    if (error.message?.includes('fetch')) {
      return this.createError(
        ErrorType.NETWORK_ERROR,
        'Network connection failed',
        'Unable to connect to Solana RPC endpoint',
        true
      );
    }

    if (error.message?.includes('timeout')) {
      return this.createError(
        ErrorType.TIMEOUT_ERROR,
        'Request timeout',
        'The request took too long to complete',
        true
      );
    }

    if (error.message?.includes('Invalid public key')) {
      return this.createError(
        ErrorType.VALIDATION_ERROR,
        'Invalid validator public key',
        error.message,
        false
      );
    }

    return this.createError(
      ErrorType.API_ERROR,
      'Solana API error',
      error.message || 'Unknown API error',
      true
    );
  }

  static handleValidationError(field: string, message: string): AppError {
    return this.createError(
      ErrorType.VALIDATION_ERROR,
      `Validation failed for ${field}`,
      message,
      false
    );
  }

  static handleNetworkError(message?: string): AppError {
    return this.createError(
      ErrorType.NETWORK_ERROR,
      'Network error occurred',
      message || 'Please check your internet connection',
      true
    );
  }

  static getErrorMessage(error: AppError): string {
    switch (error.type) {
      case ErrorType.NETWORK_ERROR:
        return `🌐 ${error.message}`;
      case ErrorType.VALIDATION_ERROR:
        return `⚠️ ${error.message}`;
      case ErrorType.API_ERROR:
        return `🔌 ${error.message}`;
      case ErrorType.TIMEOUT_ERROR:
        return `⏱️ ${error.message}`;
      default:
        return `❌ ${error.message}`;
    }
  }

  static shouldRetry(error: AppError, attemptCount: number, maxAttempts: number = 3): boolean {
    return error.retryable && attemptCount < maxAttempts;
  }

  static getRetryDelay(attemptCount: number): number {
    // Exponential backoff: 1s, 2s, 4s, 8s...
    return Math.min(1000 * Math.pow(2, attemptCount), 10000);
  }
}

export const withErrorHandling = async <T>(
  operation: () => Promise<T>,
  errorContext: string = 'Operation'
): Promise<{ data?: T; error?: AppError }> => {
  try {
    const data = await operation();
    return { data };
  } catch (error) {
    console.error(`${errorContext} failed:`, error);
    
    if (error instanceof Error) {
      return { error: ErrorHandler.handleSolanaError(error) };
    }
    
    return {
      error: ErrorHandler.createError(
        ErrorType.UNKNOWN_ERROR,
        `${errorContext} failed`,
        'An unexpected error occurred',
        false
      )
    };
  }
};