import "reflect-metadata";
import { DataSource } from "typeorm";
import { Author } from "./entity/author";
import { Book } from "./entity/book";

export const AppDataSource = new DataSource({
    type:"postgres",
    host:"localhost",
    port : 5434,
    username: "test",
    password: "test",
    database: "test",
    entities:[Author,Book],
    synchronize: true
});