import axios from "axios";
import "dotenv/config";
const WHATSAPP_API_URL = process.env.WHATSAPP_API_URL!;
const WHATSAPP_API_KEY = process.env.WHATSAPP_API_KEY!;

interface SendBookingTemplateParams {
  phone: string;
  guestName: string;
  checkIn: string;
  checkOut: string;
  nights: string;
  adults: string;
  children: string;
  room_name: string;
  final_amount: string;
}

const sendBookingConfirmationWhatsApp = async (
  params: SendBookingTemplateParams,
) => {
  const {
    phone,
    guestName,
    checkIn,
    checkOut,
    nights,
    adults,
    children,
    room_name,
    final_amount,
  } = params;

  return axios.post(
    WHATSAPP_API_URL,
    {
      messaging_product: "whatsapp",
      to: phone,
      type: "template",
      template: {
        name: "confirm_booking",
        language: {
          code: "en",
        },
        components: [
          {
            type: "header",
            parameters: [
              {
                type: "image",
                image: {
                  link: "https://res.cloudinary.com/dg5fzsnek/image/upload/v1769077310/ChatGPT_Image_Jan_22_2026_03_22_13_PM_sjf09s.png",
                },
              },
            ],
          },
          {
            type: "body",
            parameters: [
              {
                type: "text",
                text: guestName,
              },
              {
                type: "text",
                text: checkIn,
              },
              {
                type: "text",
                text: checkOut,
              },
              {
                type: "text",
                text: nights,
              },
              {
                type: "text",
                text: adults,
              },
              {
                type: "text",
                text: children,
              },
              {
                type: "text",
                text: room_name,
              },
              {
                type: "text",
                text: final_amount,
              },
            ],
          },
        ],
      },
    },
    {
      headers: {
        Authorization: `Bearer ${WHATSAPP_API_KEY}`,
        "Content-Type": "application/json",
      },
      timeout: 5000,
    },
  );
};

export { sendBookingConfirmationWhatsApp };
