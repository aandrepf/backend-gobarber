// sobrescrever uma tipagem do namespace Express
declare namespace Express {
  //sobrescrevendo a importação do Request
  export interface Request {
    user: {
      id: string;
    };
  }
}
