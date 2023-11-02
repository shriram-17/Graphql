import { AppDataSource } from "./data-source";
import { Author } from "./entity/author";
import { Book } from "./entity/book";

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
  },
  Mutation :{
   createAuthor: async(_:unknown ,{name}: {name:string} ) : Promise<Author | string> => {
      try {
        const newAuthor = await AppDataSource.getRepository(Author).save({
          name:name
        });
        console.log("Created author:", newAuthor);
        return newAuthor;

      } catch (error) {
        console.error("Error creating author:", error);
        throw new Error("Failed to create author");
      }
   },
   createBook : async (_: unknown ,{title , authorId} :{ title : string, authorId : number}) : Promise<Book| string> => {
    try {
      console.log()
      console.log("author_id",authorId);
      const newAuthor  = await AppDataSource.getRepository(Author).findOne({
        where:{
          id : authorId
        }
      });

      if(newAuthor)
      {
        const newBook = new Book();
        newBook.title = title;
        newBook.author = newAuthor;
        const saved_book = await AppDataSource.getRepository(Book).save(newBook);
        return  saved_book;
      }
      
      throw new Error("Failed to find author_id")
    } catch (error) {
      console.error("Error creating book:", error);
      throw new Error("Failed to create book");
    }
   },
   deleteAuthor: async (_: unknown, { id }: { id: number }): Promise<string> => {
    try {
      const authorToDelete = await AppDataSource.getRepository(Author).findOne({
        where: {
          id: id,
        },
      });

      if (authorToDelete) {
        await AppDataSource.getRepository(Author).remove(authorToDelete);
        console.log("Deleted author:", authorToDelete);
        return `Author with ID ${id} has been deleted`;
      } else {
        throw new Error("Author not found");
      }
    } catch (error) {
      console.error("Error deleting author:", error);
      throw new Error("Failed to delete author");
    }
  },

  deleteBook: async (_: unknown, { bid }: { bid: number }): Promise<string> => {
    try {
      const bookToDelete = await AppDataSource.getRepository(Book).findOne({
        where: {
          bid: bid,
        },
      });

      if (bookToDelete) {
        await AppDataSource.getRepository(Book).remove(bookToDelete);
        console.log("Deleted book:", bookToDelete);
        return `Book with bid ${bid} has been deleted`;
      } else {
        throw new Error("Book not found");
      }
    } catch (error) {
      console.error("Error deleting book:", error);
      throw new Error("Failed to delete book");
    }
  } 
  }   
};
