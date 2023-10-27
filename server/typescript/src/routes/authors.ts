import { FastifyInstance, FastifyRequest } from "fastify";
import { AuthorSchema, AuthorType } from "../types";
import { AppDataSource } from "../data-source";
import { Author } from "../entity/author";


const authorRouter = (app:FastifyInstance,opts:any,done:() => void) => {

    app.get('/', (request,reply)=> {
        reply.send({"Message":"Your in Author Route"});
    });

    app.post("/", async(request:FastifyRequest,reply) => {
        const author  = request.body as AuthorType;
        const valid  : boolean  = AuthorSchema.safeParse(author).success;
        if(valid)
        {
        try {
                await AppDataSource.getRepository(Author).save(author)
                reply.code(200).send({"Message":"Author Have Been Inserted","Author": author });
            } 
            catch (error) {
                reply.code(400).send({"err":error});
            }
        }
        reply.code(400).send({"Message":"Validation Error"});
    });

    app.get("/all",async (request,reply) => {
        const Authors : Author[] = await AppDataSource.getRepository(Author).find()
        reply.code(200).send({"Authors":Authors});
     });

    done();
}

export default authorRouter;
