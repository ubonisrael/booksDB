import { Request, Response } from "express";


export const getAllUsers = async (req: Request, res: Response) => {

    res.send('Gets all users')
}

export const getUser = async (req: Request, res: Response) => {
    res.send('Get single user')
}

export const createUser = async (req: Request, res: Response) => {
    res.send('Register user')
}

export const updateUser = async (req: Request, res: Response) => {
    res.send('Update user')
}

export const deleteUser = async (req: Request, res: Response) => {
    res.send('delete user')
}
