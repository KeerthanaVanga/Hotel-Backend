import { Request, Response } from "express";
import {
  getAllRooms,
  createRoom,
  updateRoomById,
} from "../services/room.service.js";
import { uploadBufferToCloudinary } from "../utils/cloudinaryUpload.js";
import { serializeBigInt } from "../utils/serializeBigint.js";
import { updateRoomTypesTemplate } from "../whatsapp/room_types.js";
import { updateRoomOffersDiscountTemplate } from "../whatsapp/room-offers_discount.js";
import { updateDeluxeRoomTemplate } from "../whatsapp/deluxe_room.js";
import { updateExecutiveRoomTemplate } from "../whatsapp/executive_room.js";
import { updateSuiteRoomTemplate } from "../whatsapp/suite_room.js";

export const fetchAllRooms = async (req: Request, res: Response) => {
  try {
    const rooms = await getAllRooms();

    return res.status(200).json({
      success: true,
      count: rooms.length,
      data: serializeBigInt(rooms),
    });
  } catch (error) {
    console.error("FETCH ROOMS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch rooms",
    });
  }
};

export const addRoom = async (req: Request, res: Response) => {
  try {
    const {
      room_name,
      room_type,
      price,
      description,
      total_rooms,
      guests,
      room_size,
      amenities,
    } = req.body;

    const files = (req.files as Express.Multer.File[]) || [];

    // ✅ Upload to Cloudinary
    const image_urls = await Promise.all(
      files.map((f) => uploadBufferToCloudinary(f.buffer, "hotel/rooms")),
    );

    const room = await createRoom({
      room_name,
      room_type,
      price: Number(price),
      description,
      image_urls,
      total_rooms: Number(total_rooms),
      guests: Number(guests),
      room_size,
      amenities: JSON.parse(amenities),
    });

    return res.status(201).json({
      success: true,
      data: serializeBigInt(room),
    });
  } catch (error) {
    console.error("ADD ROOM ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add room",
    });
  }
};

export const updateRoom = async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params;

    const {
      room_name,
      room_type,
      price,
      description,
      guests,
      room_size,
      amenities,
      existing_images,
    } = req.body;
    
    const files = (req.files as Express.Multer.File[]) || [];
    const amenitiesArray = JSON.parse(amenities);
    // ✅ Upload new images to Cloudinary
    const newImageUrls = await Promise.all(
      files.map((f) => uploadBufferToCloudinary(f.buffer, "hotel/rooms")),
    );

    const finalImages = [
      ...JSON.parse(existing_images || "[]"),
      ...newImageUrls,
    ];

    // ✅ DO NOT update room_number / total_rooms
    const updatedRoom = await updateRoomById(roomId, {
      room_name,
      room_type,
      price: Number(price),
      description,
      image_urls: finalImages,
      guests: Number(guests),
      room_size,
      amenities: amenitiesArray,
    });
    const templateDescription = description.replace(/[\r\n]+/g, " ").trim();

    const numRoomId = Number(roomId);
    try {
      await updateRoomTypesTemplate({
        roomId: numRoomId,
        name: room_name || "",
        description: description || "",
        capacity: String(guests || ""),
      });

      await updateRoomOffersDiscountTemplate({
        roomId: numRoomId,
        name: room_name || "",
        originalPrice: String(price || ""),
        offerPrice: String(req.body.offerPrice || price || ""),
        discountPercentage: String(req.body.discountPercentage || "0"),
      });

      if (numRoomId === 1) {
        await updateDeluxeRoomTemplate({
          name: room_name || "",
          description1: room_type || "",
          description2:  templateDescription || "",
          capacity: String(guests || ""),
          originalPrice: String(price || ""),
          policies: amenitiesArray.join(",") || "",
        });
      } else if (numRoomId === 2) {
        await updateExecutiveRoomTemplate({
          name: room_name || "",
          description1: room_type || "",
          description2: templateDescription || "",
          capacity: String(guests || ""),
          originalPrice: String(price || ""),
          policies: amenitiesArray.join(",") || "",
        });
      } else if (numRoomId === 3) {
        await updateSuiteRoomTemplate({
          name: room_name || "",
          description1: room_type || "",
          description2: templateDescription || "",
          capacity: String(guests || ""),
          originalPrice: String(price || ""),
          policies: amenitiesArray.join(",") || "",
        });
      }
    } catch (tmplErr) {
      console.error("Failed to update WhatsApp templates:", tmplErr);
    }

    return res.status(200).json({
      success: true,
      data: serializeBigInt(updatedRoom),
    });
  } catch (error) {
    console.error("UPDATE ROOM ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update room",
    });
  }
};
