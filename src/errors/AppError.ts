class AppError {
  // READONLY - somente leitura (não editavel)
  public readonly message: string;
  public readonly statusCode: number; // CODIGO HTTP

  constructor(message: string, statusCode = 400) {
    this.message = message;
    this.statusCode = statusCode;
  }
}

export default AppError;
