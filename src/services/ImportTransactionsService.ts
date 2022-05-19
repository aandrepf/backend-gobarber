import csvParse from "csv-parse";
import fs from "fs";
import { getCustomRepository, getRepository, In } from "typeorm";
import Category from "../models/Category";
import Transaction from "../models/Transaction";
import TransactionsRepository from "../repositories/TransactionsRepository";

interface CSVTRansactions {
  title: string;
  type: "income" | "outcome";
  value: number;
  category: string;
}

class ImportTransactionsService {
  async execute(filePath: string): Promise<Transaction[]> {
    const contactsReadStream = fs.createReadStream(filePath);
    const categoryRepository = getRepository(Category);
    const transactionRespository = getCustomRepository(TransactionsRepository);

    const parses = csvParse({
      from_line: 2,
    });

    const parseCSV = contactsReadStream.pipe(parses);

    const transactions: CSVTRansactions[] = [];
    const categories: string[] = [];

    parseCSV.on("data", async (line) => {
      const [title, type, value, category] = line.map((cell: string) =>
        cell.trim()
      );

      if (!title || !type || !value) return;

      categories.push(category);
      transactions.push({ title, type, value, category });
    });

    await new Promise((resolve) => parseCSV.on("end", resolve));

    // BULK INSERT STRATEGY
    const existentCategories = await categoryRepository.find({
      where: {
        title: In(categories),
      },
    });

    const existentCategoriesTitles = existentCategories.map(
      (category) => category.title
    );

    const addCategoryTitles = categories
      .filter((category) => !existentCategoriesTitles.includes(category))
      .filter((value, index, self) => self.indexOf(value) === index);

    console.log(addCategoryTitles);

    const newCategories = categoryRepository.create(
      addCategoryTitles.map((title) => ({
        title,
      }))
    );

    await categoryRepository.save(newCategories);

    const finalCategories = [...newCategories, ...existentCategories];

    const createdTransactions = transactionRespository.create(
      transactions.map((transaction) => ({
        title: transaction.title,
        type: transaction.type,
        value: transaction.value,
        category: finalCategories.find(
          (category) => category.title === transaction.category
        ),
      }))
    );

    await transactionRespository.save(createdTransactions);

    await fs.promises.unlink(filePath);

    return createdTransactions;
  }
}

export default ImportTransactionsService;
