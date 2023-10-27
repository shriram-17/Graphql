import { FastifyInstance } from "fastify";
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
        const valid: boolean = BookSchema.safeParse(book).success;
        if (valid) {
            const author = await AppDataSource.getRepository(Author).findOneBy({
                id: book.author_id
            });
            
            if(author)
            {     
                const saved_book = await AppDataSource.getRepository(Book).save(book)
                reply.code(200).send({"Message":saved_book});
            }
            return reply.code(400).send({"Message":"Author Not Found"})
        };
        return reply.code(404).send({ "Message": "NO" })
    });

    app.get('/all', async (request,reply) => {
        const books = await AppDataSource.getRepository(Book).find();
        reply.code(200).send({"Books" : books});
    })
    done();
}

export default bookRouter;