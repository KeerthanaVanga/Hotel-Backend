import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { serializeBigInt } from "../utils/serializeBigint";

const BOT_NUMBER = "916301633158";

export const fetchWhatsappUsers = async (_req: Request, res: Response) => {
  try {
   
    const users = await prisma.$queryRaw<
      {
        name: string;
        phone: string;
        sender_type: string;
        last_message: string;
        created_at: Date;
      }[]
    >`
      SELECT DISTINCT ON (user_phone)
        name,
        user_phone AS phone,
        sender_type,
        message AS last_message,
        created_at
      FROM (
        SELECT
          name,
          message,
          sender_type,
          created_at,
          CASE
            WHEN fromnumber = ${BOT_NUMBER} THEN tonumber
            ELSE fromnumber
          END AS user_phone
        FROM "whatsapp_messages"
      ) t
      ORDER BY user_phone, created_at DESC
    `;

    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error("Fetch users error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch WhatsApp users",
    });
  }
};



export const fetchWhatsappMessages = async (
  req: Request,
  res: Response
) => {
  try {
    const { phone } = req.params;

    const messages = await prisma.whatsapp_messages.findMany({
      where: {
        OR: [
          { fromnumber: phone, tonumber: BOT_NUMBER },
          { fromnumber: BOT_NUMBER, tonumber: phone },
        ],
      },
      orderBy: {
        created_at: "asc",
      },
      select: {
        id: true,          // BigInt
        message: true,
        sender_type: true,
        created_at: true,
      },
    });

    res.json({
      success: true,
      data: serializeBigInt(messages),
    });
  } catch (error) {
    console.error("Fetch messages error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
    });
  }
};
