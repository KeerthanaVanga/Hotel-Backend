import { prisma } from "../lib/prisma.js";

export interface UpdateSuiteRoomTemplateParams {
  name?: string;
  description1?: string;
  description2?: string;
  capacity?: string;
  originalPrice?: string;
  offerPrice?: string;
  policies?: string;
}

export const updateSuiteRoomTemplate = async ({
  name,
  description1,
  description2,
  capacity,
  originalPrice,
  offerPrice,
  policies,
}: UpdateSuiteRoomTemplateParams) => {
  const template = await prisma.whatsapp_templates.findUnique({
    where: { template_name: "suite_room" },
  });

  if (!template || !template.template_json) {
    throw new Error("Template 'suite_room' not found");
  }

  const templateJson = template.template_json as any;
  const components = templateJson.template.components;
  const bodyComponent = components.find((c: any) => c.type === "body");

  if (!bodyComponent || !bodyComponent.parameters) {
    throw new Error("Body component or parameters not found in template");
  }

  const parameters = bodyComponent.parameters;

  if (name !== undefined && parameters[0]) parameters[0].text = name;
  if (description1 !== undefined && parameters[1]) parameters[1].text = description1;
  if (description2 !== undefined && parameters[2]) parameters[2].text = description2;
  if (capacity !== undefined && parameters[3]) parameters[3].text = capacity;
  if (originalPrice !== undefined && parameters[4]) parameters[4].text = originalPrice;
  if (offerPrice !== undefined && parameters[5]) parameters[5].text = offerPrice;
  if (policies !== undefined && parameters[6]) parameters[6].text = policies;

  const updatedTemplate = await prisma.whatsapp_templates.update({
    where: { template_name: "suite_room" },
    data: {
      template_json: templateJson,
    },
  });

  return updatedTemplate;
};
