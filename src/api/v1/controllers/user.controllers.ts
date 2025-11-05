import { Request, Response } from "express";
import { auth } from "../../../config/firebase";
import { AppError } from "../errors/errors";

/**
 * Get user by UID
 */
export const getUser = async (req: Request, res: Response) => {
  try {
    const { uid } = req.params;
    const userRecord = await auth.getUser(uid);
    res.status(200).json({
      success: true,
      data: userRecord,
    });
  } catch (error: any) {
    throw AppError.notFound(error.message);
  }
};

/**
 * Set custom claims (role) for a user
 * Admin route
 */
export const setCustomClaims = async (req: Request, res: Response) => {
  try {
    const { uid } = req.params;
    const { role } = req.body; // e.g., 'officer', 'manager', 'admin', 'reviewer'

    if (!role) throw AppError.badRequest("Role is required");

    await auth.setCustomUserClaims(uid, { role });

    res.status(200).json({
      success: true,
      message: `Role '${role}' has been assigned to user ${uid}`,
    });
  } catch (error: any) {
    throw AppError.internal(error.message);
  }
};


