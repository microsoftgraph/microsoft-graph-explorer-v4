type ErrorType = 'warning' | 'error';

class ValidationError extends Error {
  type: ErrorType;

  constructor(message: string, type: ErrorType, name: string = 'ValidationError') {
    super(message);
    this.name = name;
    this.type = type;
    this.message = message;
  }
}

export { ValidationError };
