import path from "path";
import crypto from "crypto";
import multer from "multer";

const tmpFolder = path.resolve(__dirname, "..", "..", "tmp");

export default {
  directory: tmpFolder,
  // Utilizaremos a propria estrutura da aplicação e o disco da maquina
  storage: multer.diskStorage({
    // local onde serão salvas as imagens
    destination: tmpFolder,
    // tratando o nome do arquivo via multer para não haver duplicações
    filename(request, file, callback) {
      const fileHash = crypto.randomBytes(10).toString("hex");
      const fileName = `${fileHash}-${file.originalname}`;

      return callback(null, fileName);
    },
  }),
};
