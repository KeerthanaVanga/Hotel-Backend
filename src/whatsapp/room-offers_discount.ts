import { prisma } from "../lib/prisma.js";

export interface UpdateRoomOfferTemplateParams {
  roomId: number;
  name: string;
  offerPrice: string;
  originalPrice: string;
  discountPercentage: string;
}

export const updateRoomOffersDiscountTemplate = async ({
  roomId,
  name,
  offerPrice,
  originalPrice,
  discountPercentage,
}: UpdateRoomOfferTemplateParams) => {
  const template = await prisma.whatsapp_templates.findUnique({
    where: { template_name: "room_offers_discoun" },
  });

  if (!template || !template.template_json) {
    throw new Error("Template 'room_offers_discoun' not found");
  }
  
  const templateJson = template.template_json as any;
  
  const components = templateJson.template.components;
 
  const bodyComponent = components.find((c: any) => c.type === "body");

  if (!bodyComponent || !bodyComponent.parameters) {
    throw new Error("Body component or parameters not found in template");
  }

  const parameters = bodyComponent.parameters;

  if (roomId === 1) {
    if (parameters[0]) parameters[0].text = name;
    if (parameters[1]) parameters[1].text = offerPrice;
    if (parameters[2]) parameters[2].text = originalPrice;
    if (parameters[9]) parameters[9].text = discountPercentage;
  } else if (roomId === 2) {
    if (parameters[3]) parameters[3].text = name;
    if (parameters[4]) parameters[4].text = offerPrice;
    if (parameters[5]) parameters[5].text = originalPrice;
    if (parameters[9]) parameters[9].text = discountPercentage;
  } else if (roomId === 3) {
    if (parameters[6]) parameters[6].text = name;
    if (parameters[7]) parameters[7].text = offerPrice;
    if (parameters[8]) parameters[8].text = originalPrice;
    if (parameters[9]) parameters[9].text = discountPercentage;
  }

  const updatedTemplate = await prisma.whatsapp_templates.update({
    where: { template_name: "room_offers_discoun" },
    data: {
      template_json: templateJson,
    },
  });

  return updatedTemplate;
};
