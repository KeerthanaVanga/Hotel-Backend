import { prisma } from "../lib/prisma.js";

export interface UpdateRoomTemplateParams {
  roomId: number;
  name: string;
  description: string;
  capacity: string;
}

export const updateRoomTypesTemplate = async ({
  roomId,
  name,
  description,
  capacity,
}: UpdateRoomTemplateParams) => {
  const template = await prisma.whatsapp_templates.findUnique({
    where: { template_name: "room_types" },
  });

  if (!template || !template.template_json) {
    throw new Error("Template 'room_types' not found");
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
    if (parameters[1]) parameters[1].text = description;
    if (parameters[2]) parameters[2].text = capacity;
  } else if (roomId === 2) {
    if (parameters[3]) parameters[3].text = name;
    if (parameters[4]) parameters[4].text = description;
    if (parameters[5]) parameters[5].text = capacity;
  } else if (roomId === 3) {
    if (parameters[6]) parameters[6].text = name;
    if (parameters[7]) parameters[7].text = description;
    if (parameters[8]) parameters[8].text = capacity;
  }

  const updatedTemplate = await prisma.whatsapp_templates.update({
    where: { template_name: "room_types" },
    data: {
      template_json: templateJson,
    },
  });

  return updatedTemplate;
};
