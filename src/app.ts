import express from "express";
import {
    accessLogger,
    errorLogger,
    consoleLogger,
} from "./api/v1/middleware/logger";
import errorHandler from "./api/v1/middleware/errorHandler";
import loanRoutes from "./api/v1/routes/loanRoutes";
import userRoutes from "./api/v1/routes/userRoutes";

const app = express();
app.use("/api/v1/users", userRoutes);

// Logging middleware
if (process.env.NODE_ENV === "production") {
    app.use(accessLogger);
    app.use(errorLogger);
} else {
    app.use(consoleLogger);
}

// Body parser
app.use(express.json());

// API Routes
app.use("/api/v1/loans", loanRoutes);

// Global Error Middleware
app.use(errorHandler);

export default app;



