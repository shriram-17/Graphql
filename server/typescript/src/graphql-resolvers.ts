import { AppDataSource } from "./data-source";
import { Author } from "./entity/author";
import { Book } from "./entity/book";
import { GetAuthorWithBooksArgs } from './types';

export const resolvers = {
  Query: {
    hello: () => 'Hello, world!',
    authors: async () => {
      try {
        const authors = await AppDataSource.getRepository(Author).find(
          {
            relations:{
              books:true
            }
          }
        );
        console.log(authors)
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
    getAuthorWithBooks: async (_ : unknown , { id }: { id : number} ) : Promise<Author | string> => {
      try {
        
        console.log("Received id:", id);
        const authorWithBooks = await AppDataSource.getRepository(Author).find({
          where: {
            id: id,
          },
          relations: {
            books: true,
          },
        });
        
        return authorWithBooks[0];
      } catch (error) {
        console.error("Error fetching authors:", error);
        throw new Error("Failed to fetch author with books");
      }
    },
    getBooksWithAuthor : async(_:unknown,{bid} : {bid : number}) : Promise<Book | string>  => { 
      try {
        const booksWithAuthor = await AppDataSource.getRepository(Book).find({
          where:{
            bid:bid
          },
          relations:{
            author:true
          }
        })
        console.log(booksWithAuthor);
        return booksWithAuthor[0];
      } catch (error) {
        console.error("Error fetching authors:", error);
        throw new Error("Failed to fetch author with books");
      }
    }
  }   
};
