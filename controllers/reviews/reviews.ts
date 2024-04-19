import { Request, Response } from "express";


export const getAllReviews = async (req: Request, res: Response) => {
    // const authors = (await prisma.author.findMany()).sort()
    // console.log(authors);
    // res.statusCode = 200
    // res.json({data: authors})
    res.send('Gets all reviews')
}

export const getReview = async (req: Request, res: Response) => {
    res.send('Get single review')
}

export const createReview = async (req: Request, res: Response) => {
    res.send('Create review')
}

export const updateReview = async (req: Request, res: Response) => {
    res.send('Update review')
}

export const deleteReview = async (req: Request, res: Response) => {
    res.send('delete review')
}
