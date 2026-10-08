import type { Request, Response } from "express";

import { generateAiResponse } from "../services/ai.service.js";
import { HTTP_STATUS } from "../constants/http-status.js";
import { createHttpError } from "../utils/http-error.js";

export const chatWithAi = async (req: Request, res: Response) => {
  const { message, history = [] } = req.body;

  if (!message || typeof message !== "string") {
    throw createHttpError("Message is required", HTTP_STATUS.BAD_REQUEST);
  }

  if (!Array.isArray(history)) {
    throw createHttpError("History must be an array", HTTP_STATUS.BAD_REQUEST);
  }

  const response = await generateAiResponse(message, history);

  return res.status(HTTP_STATUS.OK).json(response);
};
