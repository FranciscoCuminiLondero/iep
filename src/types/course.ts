// Dominio de curso — ver docs/ARCHITECTURE.md §4-5.
//
// No se modela "upcomingCourse" como propiedad separada: existe un único
// tipo `Course` con `status` e `isFeatured`, y la aplicación deriva cuál es
// el próximo curso. Esto evita que la fuente de datos (Content Layer hoy,
// Supabase mañana) pueda quedar inconsistente entre dos representaciones
// del mismo curso.

export type CourseStatus = "draft" | "published" | "archived";

export interface Course {
  id: string;
  slug: string;
  title: string;
  hook: string;
  description: string;
  /** Fecha en formato de presentación (ej. "16 de septiembre"). */
  date: string;
  /** Fecha real en ISO 8601, usada para ordenar y derivar "próximo". */
  startsAt: string;
  year: number;
  modality: string;
  image: string;
  status: CourseStatus;
  /**
   * Marca editorial de "este es el próximo curso".
   * Regla de negocio (ARCHITECTURE.md §19): solo puede haber un curso
   * `published` con `isFeatured: true` a la vez. En V1 (contenido local)
   * esto se respeta por convención; cuando exista backend real, debe
   * reforzarse ahí, no solo en la UI.
   */
  isFeatured: boolean;
  whatsappMessage?: string;
}
