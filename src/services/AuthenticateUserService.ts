import { compare } from "bcryptjs";
import { getRepository } from "typeorm";
import { sign } from "jsonwebtoken";
import autConfig from "./../config/auth";

import AppError from "../errors/AppError";

import User from "../models/User";

interface Request {
  email: string;
  password: string;
}

interface Response {
  user: User;
  token: string;
}

class AuthenticateUserService {
  public async execute({ email, password }: Request): Promise<Response> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new AppError("Incorrect email/password combination!", 401);
    }

    /**
     TEMOS 2 SITUAÇÕES:
     * user.password - é a senha criptografada
     * password da Request - é a senha não-criptografada
     */

    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      throw new AppError("Incorrect email/password combination!", 401);
    }

    // objecto com as configurações do JWT
    const { secret, expiresIn } = autConfig.jwt;

    // OQUE IRA VIR NO PAYLOAD DO JWT
    // segundo parametro é um SECRET para segurança que somente nós sabemos!!!
    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    });

    //Usuario autenticado
    return {
      user,
      token,
    };
  }
}

export default AuthenticateUserService;
