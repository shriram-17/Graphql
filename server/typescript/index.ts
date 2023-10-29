import fastify from "fastify";
import { AppDataSource } from "./src/data-source";
import authorRouter from "./src/routes/authors";
import bookRouter from "./src/routes/books";
import fs from 'fs';
import { resolvers } from "./src/graphql-resolvers";
import mercurius from "mercurius";


const schema = fs.readFileSync("./schema.graphql", { encoding: "utf8" });

const app = fastify({ logger: true });

AppDataSource.initialize()
  .then(() => {
    console.log("Postgres is now Connected")
  })
  .catch((err: any) => {
    console.error("Error during Data Source initialization", err)
  });

app.register(authorRouter, { prefix: "/author" });
app.register(bookRouter, { prefix: "/book" });
app.register(mercurius, {
  schema,
  resolvers,
  ide: true
});


app.get("/", async (request: any, reply: any) => {
  reply.send({ "Message": "Hello World" });
});

const start = async () => {
  try {
    await app.listen({ port: 3000 });
    console.log("Server Running at port 3000");
  } catch (err) {
    console.error(err);
  }
};

start();