import { Request, Response } from "express";
import { getAllUsersPayments } from "../services/payment.service";

// BigInt-safe serializer
const serializeBigInt = (data: any) =>
  JSON.parse(
    JSON.stringify(data, (_, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );

export const fetchAllUsersPayments = async (
  req: Request,
  res: Response
) => {
  try {
    const payments = await getAllUsersPayments();

    return res.status(200).json({
      success: true,
      count: payments.length,
      data: serializeBigInt(payments),
    });
  } catch (error) {
    console.error("FETCH PAYMENTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch payments",
    });
  }
};
