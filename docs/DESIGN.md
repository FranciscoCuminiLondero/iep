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
  --bitter-chocolate: #783131;
  --carbon-black: #181818;
}
```

> Corrección de valor: el bordó se fijó en `#783131` (antes se venía usando `#783030` como aproximación). Actualizar el token en `tokens.css` y en cualquier CSS que lo haya hardcodeado.

### 1.2 Rol semántico de cada token

| Token | Rol en el brief | Uso |
|---|---|---|
| `--white` | Blanco base | Fondo principal de la web, superficies limpias, espacio negativo |
| `--white-2` | Blanco cálido | Fondos alternativos sutiles (secciones, cards editoriales) donde `--white` puro resulte demasiado frío o produzca demasiado contraste con imágenes |
| `--white-3` | Blanco neutro | Superficies internas, fondos de piezas de collage, tarjetas sobre `--white-2` |
| `--bitter-chocolate` | **Bordó** — color de acento del brief | Hooks, etiquetas, subrayados, CTAs, detalles de identidad. Nunca como relleno constante |
| `--carbon-black` | Negro | Títulos, texto de cuerpo, estructura, contraste, líneas |

> Nota: el brief habla de "bordó"; `--bitter-chocolate` (#783030) es ese bordó. Se usa ese nombre de token en el código para que el sistema no quede atado a una palabra de paleta que después puede cambiar de matiz.

### 1.3 Regla de uso — proporción (revisada)

> **Actualización de decisión:** la regla original de este documento (bordó solo como acento, ~5%, nunca como fondo de sección) queda **reemplazada** por una decisión posterior del equipo: la página alterna secciones completas de fondo bordó y fondo blanco a lo largo de todo el sitio, empezando por el Hero en bordó. Se documenta acá el estado vigente; la versión anterior queda como referencia histórica de por qué existe la regla del punto 1 del `BACKLOG.md` (el collage de autores en blanco y negro sigue sin llevar bordó — esa regla no cambia, es independiente de esto).

```text
Patrón de alternancia de secciones (de arriba hacia abajo):
  Hero                    → fondo --bitter-chocolate
  Próximo curso           → fondo --white
  Nuestros cursos         → fondo --bitter-chocolate (o el que siga en la alternancia)
  ¿Buscás un tema...?     → alterna según posición
  Sobre nosotros          → alterna según posición
```

Reglas para las secciones con fondo bordó:

- **Texto sobre fondo bordó siempre en `--white`** — nunca `--carbon-black` sobre bordó (falla de contraste, además de no estar en el sistema).
- El collage de autores/retratos en blanco y negro (`BACKLOG.md` punto 1) se mantiene sin bordó **incluso dentro de una sección de fondo bordó** — si una sección con retratos queda en un turno bordó de la alternancia, resolver con una subsección de fondo blanco/negro que interrumpa el bordó puntualmente, no aplicar el retrato directamente sobre bordó.
- Los acentos puntuales (hooks, etiquetas, CTA) descriptos abajo siguen aplicando **dentro de las secciones de fondo blanco** — ahí el bordó sigue funcionando como acento, no como relleno.

Dentro de una sección de fondo **blanco**, se mantiene la proporción original:

```text
~70%  --white / --white-2 / --white-3   → fondos, aire, espacio negativo
~25%  --carbon-black                    → texto, estructura, contraste
~5%   --bitter-chocolate                → acento: hooks, CTA, detalles
```

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
- `--bitter-chocolate` (#783131) sobre blanco: contraste suficiente para texto de tamaño mediano/grande (hooks, etiquetas); para texto pequeño de cuerpo, preferir `--carbon-black` y usar el bordó solo como acento gráfico o en tamaños ≥16px con peso medio/alto.
- `--white` sobre `--bitter-chocolate`: combinación válida y ahora de uso frecuente (secciones de fondo bordó completo) — verificar siempre que el peso tipográfico sea ≥700 para mantener legibilidad sobre el fondo de color.
- No usar `--bitter-chocolate` sobre `--carbon-black` ni viceversa como combinación texto/fondo — no está en el sistema y no se testeó.

---

## 2. Tipografía

> **Actualización (BACKLOG.md §19–23):** la tipografía oficial de IEP reemplaza a Montserrat + Lato, que se habían relevado del feed. Montserrat y Lato quedan instaladas solo como fuente de respaldo mientras falten los archivos de Decalotype y la decisión sobre Helvetica.

### 2.1 Familias oficiales

| Rol | Tipografía | Respaldo actual |
|---|---|---|
| Títulos | **Decalotype Black** | Montserrat (todavía no están los archivos de Decalotype) |
| Texto tipo publicaciones informativas ("sexología") | **Helvetica Bold** | La del dispositivo: Helvetica en Apple, Arial en Windows/Android |
| Texto chico (casi no se usa) | **Source Serif Pro** (en Google Fonts: "Source Serif 4") | — |

### 2.2 Rol de cada familia

**Decalotype Black** — títulos
- Logo/wordmark y títulos de sección (Hero, "Sobre nosotros", "Nuestros cursos").
- Citas de autores dentro del collage.

**Helvetica Bold** — texto tipo publicaciones
- Hooks y datos del curso (fecha, modalidad, nombre).
- Cuerpo de texto general (descripciones, bajadas).
- Elementos de UI: botones, etiquetas, metadata.

**Source Serif 4** — texto chico
- Uso puntual: notas, aclaraciones, letra chica. Casi no aparece.

> Regla de coherencia: si es un título o algo identitario → `--font-title`. Si es texto que se lee (cuerpo, hooks, UI) → `--font-body`. Solo letra chica → `--font-small`.

### 2.3 Tokens de familia

```css
/* :root — stacks con respaldo */
--font-decalotype: "Decalotype", "Montserrat", sans-serif;
--font-helvetica: "Helvetica Neue", Helvetica, Arial, sans-serif;
--font-source-serif: "Source Serif 4", serif;

/* @theme — roles (generan las utilities font-title, font-body, font-small) */
--font-title: var(--font-decalotype);
--font-body: var(--font-helvetica);
--font-small: var(--font-source-serif);
```

Reemplazan a `--font-identity` y `--font-editorial`. `--font-montserrat` y `--font-lato` siguen definidas como respaldo, pero no se usan directamente en componentes.

### 2.4 Roles tipográficos y escala (mobile-first)

| Rol | Token | Peso | Tamaño | Uso |
|---|---|---|---|---|
| **Logo** | `--font-title` | Black (900) | fijo según lockup | Wordmark "iep" |
| **Heading / Título de sección** | `--font-title` | Black (900) | `clamp(1.5rem, 4.5vw, 2.5rem)` | "Próximo curso", "Nuestros cursos", "Sobre nosotros" |
| **Heading secundario** | `--font-title` | Black (900) | `clamp(1.25rem, 3.5vw, 1.75rem)` | Subtítulos |
| **Hook de curso** | `--font-body` | Bold (700) | `clamp(1.75rem, 6vw, 3.25rem)` / line-height 1.05 | Hook del próximo curso, titulares tipo flyer |
| **Cita de autor** | `--font-title` | Black (900) | `1.125rem`–`1.25rem` | Frases de pensadores en el collage |
| **Body** | `--font-body` | Bold (700) | `1rem` / line-height 1.6 | Descripciones, bajadas |
| **Body destacado** | `--font-body` | Bold (700) | `1.125rem` / line-height 1.6 | Información esencial del curso (fecha, modalidad) |
| **UI / Label** | `--font-body` | Bold (700) | `0.8125rem` / letter-spacing +0.02em | Botones, etiquetas, metadata |
| **Texto chico** | `--font-small` | Regular (400) | `0.75rem`–`0.875rem` | Notas, letra chica |

> A confirmar (BACKLOG.md D): Helvetica Bold para párrafos largos puede ser muy pesada; si se permite Helvetica normal (400) para el cuerpo, se suma a los pesos límite de 2.7. Hasta que se decida, el código conserva los pesos que ya tenía cada texto.

### 2.5 Reglas de aplicación

- El **hook** del próximo curso va en `--font-body`, color `--carbon-black`, con un detalle en `--bitter-chocolate` (subrayado, palabra clave, etiqueta) — nunca el bloque completo en bordó.
- Las **citas de autores** del collage van en `--font-title`, nunca en `--font-body`.
- El **logo** se reserva a Decalotype Black — no se sustituye con Helvetica en ningún contexto.
- No mezclar familias dentro de una misma línea o bloque continuo; el cambio ocurre entre bloques (título en Decalotype, párrafo debajo en Helvetica), nunca a media frase.
- Ancho de línea de párrafo: 45–70 caracteres (`max-width` en `ch`).
- Interlineado generoso en cuerpo de texto (≥1.5).

### 2.6 Carga de fuentes

```text
Decalotype:      900 (Black) — @font-face preparado en global.css, comentado
                 hasta tener public/fonts/decalotype-black.woff2 (y licencia web)
Helvetica:       no se carga como fuente web — es paga; se usa la del dispositivo
                 hasta decidir si se compra la licencia (BACKLOG.md C)
Source Serif 4:  400 (Regular) — autohospedada con @fontsource/source-serif-4
Montserrat/Lato: siguen cargadas (700/800/900 y 400/700/900) como respaldo;
                 se quitan cuando Decalotype esté en producción
```

No se baja una fuente "parecida" de otro lado para reemplazar a Decalotype o Helvetica.

### 2.7 Pesos límite (hard limit)

Estos son los **únicos pesos permitidos** en el sistema oficial:

```text
Decalotype      900  Black    → único peso — títulos
Helvetica       700  Bold     → único peso — texto tipo publicaciones, UI
Source Serif 4  400  Regular  → único peso — texto chico
```

**Reglas duras:**

- **Un solo peso por familia.** No se cargan ni se usan variantes intermedias ni más livianas.
- Mientras se usen los respaldos, Montserrat y Lato conservan sus pesos cargados (700–900 y 400–900); no se agregan pesos nuevos a ninguna de las dos.
- **No usar pesos "false bold/italic"** generados por el navegador cuando el peso o el corte no están cargados.
- Cualquier necesidad de jerarquía extra se resuelve con tamaño, tracking o color — no sumando un peso.


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

### 6.1 Hero (actualizado)

```text
Fondo:        --bitter-chocolate
Texto:        --white
Logo:         formato redondo, dentro del hero
Título:       "Inconsciente en Pantuflas" — SIN el prefijo "IEP —"
              (excepción puntual solo para este bloque; el resto del
              sitio sigue usando "IEP — Inconsciente en Pantuflas" /
              "IEP" según VOICE.md sección 4)
Collage:      1–2 piezas de identidad — revisar contraste sobre bordó
```

Requisito de responsive no negociable: en ningún dispositivo ni nivel de zoom el texto del Hero puede quedar tapado (por el logo, por una pieza de collage, o por sí mismo). Reducir tamaños de forma progresiva por breakpoint en vez de fijar un tamaño que dependa de que el viewport sea suficientemente grande.

Debe establecer el lenguaje visual completo en el primer scroll: tipografía display, espacio negativo, al menos un recorte.

### 6.2 Próximo curso — pieza protagonista

Tratamiento tipo afiche/editorial, no card genérica (brief sección 16):

```text
Fondo:                --white
Hook:                 --carbon-black, tipografía display, con detalle en --bitter-chocolate
Información esencial: --carbon-black, --text-body
Etiquetas (fecha/modalidad): --text-label sobre fondo --white-3 o subrayado --bitter-chocolate
CTA:                  fondo --carbon-black o --bitter-chocolate, texto --white, label "Quiero anotarme" (ver VOICE.md 3.3)
Collage:              1–2 piezas relacionadas al tema del curso — YA NO incluye a Lacan, que se reubicó en "Quiénes somos" (ver 6.3)
```

### 6.3 Quiénes somos / Sobre nosotros

```text
Fondo:    --white-2 (o el turno de bordó que le toque en la alternancia)
Layout:   fotografía + pocas líneas de texto, mucho espacio negativo
Acento:   --bitter-chocolate en una palabra o frase corta, no en bloques
Figura:   Lacan (recorte, ver prompt de "figuras flotantes"), esquina
          inferior izquierda — reubicado desde "Próximo curso"
```

Contenido de esta pestaña de navegación (según la decisión más reciente): declaración de interés municipal, texto breve (2-3 párrafos) sobre por qué se armó la página, notas/menciones de prensa, y a futuro un placeholder de mercadería (ver `BACKLOG.md` punto 5).

### 6.4 Nuestros cursos (rediseñado, ex "Archivo de cursos")

Cambia de nombre y de comportamiento — ya no es un archivo/listado por año, es un grid de cards siempre completas:

```text
Posición:    inmediatamente después de "Próximo curso" — incluye también
             al curso actual como una card más, con tag "Próximo a dictar" + fecha
Fondo:       según el turno que le toque en la alternancia bordó/blanco
Card:        2 columnas — flyer del curso a la izquierda, título +
             instructor + descripción breve a la derecha
Tag por card: "Activo" / "Próximo - [fecha]" (o el estado que corresponda)
CTA por card: "Quiero anotarme" → WhatsApp (ver VOICE.md 3.4)
Visibilidad: TODAS las cards se muestran siempre completas — nada oculto
             por defecto (a diferencia del patrón +/- general del sitio)
```

**Comportamiento del botón +/- de esta sección (distinto al resto del sitio):** no oculta ni muestra cards — alterna, para **todas las cards a la vez**, entre descripción breve (estado "–") y descripción completa (estado "+"). Es un toggle compartido, no un acordeón por card — no alcanza con `<details>`/`<summary>` individuales; requiere una clase o atributo a nivel de sección que las cards lean vía CSS (ver `BACKLOG.md` punto 6 para el patrón general de +/- del resto de las secciones, que sí es expandir/colapsar contenido).

Sin buscador/filtros de cursos — eso ya no aplica a esta sección; el buscador es exclusivo de "¿Buscás un tema en específico?" (ver 6.6).

### 6.5 Pantu

```text
Aparición:  contextual, nunca como widget flotante permanente
Tono visual: más cálido/ilustrado que el resto de IEP — es el quiebre de solemnidad
Fondo:      --white-3 o --white-2 para diferenciarlo levemente del resto
CTA final:  siempre deriva a WhatsApp
```

### 6.6 ¿Buscás un tema en específico? (nueva)

```text
Fondo:      según el turno de la alternancia
Estética:   caras de Iña y Manu como elemento visual, estilo similar al
            canal de YouTube/Instagram — más cercano a Pantu que al
            registro académico puro
Resultado:  cada item con link directo al contenido (Instagram/YouTube
            según tipo) + botón WhatsApp con mensaje precargado
            (ver VOICE.md 3.5)
```

### 6.7 CTA / WhatsApp

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

- [ ] Dentro de una sección de fondo blanco, ¿el bordó aparece como acento y no como relleno? (máx. ~5% de esa sección — la regla de fondo-bordó-de-sección completa es válida solo en su propio turno de la alternancia, ver sección 1.3)
- [ ] ¿El collage de retratos en blanco y negro se mantiene sin bordó incluso si le tocó un turno de sección bordó?
- [ ] ¿Cada pieza de collage tiene una razón de estar ahí?
- [ ] ¿La sección se entiende igual de bien con `prefers-reduced-motion` activo?
- [ ] ¿El espacio negativo respira, o se sintió la tentación de "llenar"?
- [ ] ¿Se respetó el rol de cada familia? (Montserrat = identidad/institucional/citas, Lato = hooks/body/UI)
- [ ] ¿WhatsApp aparece como acción y no como color dominante?
- [ ] ¿Funciona igual de bien en mobile, sin ser "desktop achicado"?
- [ ] ¿Un usuario que llega desde Instagram reconoce el universo de IEP en el primer scroll?

---

## Estado

**Paleta de color:** definida — hex de bordó actualizado a `#783131`; regla de proporción revisada (alternancia de secciones completas bordó/blanco, ver 1.3)
**Tipografía:** implementada con Montserrat + Lato (relevadas del feed) — **riesgo abierto:** la "tipografía oficial de IEP" sigue pendiente de confirmación del cliente (`BACKLOG.md`); si difiere de lo relevado, hay que revisar tokens y font-loading
**Espaciado/grilla:** definidos
**Sistema de collage:** definido
**Animación:** principios y tokens definidos
**Componentes por sección:** especificados a nivel de guía visual
**Responsive:** criterios definidos
