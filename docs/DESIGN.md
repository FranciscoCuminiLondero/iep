# DESIGN.md — IEP · Inconsciente en Pantuflas

## Sistema de diseño visual

Este documento traduce el brief conceptual (`BRIEF.md`) en decisiones de diseño concretas: tokens de color, tipografía, espaciado, reglas de collage, animación y especificaciones por sección. Es la referencia que se usa al construir componentes en Astro + Tailwind.

**Concepto rector:** estructura moderna + lenguaje editorial + collage artesanal. Interfaz minimalista y rigurosa, intervenida por recortes que parecen encontrados y pegados a mano.

---

## 1. Color

### 1.1 Tokens de marca

```css
:root {
  --white: #ffffff;
  --white-2: #fefcfd;
  --white-3: #fdfdfd;
  --bitter-chocolate: #783030;
  --carbon-black: #181818;
}
```

### 1.2 Rol semántico de cada token

| Token | Rol en el brief | Uso |
|---|---|---|
| `--white` | Blanco base | Fondo principal de la web, superficies limpias, espacio negativo |
| `--white-2` | Blanco cálido | Fondos alternativos sutiles (secciones, cards editoriales) donde `--white` puro resulte demasiado frío o produzca demasiado contraste con imágenes |
| `--white-3` | Blanco neutro | Superficies internas, fondos de piezas de collage, tarjetas sobre `--white-2` |
| `--bitter-chocolate` | **Bordó** — color de acento del brief | Hooks, etiquetas, subrayados, CTAs, detalles de identidad. Nunca como relleno constante |
| `--carbon-black` | Negro | Títulos, texto de cuerpo, estructura, contraste, líneas |

> Nota: el brief habla de "bordó"; `--bitter-chocolate` (#783030) es ese bordó. Se usa ese nombre de token en el código para que el sistema no quede atado a una palabra de paleta que después puede cambiar de matiz.

### 1.3 Regla de uso — proporción

Siguiendo la sección 5 del brief ("el bordó no debe utilizarse como relleno constante, debe funcionar como color de énfasis"):

```text
~70%  --white / --white-2 / --white-3   → fondos, aire, espacio negativo
~25%  --carbon-black                    → texto, estructura, contraste
~5%   --bitter-chocolate                → acento: hooks, CTA, detalles
```

Ningún fondo grande de sección debería llevar `--bitter-chocolate` como color de fondo sólido. Se reserva para elementos pequeños con alta intención: un hook, una etiqueta, un subrayado, el estado activo de un CTA.

### 1.4 Escala de negro (para texto secundario)

El brief no define grises, pero para jerarquía tipográfica sin salir de la paleta se deriva una escala por opacidad sobre `--carbon-black`, en vez de introducir grises nuevos:

```css
--ink-100: var(--carbon-black);           /* texto principal */
--ink-70:  rgba(24, 24, 24, 0.70);        /* texto secundario */
--ink-45:  rgba(24, 24, 24, 0.45);        /* texto terciario / metadata */
--ink-15:  rgba(24, 24, 24, 0.15);        /* líneas, separadores sutiles */
```

Esto respeta la regla del brief de "evitar introducir colores adicionales sin una razón" (sección 5).

### 1.5 Excepciones a la paleta

Según el brief, se permite salir de esta paleta solo en:

- Fotografías reales (blanco y negro, tal como se ve en Instagram).
- Material gráfico original de IEP (afiches, piezas existentes).
- Elementos específicos de un curso puntual (p. ej. una imagen a color provista para ese curso).

Nunca para decoración de interfaz (botones, fondos, iconografía genérica).

### 1.6 Contraste y accesibilidad

- `--carbon-black` sobre `--white`/`--white-2`/`--white-3`: contraste alto, apto para texto de cuerpo.
- `--bitter-chocolate` (#783030) sobre blanco: contraste suficiente para texto de tamaño mediano/grande (hooks, etiquetas); para texto pequeño de cuerpo, preferir `--carbon-black` y usar el bordó solo como acento gráfico o en tamaños ≥16px con peso medio/alto.
- No usar `--bitter-chocolate` sobre `--carbon-black` ni viceversa como combinación texto/fondo — no está en el sistema y no se testeó.

---

## 2. Tipografía

El brief (sección 6) pide que la elección final surja de comparar el lenguaje visual del feed de Instagram con las posibilidades de interfaz. Ese relevamiento ya se hizo sobre el feed real de IEP y arrojó dos familias en uso, cada una con un rol claramente diferenciado — se adoptan ambas como sistema tipográfico oficial de la web.

### 2.1 Familias identificadas en el feed

| Elemento en Instagram | Tipografía | Detalle observado |
|---|---|---|
| Logo "iep" | **Montserrat** Bold/Black | Trazo geométrico y homogéneo; la "e" tiene terminal horizontal recto |
| Títulos tipo "Los esquemas..." | **Montserrat** ExtraBold/Black | Mayúsculas, mucho peso visual, formas redondeadas en curvas (p. ej. la "S") |
| Cuerpo tipo flyer, "Introducción a la..." | **Lato** Bold/Black | Aspecto humanista y redondeado, sin remates (sans serif) |

Esto confirma y cierra el principio del brief de máximo dos familias: **Montserrat** para todo lo identitario/institucional/académico, **Lato** para todo lo editorial de tipo flyer/anuncio de curso.

### 2.2 Rol de cada familia

**Montserrat** — geométrica, institucional, "académica"
- Logo y wordmark de IEP.
- Títulos de sección (Hero, "Quiénes somos", encabezados del Archivo).
- Citas de autores / pensadores dentro del collage — refuerza el costado cultural e intelectual.
- Pesos: Bold (700) para títulos de sección, ExtraBold/Black (800/900) para el logo y titulares de máximo peso.

**Lato** — humanista, redondeada, tipo flyer
- Hook y datos del próximo curso (fecha, modalidad, nombre) — es la voz "editorial de anuncio" que ya usa IEP en sus posts de cursos.
- Cuerpo de texto general (descripciones, bajadas).
- Elementos de UI: botones, etiquetas, metadata.
- Pesos: Bold/Black para hooks y títulos de curso, Regular/Bold para cuerpo y UI.

> Regla de coherencia con el feed: si un texto en Instagram se vería como "post de curso/flyer" → Lato. Si se vería como "logo, titular institucional o cita de autor" → Montserrat.

### 2.3 Tokens de familia

```css
--font-montserrat: "Montserrat", sans-serif;
--font-lato: "Lato", sans-serif;

--font-identity: var(--font-montserrat);  /* logo, headings, citas */
--font-editorial: var(--font-lato);       /* hooks de curso, body, UI */
```

### 2.4 Roles tipográficos y escala (mobile-first)

| Rol | Familia | Peso | Tamaño | Uso |
|---|---|---|---|---|
| **Logo** | Montserrat | Black (900) / Bold (700) | fijo según lockup | Wordmark "iep" |
| **Heading / Título de sección** | Montserrat | ExtraBold/Black (800–900) | `clamp(1.5rem, 4.5vw, 2.5rem)` | "Próximo curso", "Archivo", "Quiénes somos" |
| **Heading secundario** | Montserrat | Bold (700) | `clamp(1.25rem, 3.5vw, 1.75rem)` | Subtítulos, año en el Archivo |
| **Hook de curso** | Lato | Black (900) | `clamp(1.75rem, 6vw, 3.25rem)` / line-height 1.05 | Hook del próximo curso, titulares tipo flyer |
| **Cita de autor** | Montserrat | Medium/Bold, itálica opcional | `1.125rem`–`1.25rem` | Frases de pensadores en el collage |
| **Body** | Lato | Regular (400) | `1rem` / line-height 1.6 | Descripciones, bajadas |
| **Body destacado** | Lato | Bold (700) | `1.125rem` / line-height 1.6 | Información esencial del curso (fecha, modalidad) |
| **UI / Label** | Lato | Bold (700) | `0.8125rem` / letter-spacing +0.02em | Botones, etiquetas, metadata |

### 2.5 Reglas de aplicación

- El **hook** del próximo curso siempre en Lato Black, color `--carbon-black`, con un detalle en `--bitter-chocolate` (subrayado, palabra clave, etiqueta) — nunca el bloque completo en bordó.
- Las **citas de autores/pensadores** del collage van siempre en Montserrat, nunca en Lato — es lo que las distingue visualmente del contenido "flyer" y refuerza el tono académico.
- El **logo** se reserva exclusivamente a Montserrat Bold/Black — no se sustituye ni se aproxima con Lato en ningún contexto.
- No mezclar Montserrat y Lato dentro de una misma línea de texto o bloque continuo; el cambio de familia ocurre entre bloques (p. ej. heading en Montserrat, párrafo debajo en Lato), nunca a media frase.
- Máximo 2 pesos por familia visibles simultáneamente en una misma sección.
- Ancho de línea de párrafo (Lato body): 45–70 caracteres (`max-width` en `ch`).
- Interlineado generoso en cuerpo de texto (≥1.5) para mantener la sensación editorial y de aire.

### 2.6 Carga de fuentes

Ambas son Google Fonts — se autohospedan (self-host) para performance y para no depender de Google Fonts en runtime, cargando solo los pesos realmente usados:

```text
Montserrat: 700 (Bold), 800 (ExtraBold), 900 (Black)
Lato:       400 (Regular), 700 (Bold), 900 (Black)
```

Evitar cargar el rango completo de pesos de cada familia — impacta performance sin beneficio visual, ya que el sistema usa un set acotado de pesos por rol.

---

## 3. Espaciado y grilla

### 3.1 Principio (brief sección 7)

> El collage rompe la rigidez, pero la grilla mantiene el orden.

La grilla es invisible pero innegociable. Los recortes pueden salirse de ella visualmente; el contenido funcional nunca.

### 3.2 Escala de espaciado

```text
--space-1: 0.25rem   4px
--space-2: 0.5rem    8px
--space-3: 0.75rem   12px
--space-4: 1rem      16px
--space-5: 1.5rem    24px
--space-6: 2rem      32px
--space-7: 3rem      48px
--space-8: 4rem      64px
--space-9: 6rem      96px
--space-10: 8rem     128px
```

### 3.3 Márgenes y contenedor

```text
Mobile:   padding lateral 20–24px (--space-5/--space-6)
Tablet:   padding lateral 40px
Desktop:  padding lateral 64–96px, max-width de contenido ~1200px
```

### 3.4 Ritmo vertical entre secciones

Secciones separadas por espacio generoso (`--space-9` / `--space-10` en desktop, `--space-7`/`--space-8` en mobile) — el espacio negativo es, según el brief, "un recurso visual" (principio 8), no un vacío a rellenar.

---

## 4. Sistema de collage

### 4.1 Regla fundamental (brief sección 9)

> Nada está ahí solamente para decorar. Cada recorte debe tener una razón.

Antes de agregar cualquier pieza de collage, debe poder justificarse por al menos uno de estos motivos: identidad, contexto, narrativa, ritmo, relación con el contenido, profundidad visual. Si no, se elimina.

### 4.2 Anatomía de una pieza de collage

```css
.collage-piece {
  --rotation: -3deg;      /* rango sugerido: -6deg a 6deg, nunca más */
  --offset-x: 0px;
  --offset-y: 0px;

  transform: rotate(var(--rotation)) translate(var(--offset-x), var(--offset-y));
  box-shadow: 0 2px 6px rgba(24, 24, 24, 0.08); /* sombra sutil, nunca dramática */
}
```

Modificadores por tipo de contenido:

```css
.collage-piece--photo { }     /* fotografía en blanco y negro */
.collage-piece--quote { }     /* frase / fragmento de texto */
.collage-piece--label { }     /* etiqueta, sello, anotación */
.paper-cutout { }             /* borde irregular / textura de papel */
.editorial-hook { }           /* tratamiento especial para hooks destacados */
```

### 4.3 Parámetros con moderación (brief sección 10)

| Recurso | Rango recomendado | Nota |
|---|---|---|
| Rotación | -6° a 6° | Nunca simétrico en piezas contiguas — evitar que parezca patrón |
| Desplazamiento | 0–12px respecto a la grilla | Sutil, perceptible pero no caótico |
| Sombra | `0 2px 6px rgba(24,24,24,0.06–0.10)` | Nunca sombras duras o de gran radio |
| Textura de papel | Opcional, muy sutil (grano/ruido bajo) | No debe ensuciar la legibilidad |
| Cinta adhesiva / etiquetas | Puntual, 1–2 por composición como máximo | Elemento de acento, no de relleno |

### 4.4 Densidad de collage por sección

```text
Hero               → 1–2 piezas (identidad)
Próximo curso      → 1–2 piezas relacionadas al tema del curso
Quiénes somos       → 1–3 piezas (fotografía + frase)
Archivo             → intervención leve, prioriza legibilidad del listado
Pantu               → el propio personaje funciona como pieza
```

Regla general: **menos piezas, mejor elegidas** (principio 1 y 9 del brief). Ante la duda entre agregar un recorte más o dejar el espacio en blanco, se elige el espacio en blanco.

### 4.5 Collage y mobile

En mobile se reduce la cantidad de piezas respecto a desktop (brief sección 30) y se evita cualquier solapamiento que tape texto o CTAs. Ninguna pieza de collage puede reducir el área táctil de un botón o link.

---

## 5. Animación y movimiento

### 5.1 Principio rector (brief sección 14)

> Si el usuario percibe primero la animación y después el contenido, la animación es demasiado fuerte.

### 5.2 Tokens de movimiento

```css
--ease-editorial: cubic-bezier(0.22, 1, 0.36, 1); /* entrada suave, sin rebote */
--duration-fast: 200ms;
--duration-base: 400ms;
--duration-slow: 600ms;
```

### 5.3 Patrones permitidos

**Entrada de contenido al hacer scroll:**
```css
opacity: 0 → 1;
transform: translateY(12px) → translateY(0);
transition: var(--duration-base) var(--ease-editorial);
```

**Entrada de piezas de collage:**
```css
opacity + translate + rotate leve;
/* la rotación final coincide con --rotation de la pieza, nunca se anima el ángulo por separado de forma exagerada */
```

**Parallax:** solo desplazamientos muy leves (pocos px por 100px de scroll) para dar profundidad — nunca como efecto protagónico.

### 5.4 Lo que no se hace

- Animaciones que se repiten en loop sin interacción del usuario.
- Efectos que produzcan layout shift.
- Parallax pronunciado o 3D.
- Animar más de 2–3 propiedades distintas (`transform`/`opacity` son casi siempre suficientes).
- Bloquear la visibilidad del contenido a la espera de una animación.

### 5.5 Accesibilidad

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Con `prefers-reduced-motion` activo, todo el contenido debe estar visible y utilizable sin depender de que una animación lo revele.

---

## 6. Componentes por sección

### 6.1 Hero

```text
Fondo:        --white
Texto:        --carbon-black
Acento:       --bitter-chocolate (en CTA o detalle puntual)
Collage:      1–2 piezas de identidad
```
Debe establecer el lenguaje visual completo en el primer scroll: tipografía display, espacio negativo, al menos un recorte.

### 6.2 Próximo curso — pieza protagonista

Tratamiento tipo afiche/editorial, no card genérica (brief sección 16):

```text
Fondo:                --white
Hook:                 --carbon-black, tipografía display, con detalle en --bitter-chocolate
Información esencial: --carbon-black, --text-body
Etiquetas (fecha/modalidad): --text-label sobre fondo --white-3 o subrayado --bitter-chocolate
CTA:                  fondo --carbon-black o --bitter-chocolate, texto --white
Collage:              1–2 piezas relacionadas al tema del curso
```

### 6.3 Quiénes somos

```text
Fondo:    --white-2
Layout:   fotografía + pocas líneas de texto, mucho espacio negativo
Acento:   --bitter-chocolate en una palabra o frase corta, no en bloques
```

### 6.4 Archivo de cursos

```text
Fondo:      --white
Agrupación: por año, tipografía --text-h2 para el año, --text-body para cada curso
Líneas:     separadores sutiles con --ink-15
Densidad de collage: baja — prioridad total a la legibilidad y velocidad de escaneo
```
Sin buscador/filtros hasta que el volumen de cursos lo justifique (brief sección 18).

### 6.5 Pantu

```text
Aparición:  contextual, nunca como widget flotante permanente
Tono visual: más cálido/ilustrado que el resto de IEP — es el quiebre de solemnidad
Fondo:      --white-3 o --white-2 para diferenciarlo levemente del resto
CTA final:  siempre deriva a WhatsApp
```

### 6.6 CTA / WhatsApp

```text
Botón:      fondo --carbon-black o --bitter-chocolate, texto --white
Ícono:      Lucide MessageCircle, sin verde de WhatsApp como color dominante (brief sección 23)
Mensaje:    prearmado, referenciando el curso puntual cuando aplica
```

---

## 7. Iconografía

Según el brief (sección 24): Lucide para iconos funcionales, no para identidad.

```text
Permitidos:   ArrowRight, Menu, X, Instagram, ExternalLink, MessageCircle
Color:        --carbon-black por defecto; --bitter-chocolate solo si el ícono es el acento de una acción
Tamaño base:  20–24px en UI, ajustable según contexto
```

No reemplazar recursos gráficos propios de IEP (afiches, ilustraciones, piezas de collage) por íconos de librería.

---

## 8. Responsive

Principio del brief (sección 30): **mobile no es una adaptación secundaria** — Instagram es una fuente de tráfico primaria.

```text
Breakpoints sugeridos:
  sm:  480px
  md:  768px
  lg:  1024px
  xl:  1280px
```

Ajustes por breakpoint:

| Aspecto | Mobile | Desktop |
|---|---|---|
| Piezas de collage | Reducidas, sin solapar texto/CTA | Composición completa |
| Movimiento | Reducido en cantidad, igual de sutil | Completo |
| Tipografía | Escala con `clamp()` (ver 2.3) | Escala con `clamp()` |
| Espaciado | `--space-5`–`--space-8` | `--space-8`–`--space-10` |

---

## 9. Checklist de coherencia visual

Antes de dar por cerrada cualquier sección o componente, validar contra el brief:

- [ ] ¿El bordó aparece como acento y no como relleno? (máx. ~5% de la superficie visual)
- [ ] ¿Cada pieza de collage tiene una razón de estar ahí?
- [ ] ¿La sección se entiende igual de bien con `prefers-reduced-motion` activo?
- [ ] ¿El espacio negativo respira, o se sintió la tentación de "llenar"?
- [ ] ¿Se respetó el rol de cada familia? (Montserrat = identidad/institucional/citas, Lato = hooks/body/UI)
- [ ] ¿WhatsApp aparece como acción y no como color dominante?
- [ ] ¿Funciona igual de bien en mobile, sin ser "desktop achicado"?
- [ ] ¿Un usuario que llega desde Instagram reconoce el universo de IEP en el primer scroll?

---

## Estado

**Paleta de color:** definida (tokens de marca)
**Tipografía:** definida — Montserrat (identidad/institucional/citas) + Lato (hooks/body/UI), relevadas del feed real de Instagram
**Espaciado/grilla:** definidos
**Sistema de collage:** definido
**Animación:** principios y tokens definidos
**Componentes por sección:** especificados a nivel de guía visual
**Responsive:** criterios definidos