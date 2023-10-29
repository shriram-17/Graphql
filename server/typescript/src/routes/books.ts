import { FastifyInstance, FastifyRequest } from "fastify";
import { BookSchema, BookType } from "../types";
import { AppDataSource } from "../data-source";
import { Author } from "../entity/author";
import { Book } from "../entity/book";

const bookRouter = (app: FastifyInstance, opts: any, done: () => void) => {

    app.get('/', async (request, reply) => {
        reply.code(200).send({ "Message": "You are Book Router" });
    });

    app.post("/", async (request, reply): Promise<string> => {
        const book = request.body as BookType;
        console.log(BookSchema.parse(book))
        const valid: boolean = BookSchema.safeParse(book).success;
        if (valid) {
            const author = await AppDataSource.getRepository(Author).findOneBy({
                id: book.authorId
            });
            
            if(author)
            {    
                const newBook = new Book();
                newBook.title = book.title;
                newBook.author = author;
                
                const saved_book = await AppDataSource.getRepository(Book).save(newBook);
                reply.code(200).send({"Message":saved_book});
            }
            return reply.code(400).send({"Message":"Author Not Found"})
        };
        return reply.code(404).send({ "Message": "NO" })
    });

    app.get('/all', async (request,reply) => {
        const books = await AppDataSource.getRepository(Book).find();
        reply.code(200).send({"Books" : books});
    });

   
    app.delete('/:id', async(request:FastifyRequest<{Params:{id:number}}>,reply) => {
       try {
        
        const bookToDelete = await AppDataSource.getRepository(Book).findOneBy({
            bid:request.params.id
        });

        if (bookToDelete) {
            await AppDataSource.getRepository(Book).remove(bookToDelete);
            reply.code(200).send({ "Message": "Book has been deleted" });
          } else {
            reply.code(404).send({ "Message": "Book not found" });
          }
       }
        catch (error) 
        {
            reply.code(500).send({"err":error});
       }
    });
    
    done();
}

export default bookRouter;