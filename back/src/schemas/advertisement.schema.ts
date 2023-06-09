import { z } from "zod";
import { commentResSchema } from "./comments.schema";
import { imageGalleryListSchema, imageGalleryReqSchema } from "./imageGallery.schema";

const advertisementReqSchema = z.object({
  brand: z.string().max(60),
  model: z.string().max(120),
  year: z.number(),
  fuel: z.string().max(20),
  color: z.string().max(20),
  kilometers: z.number(),
  price: z.number(),
  description: z.string(),
  image: z.string().max(300),
  image_gallery: z.array(imageGalleryReqSchema).optional()
});

const advertisementResSchema = advertisementReqSchema.extend({
  id: z.string().uuid(),
  is_available: z.boolean(),
  created_at: z.date(),
  updated_at: z.date(),
  user: z.object({
    id: z.string(),
    name: z.string(),
    profile_img: z.string(),
    description: z.string(),
    phone_number: z.string(),
  }),
  comments: z.array(commentResSchema.omit({ advertisement: true })),
  imageGallery: imageGalleryListSchema
});

const advertisementReqUpdateSchema = advertisementReqSchema.partial();

const advertisementListResSchema = z.array(advertisementResSchema);

export {
  advertisementReqSchema,
  advertisementResSchema,
  advertisementListResSchema,
  advertisementReqUpdateSchema,
};
