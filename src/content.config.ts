import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// Content Layer (Astro 5+/6/7) — ver docs/ARCHITECTURE.md §9.
// V1: cursos como Markdown local. El schema espeja `src/types/course.ts`
// para que la validación en build time y el tipo de dominio no se desalineen.
const courses = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/courses" }),
  schema: z.object({
    title: z.string(),
    hook: z.string().optional(),
    description: z.string(),
    date: z.string().optional(),
    startsAt: z.coerce.date().optional(),
    year: z.number().int().optional(),
    modality: z.string().optional(),
    image: z.string().optional(),
    flyer: z.string().optional(),
    instructor: z.string().optional(),
    order: z.number().int().optional(),
    status: z.enum(["draft", "published", "archived"]),
    isFeatured: z.boolean().default(false),
    whatsappMessage: z.string().optional(),
  }),
});

export const collections = { courses };
