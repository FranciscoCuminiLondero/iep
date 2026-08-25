import type { Course } from "../../types/course";

// Repository pattern (ARCHITECTURE.md §15). La UI depende únicamente de
// esta interfaz, nunca de `astro:content` ni de una futura tabla de
// Supabase directamente — así la fuente de datos se puede reemplazar sin
// tocar componentes (ver ARCHITECTURE.md §16).
export interface CourseRepository {
  getUpcoming(): Promise<Course | null>;
  getPast(): Promise<Course[]>;
  getBySlug(slug: string): Promise<Course | null>;
}
