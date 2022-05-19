import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import AppError from "../errors/AppError";
import autConfig from "./../config/auth";

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
): void {
  // Validação do token da aplicação
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError("JWT Token is missing!", 401);
  }

  const [, token] = authHeader.split(" ");

  try {
    const decoded = verify(token, autConfig.jwt.secret);

    const { sub } = decoded as TokenPayload;

    // DISPOMOS PARA AS ROTAS QUE TEM O MIDDLEWARE O ID DO USUÁRIO AUTENTICADO
    request.user = {
      id: sub,
    };

    return next();
  } catch {
    throw new AppError("Invalid JWT Token!", 401);
  }
}
