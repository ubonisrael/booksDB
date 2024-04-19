import { Request, Response } from "express";


export const getAllBooks = async (req: Request, res: Response) => {
    // const authors = (await prisma.author.findMany()).sort()
    // console.log(authors);
    // res.statusCode = 200
    // res.json({data: authors})
    res.send('Gets all books')
}

export const getBook = async (req: Request, res: Response) => {
    res.send('Get single book')
}

export const createBook = async (req: Request, res: Response) => {
    res.send('Create book')
}

export const updateBook = async (req: Request, res: Response) => {
    res.send('Update book')
}

export const deleteBook = async (req: Request, res: Response) => {
    res.send('delete book')
}
