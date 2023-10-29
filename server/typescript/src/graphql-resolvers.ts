import { AppDataSource } from "./data-source";
import { Author } from "./entity/author";
import { Book } from "./entity/book";

export const resolvers = {
  Query: {
    hello: () => 'Hello, world!',
    authors: async () => {
      try {
        const authors = await AppDataSource.getRepository(Author).find();
        return authors;
      } catch (error) {
        console.error("Error fetching authors:", error);
        throw new Error("Failed to fetch authors");
      }
      },
    books: async () => {
      try {
        const books = await AppDataSource.getRepository(Book).find({
          relations:{
            author:true
          }
        });
        return books
      } catch (error) {
        console.error("Error fetching books:", error);
        throw new Error("Failed to fetch books");
      }
    },
    authorWithBooks: async () => {
      try {
        const authors = await AppDataSource.getRepository(Author).find({
          relations: {
            books: true
          }
        });
  
        const authorWithBooks = authors.map(author => ({
          author: { id: author.id, name: author.name },
          books: author.books 
        }));
  
        return authorWithBooks;
      } catch (error) {
        console.error("Error fetching Authors with Books", error);
        throw new Error("Failed to fetch authors with books");
      }
    }
  }
};
