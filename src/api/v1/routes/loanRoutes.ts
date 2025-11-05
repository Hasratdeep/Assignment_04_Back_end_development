import { Router } from "express";
import {
    createLoan,
    getLoans,
    reviewLoan,
    approveLoan,
} from "../controllers/loan.controllers";

const router = Router();

router.post("/", createLoan);       
router.get("/", getLoans);           
router.post("/:id/review", reviewLoan); 
router.post("/:id/approve", approveLoan);

export default router;



