import { prisma } from "../../app"
import { Request, Response } from "express";


export const getAllUsers = async (req: Request, res: Response) => {
    // const authors = (await prisma.author.findMany()).sort()
    // console.log(authors);
    // res.statusCode = 200
    // res.json({data: authors})
    res.send('Gets all users')
}

export const getUser = async (req: Request, res: Response) => {
    res.send('Get single user')
}

export const createUser = async (req: Request, res: Response) => {
    res.send('Create user')
}

export const updateUser = async (req: Request, res: Response) => {
    res.send('Update user')
}

export const deleteUser = async (req: Request, res: Response) => {
    res.send('delete user')
}
