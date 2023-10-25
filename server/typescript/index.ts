import fastify from "fastify";
import { AppDataSource } from "./src/data-source";

const app = fastify({ logger: true });

app.get("/", async (request, reply) => {
  reply.send({ "Message": "Hello World" });
});


AppDataSource.initialize()
  .then(() => {
    console.log("Postgres is now Connected")
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err)
  })

const start = async () => {
  try {
    await app.listen({ port: 3000 });
    console.log("Server Running at port 3000");
  } catch (err) {
    console.error(err);
  }
};

start();
