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
  /** Hook editorial (BRIEF.md §16) — solo tiene sentido para el próximo curso. */
  hook?: string;
  description: string;
  /** Fecha en formato de presentación (ej. "16 de septiembre"). Opcional: el
   *  archivo también incluye cursos "todavía activos" sin fecha puntual. */
  date?: string;
  /** Fecha real en ISO 8601, usada para ordenar y derivar "próximo". */
  startsAt?: string;
  year?: number;
  modality?: string;
  /** Recorte/figura relacionada al curso (BRIEF.md §16) — solo aplica al próximo curso. */
  image?: string;
  /** Flyer/afiche completo del curso (estilo post de Instagram), opcional. */
  flyer?: string;
  /** Disertante(s), para la fila colapsada del archivo (ej. "Ps. Carolina Ciardi"). */
  instructor?: string;
  /**
   * Orden explícito dentro del archivo cuando no hay fecha que lo determine
   * (varios de estos cursos son "todavía activos", sin `startsAt`).
   */
  order?: number;
  /** HTML del body del Markdown — temario + bio del disertante, para el desplegable del archivo. */
  detailsHtml?: string;
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
