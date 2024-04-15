import { prisma } from "../../app"
import { Request, Response } from "express";


export const getAllAuthors = async (req: Request, res: Response) => {
    // const authors = (await prisma.author.findMany()).sort()
    // console.log(authors);
    // res.statusCode = 200
    // res.json({data: authors})
    res.send('Gets all authors')
}

export const getAuthor = async (req: Request, res: Response) => {
    res.send('Get single author')
}

export const createAuthor = async (req: Request, res: Response) => {
    res.send('Create author')
}

export const updateAuthor = async (req: Request, res: Response) => {
    res.send('Update author')
}

export const deleteAuthor = async (req: Request, res: Response) => {
    res.send('delete author')
}
