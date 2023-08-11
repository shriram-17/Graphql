from fastapi import FastAPI, HTTPException;
from src.prisma import prisma;
from pydantic import BaseModel;
from src.schema import schema;

import typing
import strawberry

app = FastAPI();

class ItemCreate(BaseModel):
    name : str
    
@app.on_event("startup")
async def startup_db_client():
    await prisma.connect()

@app.on_event("shutdown")
async def shutdown_db_client():
    await  prisma.disconnect()

@app.get("/")
async def get_homepage():
    return {'Message':"hello World"}

@app.post("/")
async def create_item(item:ItemCreate):
    item = await prisma.item.create(
    data={
        "name":item.name
    });
    return item

@app.get("/items")
async def get_all_items():
    items = await prisma.item.find_many();
    return items;

@app.get("/items/name")
async def get_items_by_name(name:str):
    item = await prisma.item.find_first(
      where={
          "name":name
      }  
    );
    if item:
        return item        
    return "No Names Found";

@app.get('/graphql')
async def graphql_endpoint(query:str):
    result = await  schema.execute(query);
    if result.errors:
        raise HTTPException(status_code=400, detail=str(result.errors[0]))
    return result.data