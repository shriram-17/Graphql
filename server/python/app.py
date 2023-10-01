from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware 
from pydantic import BaseModel
from src.books import router as book_router
from src.author import router as author_router
from strawberry.asgi import GraphQL;
from src.schema import Query as StrawberryQuery;
import strawberry;

app = FastAPI();

origins = [
    "http://localhost:5173", 
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
class AuthorPayload(BaseModel):
    name : str 
            
@app.get("/")
async def get_helloworld():
    return {"Message":"Hello World"};

app.include_router(author_router, prefix="/author", tags=["author"])

app.include_router(book_router, prefix="/book", tags=["book"])
                
strawberry_app = GraphQL(schema=strawberry.Schema(query=StrawberryQuery), debug=True)

app.add_route("/graphql", strawberry_app)