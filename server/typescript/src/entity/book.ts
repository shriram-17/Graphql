import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Author } from "./author";

@Entity('book')
export class Book {
    @PrimaryGeneratedColumn()
    bid : number

    @Column()
    title : string

    @ManyToOne(() => Author,(author) => author.books)
    author : Author
}