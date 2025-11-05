import { Request, Response } from "express";

export const createLoan = (req: Request, res: Response) => {
    res.status(201).json({ message: "Loan created" });
};

export const getLoans = (req: Request, res: Response) => {
    res.json([{ id: 1, status: "pending" }]);
};

export const reviewLoan = (req: Request, res: Response) => {
    res.json({ message: "Loan under review" });
};

export const approveLoan = (req: Request, res: Response) => {
    res.json({ message: "Loan approved" });
};



