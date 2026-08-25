# ARCHITECTURE.md — IEP Web

## Resumen de la decisión

No se diseña la arquitectura pensando únicamente en la web que se necesita hoy, pero tampoco se construye un "CMS enterprise" que todavía no hace falta.

**Arquitectura evolutiva propuesta:**

> Astro + Tailwind + TypeScript + Lucide ahora, con el dominio de cursos desacoplado desde el principio para poder reemplazar la fuente de datos estática por Supabase/CMS más adelante sin rehacer la UI.

Dado que eventualmente se quiere un panel donde administradores puedan cambiar el próximo curso, el diseño contempla esa transición desde el comienzo.

> Nota de fuentes: esta decisión se basó en la documentación de Astro y Supabase vigente al momento de redactar este documento (Astro 6, Content Layer, Actions, SSR). Astro 6 eliminó la API antigua de Content Collections; las colecciones ahora usan Content Layer.

---

## 1. Stack propuesto

### Base

| Tecnología | Decisión | Motivo |
|---|---|---|
| **Astro** | ✅ Sí | Excelente para sitio principalmente estático/editorial |
| **TypeScript** | ✅ Sí | Tipado del dominio y futura integración con DB |
| **Tailwind CSS 4** | ✅ Sí | Velocidad + consistencia visual |
| **Lucide Icons** | ✅ Sí | Iconografía limpia y consistente |
| **CSS propio** | ✅ Sí, pero limitado | Para detalles artísticos/collage que Tailwind no debería resolver |
| **Supabase** | 🟡 Preparar desde la arquitectura | DB + Auth + Storage para futura administración |
| **React** | ❌ No inicialmente | No se necesita una SPA React completa |
| **Zustand/Redux** | ❌ No | Estado global innecesario |
| **CMS externo** | 🟡 Futuro | Evaluar cuando realmente se necesite edición |
| **Framer Motion** | ❌ Probablemente no | Se prefiere animación ligera y controlada |

---

## 2. Por qué Astro

La mayor parte del sitio será HTML, imágenes, tipografía, texto, composición, navegación y pequeños efectos. No se necesita una aplicación con JavaScript ejecutándose permanentemente.

Astro genera HTML/CSS y solo envía JavaScript para los componentes que realmente lo necesitan, mediante su arquitectura de islas — ideal para **web editorial + animaciones selectivas + excelente rendimiento**.

```text
Hero               → HTML/CSS
Curso              → HTML/CSS
Archivo            → HTML/CSS
Recortes           → pequeño JS
Animación scroll   → pequeño JS
Pantu              → JS solo si necesita interacción
```

No hace falta convertir toda la página en una aplicación.

---

## 3. Tailwind 4

Astro tiene soporte para Tailwind 4 mediante el plugin oficial de Vite, camino recomendado para Astro moderno.

**No** se convertirá todo en clases Tailwind gigantescas. Se evitará este patrón repetido en cada componente:

```html
<div class="relative flex min-h-screen items-center justify-center overflow-hidden bg-white px-4 py-20 md:px-8 lg:px-16 ...">
```

Tailwind se usa para: layout, spacing, responsive, typography utilities, flex/grid, sizing, responsive behavior.

CSS propio se usa para identidad visual específica:

```css
.collage-piece {}
.collage-piece--freud {}
.paper-cutout {}
.editorial-hook {}
```

Esto es especialmente importante porque el collage no es UI convencional.

---

## 4. TypeScript en modo strict

Astro tiene TypeScript integrado y recomienda `strict` o `strictest`.

```json
{
  "extends": "astro/tsconfigs/strict"
}
```

Dominio definido desde el principio:

```ts
type CourseStatus = "upcoming" | "past";

interface Course {
  id: string;
  slug: string;
  title: string;
  hook: string;
  description: string;
  date: string;
  year: number;
  modality: string;
  image: string;
  status: CourseStatus;
  whatsappMessage?: string;
}
```

---

## 5. Modelado del "próximo curso"

**Decisión arquitectónica importante:** no modelar "próximo curso" como una propiedad global separada.

Se descarta este modelo:

```ts
{
  upcomingCourse: {...},
  pastCourses: [...]
}
```

porque cuando exista CMS/DB puede generar inconsistencias.

Se prefiere:

```ts
Course {
  id
  title
  ...
  status
  publishedAt
  startsAt
}
```

Y la aplicación decide, derivando `upcoming` / `past` a partir del estado y las fechas — o eventualmente:

```ts
status: "draft" | "published" | "archived"
isFeatured: boolean
```

**Regla de negocio:** solo puede existir un curso marcado como upcoming. Esta regla debe ser una **restricción de backend**, no solo una decisión visual.

---

## 6. Arquitectura evolutiva (3 etapas)

### Etapa 1 — Ahora

```text
Astro
  └── Content / Data local
        └── Web
```

Sin DB. Permite desarrollar rápido.

### Etapa 2 — CMS / DB

```text
Astro
  └── Repository
        └── Supabase
              └── Web
```

La UI no debe enterarse de dónde vienen los cursos.

### Etapa 3 — Administración

```text
Admin Panel
     │
     ▼
  Supabase (Auth / DB / Storage)
     │
     ▼
   Astro
     │
     ▼
 Web pública
```

---

## 7. ¿Supabase?

**Sí**, pero no necesariamente desde el día uno — es la primera opción para la arquitectura futura.

Supabase ofrece PostgreSQL, Auth, Storage, APIs, Row Level Security, Realtime y Edge Functions sobre la misma plataforma.

PostgreSQL es mucho más apropiado que un JSON remoto o una base NoSQL para este dominio, dado que probablemente se termine necesitando:

```text
courses
course_categories
admins
media
settings
```

y quizá más adelante:

```text
teachers
events
registrations
resources
```

---

## 8. Por qué NO meter Supabase todavía

No se quiere, desde el día uno:

```text
Astro + Supabase + Auth + SSR + Admin + RLS + Storage
```

Para una web que hoy tiene solo "1 curso próximo + archivo de cursos", eso sería sobrearquitectura.

**Primero:** Astro + Tailwind + TypeScript + Lucide + contenido local.
**Pero:** el dominio se diseña como si mañana pudiera llegar Supabase.

---

## 9. Content Collections de Astro (V1)

```text
src/content/courses/
    curso-a.md
    curso-b.md
    curso-c.md
```

con schema y tipado.

Astro permite colecciones con validación y tipos generados; el Content Layer actual también permite cargar datos desde fuentes remotas.

**Pros:** excelente para contenido editorial, tipado, validación, limpio, versionable con Git, fácil de mantener, ideal para la primera versión.

**Contras:** el administrador necesitaría Git → editar archivo → commit → deploy. No sirve como CMS para un cliente no técnico.

**Conclusión:** excelente para V1, no como solución definitiva de administración.

---

## 10. Alternativa descartada: CMS Headless

```text
Astro → Headless CMS → Cursos
```

Opciones: Sanity, Storyblok, Directus, Strapi, etc.

**Pros:** el cliente edita sin tocar código (panel → editar curso → guardar).

**Contras:** otra plataforma, otra cuenta, costos potenciales, dependencia externa, mayor complejidad, probablemente excesivo para este proyecto, y hay que adaptar el modelo del CMS.

**Decisión: no se elige por ahora.**

---

## 11. Comparación Supabase vs CMS Headless

| Criterio | Supabase | Headless CMS |
|---|---:|---:|
| DB | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| Auth | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| Storage | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Admin UI | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| Flexibilidad | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Costo inicial | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| Control técnico | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| Escalabilidad | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Ideal para este proyecto | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

Diferencia fundamental: Supabase da **infraestructura**; un CMS da **infraestructura + experiencia de edición**.

Si se construye el Admin Panel propio sobre `Supabase + Astro + Admin UI`, se termina teniendo un CMS a medida para IEP — potencialmente mucho mejor para este caso.

---

## 12. Recomendación consolidada

### Frontend
```text
Astro
TypeScript
Tailwind CSS 4
Lucide
CSS Modules / CSS específico donde sea necesario
```

### Backend futuro
```text
Supabase
PostgreSQL
Supabase Auth
Supabase Storage
```

### Backend Astro (cuando aparezca auth, CRUD, admin, formularios)
```text
Astro Actions
```

Las Astro Actions permiten definir funciones backend tipadas, validar entradas con Zod y llamarlas desde cliente o formularios, reduciendo boilerplate frente a endpoints tradicionales.

---

## 13. ¿SSR o Static?

### V1: Static / prerendered
No se necesita SSR.

```text
Build → HTML estático → CDN
```

Rápido por diseño.

### Futuro Admin: Astro SSR
```text
Astro SSR + Supabase + Auth
```

Astro soporta SSR con adapters (p. ej. Node), y Supabase tiene una guía oficial para Astro + SSR + Auth. No se paga esa complejidad desde el comienzo.

---

## 14. Estructura de repositorio propuesta

```text
iep-web/
│
├── public/
│   ├── fonts/
│   ├── images/
│   │   ├── brand/
│   │   ├── courses/
│   │   ├── collage/
│   │   └── pantu/
│   └── favicon.svg
│
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.astro
│   │   │   └── Footer.astro
│   │   ├── sections/
│   │   │   ├── Hero.astro
│   │   │   ├── UpcomingCourse.astro
│   │   │   ├── About.astro
│   │   │   ├── CourseArchive.astro
│   │   │   └── PantuCTA.astro
│   │   ├── course/
│   │   │   ├── CoursePoster.astro
│   │   │   ├── CourseItem.astro
│   │   │   └── CourseMeta.astro
│   │   ├── collage/
│   │   │   ├── CollageLayer.astro
│   │   │   ├── CollagePiece.astro
│   │   │   └── collage.ts
│   │   └── ui/
│   │       ├── Button.astro
│   │       ├── Icon.astro
│   │       └── SectionTitle.astro
│   │
│   ├── content/
│   │   ├── courses/
│   │   └── config.ts
│   │
│   ├── data/
│   │   ├── site.ts
│   │   └── navigation.ts
│   │
│   ├── layouts/
│   │   └── Layout.astro
│   │
│   ├── lib/
│   │   ├── courses/
│   │   │   ├── repository.ts
│   │   │   └── local.repository.ts
│   │   ├── whatsapp/
│   │   │   └── messages.ts
│   │   └── utils/
│   │
│   ├── pages/
│   │   └── index.astro
│   │
│   ├── scripts/
│   │   └── animations/
│   │       ├── collage.ts
│   │       └── reveal.ts
│   │
│   ├── styles/
│   │   ├── global.css
│   │   ├── tokens.css
│   │   └── collage.css
│   │
│   └── types/
│       ├── course.ts
│       └── site.ts
│
├── astro.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## 15. Repository Pattern (pieza clave)

```text
src/lib/courses/
    repository.ts
    local.repository.ts
```

Se introduce esta abstracción **antes de necesitarla**:

```ts
export interface CourseRepository {
  getUpcoming(): Promise<Course | null>;
  getPast(): Promise<Course[]>;
  getBySlug(slug: string): Promise<Course | null>;
}

export class LocalCourseRepository implements CourseRepository {
  // ...
}

// Más adelante:
export class SupabaseCourseRepository implements CourseRepository {
  // ...
}
```

La UI no cambia.

---

## 16. Evolución sin romper la UI

**Hoy:**
```text
UpcomingCourse → CourseRepository → LocalCourseRepository → Astro Content
```

**Mañana:**
```text
UpcomingCourse → CourseRepository → SupabaseCourseRepository → PostgreSQL
```

**Después:**
```text
Admin Panel → Astro Actions → Supabase → PostgreSQL
```

La interfaz pública permanece prácticamente intacta en cada etapa.

---

## 17. Futuro Admin Panel

No se crea un proyecto aparte. Se integra dentro del mismo Astro:

```text
src/pages/
├── index.astro
└── admin/
    ├── index.astro
    ├── courses/
    │   ├── index.astro
    │   ├── new.astro
    │   └── [id]/
    │       └── edit.astro
    └── login.astro
```

`iep.com/` público — `iep.com/admin` privado.

---

## 18. Alcance mínimo del Admin

Dashboard:

```text
IEP ADMIN

┌───────────────────────────────┐
│ Próximo curso                 │
│                               │
│ Introducción al ...           │
│ 16 septiembre                 │
│                               │
│ [ Editar ]                    │
└───────────────────────────────┘

Cursos anteriores

┌───────────────────────────────┐
│ Curso A              2026     │
│ Curso B              2026     │
│ Curso C              2025     │
│                               │
│ [ + Nuevo curso ]             │
└───────────────────────────────┘
```

Campos por curso: Título, Hook, Descripción, Fecha, Modalidad, Imagen, WhatsApp message, Estado.

---

## 19. Regla de negocio protegida en backend

Acción "Convertir en próximo curso":

```text
Curso A
[ Marcar como próximo ]
```

El backend verifica:

```text
¿Ya existe otro upcoming?
       ├── Sí → desactivarlo
       └── No → activar este
```

Así el administrador no puede romper la regla de negocio (mejor que un simple flag `isUpcoming: true` sin control).

---

## 20. Modelo de datos futuro (tabla `courses`)

```text
id
slug
title
hook
description
date
year
modality
image_url
status
is_featured
whatsapp_message
created_at
updated_at
```

Se agregarían desde el comienzo, si tiene sentido para la semántica del negocio:

```text
published_at
archived_at
```

En lugar de `status = "upcoming" | "past"` sin pensar la semántica, se prefiere algo más robusto:

```text
status: draft | published | archived
starts_at  → determina temporalmente qué curso es "próximo"
```

(Depende de cómo IEP quiera operar el flujo editorial.)

---

## 21. ¿React?

**No.** No se agrega "por si algún día hacemos dashboard".

Astro puede convivir con componentes de UI cuando sean necesarios e hidratar solo las islas interactivas que lo requieran. El sitio público no necesita React. Para el Admin se decide más adelante si alguna parte realmente lo necesita — incluso podría hacerse todo con Astro.

---

## 22. ¿Librería de animación?

Se empieza **sin Framer Motion**, usando:

- `IntersectionObserver`
- CSS transitions
- CSS keyframes
- `requestAnimationFrame` solo cuando realmente haga falta

Para los recortes:

```text
IntersectionObserver → .is-visible → CSS animation
```

Suficiente para gran parte de la experiencia, manteniendo el bundle pequeño.

### GSAP (opción abierta, no V1)

**Pros:** excelente control, scroll animations, timelines, parallax, muy potente.
**Contras:** dependencia adicional, más complejidad, probablemente excesivo para la V1.

**Regla:** V1 con CSS + IntersectionObserver; GSAP solo si el diseño pide animaciones más sofisticadas — no al revés.

---

## 23. ¿Lucide?

Sí, con una regla: **Lucide para iconos funcionales, no para identidad.**

Ejemplos válidos: `ArrowRight`, `Menu`, `X`, `Instagram`, `ExternalLink`, `MessageCircle`.

No se usa Lucide para reemplazar recursos gráficos propios de IEP.

---

## 24. Stack final recomendado

```text
Core:               Astro · TypeScript · Tailwind CSS 4 · Lucide
Styling:            Tailwind + CSS propio
Animation:          CSS + IntersectionObserver
Future backend:     Supabase · PostgreSQL · Supabase Auth · Supabase Storage
Future server:      Astro SSR · Astro Actions
Validation:         Zod
```

Astro Actions integra validación mediante esquemas Zod en su flujo.

---

## 25. Qué NO se instala de entrada

```text
React
Redux
Zustand
Framer Motion
GSAP
Axios
TanStack Query
shadcn/ui
Radix
CMS
ORM
```

No porque sean malas herramientas, sino porque no hay todavía un problema que necesite ninguna de ellas. Se evita especialmente convertir esta web en otro proyecto con 30 dependencias.

---

## 26. Arquitectura conceptual definitiva

```text
                    IEP WEB
                       │
             ┌─────────┴─────────┐
             │                   │
         PRESENTATION          DOMAIN
             │                   │
       Astro Components      Course
       Tailwind              CourseRepository
       CSS                   WhatsApp
       Lucide
       Animations
             │                   │
             └─────────┬─────────┘
                       │
                    DATA
                       │
              ┌────────┴────────┐
              │                 │
           LOCAL             SUPABASE
          (V1)              (Future)
              │                 │
          Content Layer      PostgreSQL
                              Auth
                              Storage
```

---

## 27. Decisión final

### Ahora
- Astro 6 + TypeScript strict + Tailwind 4 + Lucide
- Static / prerendered
- Content Layer para contenido local
- Repository pattern para desacoplar la fuente de datos
- CSS + IntersectionObserver para animaciones

### Preparado para el futuro
- Supabase + PostgreSQL
- Supabase Auth
- Supabase Storage
- Astro SSR
- Astro Actions + Zod
- `/admin`

---

## Cierre

Esta solución no sacrifica la filosofía de la web por la escalabilidad. La web pública se mantiene como una experiencia editorial extremadamente liviana, mientras que el dominio queda preparado para evolucionar:

```text
curso.json / Content Layer  →  PostgreSQL
```

y de:

```text
editar código  →  IEP Admin → Editar curso → Publicar → Próximo curso cambia → Web actualizada
```

sin necesidad de tirar abajo la arquitectura inicial.