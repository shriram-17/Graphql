import {z} from 'zod'

export const AuthorSchema = z.object({
    name : z.string().min(5)
});

export const BookSchema = z.object({
    title : z.string().min(6),
    authorId : z.number()
});

export type AuthorType = z.infer<typeof AuthorSchema>
export type BookType = z.infer<typeof BookSchema>