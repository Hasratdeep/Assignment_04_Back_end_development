import { Request, Response, NextFunction } from "express";
 
// Type for standard Express middleware
export type MiddlewareFunction = (req: Request, res: Response, next: NextFunction) => void;