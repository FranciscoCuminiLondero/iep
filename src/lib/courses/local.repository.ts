import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";
import type { Course } from "../../types/course";
import type { CourseRepository } from "./repository";

function toCourse(entry: CollectionEntry<"courses">): Course {
  const { data } = entry;
  return {
    id: entry.id,
    slug: entry.id,
    title: data.title,
    hook: data.hook,
    description: data.description,
    date: data.date,
    startsAt: data.startsAt?.toISOString(),
    year: data.year,
    modality: data.modality,
    image: data.image,
    flyer: data.flyer,
    instructor: data.instructor,
    order: data.order,
    // El body del Markdown (temario, bio del disertante) ya viene renderizado
    // a HTML por el Content Layer — no hace falta un render() aparte acá.
    detailsHtml: entry.rendered?.html,
    status: data.status,
    isFeatured: data.isFeatured,
    whatsappMessage: data.whatsappMessage,
  };
}

// Implementación V1: contenido local vía Content Layer (ARCHITECTURE.md §9).
// Cuando exista backend real, se agrega `SupabaseCourseRepository` a este
// mismo directorio implementando la misma interfaz — la UI no cambia.
export class LocalCourseRepository implements CourseRepository {
  async getUpcoming(): Promise<Course | null> {
    const entries = await getCollection(
      "courses",
      ({ data }) => data.status === "published" && data.isFeatured,
    );

    if (entries.length === 0) return null;

    if (entries.length > 1) {
      // La regla "solo un curso upcoming" debería reforzarse en el backend
      // cuando exista (ver ARCHITECTURE.md §19). En V1 es responsabilidad
      // de quien edita el contenido; esto solo evita fallar en silencio.
      console.warn(
        `[LocalCourseRepository] Hay ${entries.length} cursos marcados como isFeatured; se usa "${entries[0].id}".`,
      );
    }

    return toCourse(entries[0]);
  }

  async getPast(): Promise<Course[]> {
    const entries = await getCollection("courses", ({ data }) => data.status === "archived");
    // La mayoría de estos cursos están "todavía activos" (BRIEF.md §17-18),
    // sin fecha puntual — se ordenan por `order` explícito. Los que sí
    // tengan fecha real (startsAt) van primero, más reciente primero;
    // el resto respeta el `order` dado en el contenido.
    return entries.map(toCourse).sort((a, b) => {
      if (a.startsAt && b.startsAt) return b.startsAt.localeCompare(a.startsAt);
      if (a.startsAt) return -1;
      if (b.startsAt) return 1;
      return (a.order ?? 0) - (b.order ?? 0);
    });
  }

  async getBySlug(slug: string): Promise<Course | null> {
    const entries = await getCollection("courses", ({ id }) => id === slug);
    return entries.length > 0 ? toCourse(entries[0]) : null;
  }
}

export const courseRepository: CourseRepository = new LocalCourseRepository();
