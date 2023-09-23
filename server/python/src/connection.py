import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import  Session, relationship
from sqlalchemy.ext.declarative import declarative_base
from dotenv import load_dotenv

load_dotenv()

DB_URL = os.getenv("DATABASE_URL")

engine = create_engine(DB_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class Author(Base):
    __tablename__ = "authors"
    
    id = Column(Integer,primary_key=True,index=True);
    name = Column(String,index=True);
    books = relationship("Book",back_populates="author");
    
class Book(Base):
    __tablename__ = "books"
    
    bid = Column(Integer,primary_key=True,index=True);
    title = Column(String,index=True);
    author_id = Column(Integer,ForeignKey("authors.id"));
    author = relationship("Author",back_populates ="books");
   
Base.metadata.create_all(bind=engine);