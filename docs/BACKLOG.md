# BACKLOG.md — IEP · Lista final de cambios (ronda 2)

Actualizado: 27 oct 2026. Reemplaza la versión anterior. Todo lo de esta lista está confirmado para hacer, salvo lo marcado como "a confirmar". Todavía no se implementó nada de esto.

---

## A. Cambios para hacer

### Diseño general
1. Alternar secciones bordó / blanco en toda la página, empezando por el Hero en bordó.
2. Color bordó: `#783131`.
3. Regla que se mantiene: los retratos de autores en blanco y negro nunca llevan bordó encima, aunque les toque una sección bordó.
4. Botón "+/–" por sección: círculo bordó con signo blanco. Cada sección arranca resumida, "+" despliega todo dentro de la misma sección, "–" la vuelve a resumir. Objetivo: que la página no sea un scroll infinito.

### Hero
5. Logo de IEP en formato redondo.
6. Título solo "Inconsciente en Pantuflas" (sin "IEP").
7. Responsive: en ningún dispositivo ni con zoom puede tapar texto. Los tamaños bajan de forma progresiva según la pantalla.

### Navegación
8. Índice a la izquierda, más grande, rectangular, en bordó.
9. 3 pestañas: **Cursos · Educación · Sobre nosotros**.

### Sección "Nuestros cursos" (ex "Archivo de cursos")
10. Se renombra a "Nuestros cursos" y va justo después de la sección del curso actual.
11. El curso actual también aparece en esta lista, con el tag **"Inscripciones abiertas"** + fecha. (Reemplaza a "Próximo a dictar".)
12. **Formato nuevo, reemplaza las cards en dos columnas:** una lista compacta.
    - Cerrado: imagen circular (recorte de la parte central del flyer) + título + disertante + botón "+".
    - Abierto (al hacer click en "+"): la imagen pasa de círculo a cuadrado más grande (el flyer original) y aparece el temario, CV del docente, qué incluye, etc.
    - Se ve rápido título y disertante de todos los cursos, y el detalle solo si uno quiere.
13. Cada curso lleva el botón **"Quiero anotarme"** → WhatsApp con el mensaje precargado: *"Hola! Quiero anotarme al curso de '[Nombre del curso]'."*
14. Lacan sale de la sección del curso actual y pasa a "Sobre nosotros", esquina inferior izquierda.

### Sección "¿Buscás un tema en específico?" (nueva)
15. Buscador de contenido educativo: todas las psicopíldoras y psicorelámpagos, con link directo (hoy hay 11 cargados, todos de Instagram).
16. Cada resultado lleva un botón a WhatsApp con el mensaje: *"Pueden explicarme con más profundidad: [tema - autor]"*.

### Sección "Sobre nosotros"
17. Declaración de interés municipal, texto breve (2-3 párrafos) de por qué armaron la página, notas/menciones que les hicieron, y a futuro mercadería.

### Reviews de usuarios (nuevo)
18. Sección de reseñas. Tienen que ser **reales**, no escritas por nosotros.
    - Yo no escribo reseñas inventadas ni las redacto en voz de alumnos: la sección se construye vacía y se carga solo con material real.
    - Formas de conseguirlas: capturas de comentarios o mensajes de Instagram/WhatsApp (con permiso de la persona), comentarios de YouTube, o un formulario corto que se les mande a los alumnos al terminar un curso.
    - Lo más creíble y más "collage": mostrar la **captura real** como recorte, en vez de retipear el texto.
    - Cada reseña guarda: texto o captura, nombre o iniciales, curso, origen y si dio permiso.
    - La sección no se publica hasta tener al menos 3 reales.
    - Ubicación a confirmar (propuesta: después de "Nuestros cursos").

### Tipografía oficial (cambia lo que veníamos usando)
19. **Títulos:** Decalotype Black.
20. **Texto tipo publicaciones informativas ("sexología"):** Helvetica Bold.
21. **Texto chico (casi no se usa):** Source Serif Pro (en Google Fonts figura como "Source Serif 4").
22. Esto reemplaza a Montserrat y Lato. Mientras no estén los archivos, Montserrat y Lato quedan como fuente de respaldo para poder seguir avanzando.
23. Hay que reescribir la sección de tipografía de `DESIGN.md`, incluidos los pesos límite (ahora serían Decalotype 900, Helvetica 700 y Source Serif en un solo peso).

---

## B. Qué cambió respecto de la lista anterior

| Antes | Ahora |
|---|---|
| Tag del curso actual: "Próximo a dictar" | "Inscripciones abiertas" |
| Cards en 2 columnas, todo desplegado siempre | Lista con imagen circular, y detalle que se abre con "+" |
| Un solo "+/–" que cambiaba todas las descripciones a la vez | Un "+" por curso (ese control compartido se descarta) |
| Navegación arriba | Índice a la izquierda |
| Tipografía: Montserrat + Lato (sacadas del feed) | Decalotype Black + Helvetica Bold + Source Serif Pro |
| Sin reviews | Sección de reviews reales |

---

## C. Decisiones técnicas

- **Círculo que se vuelve cuadrado:** se anima el redondeo de la imagen y su tamaño con CSS, sin librerías. Respeta `prefers-reduced-motion` (sin animación, cambia directo). Los círculos son para estas miniaturas de flyer; no contradicen la regla de "sin bordes redondeados" del collage de recortes.
- **Cada curso necesita dos imágenes:** el flyer completo (para cuando se abre) y la miniatura con el recorte central (para el círculo). Se agregan al modelo de datos junto con `temario`, `cvDocente` y `queIncluye`.
- **Helvetica:** es una fuente paga para web, así que no se puede subir como las de Google Fonts. Opciones: usar la que ya viene instalada en el dispositivo (Helvetica en Apple, Arial en Windows/Android, se ve levemente distinta) o comprar la licencia web. Hay que elegir una.
- **Decalotype:** no está en Google Fonts. Hay que pedirle los archivos al diseñador y confirmar que la licencia permita usarla en una web.

---

## D. Faltantes

### Bloquean empezar
- [ ] **Definir cuál es el curso actual de verdad.** Hoy hay tres versiones distintas: la web tiene "Introducción a la selección de personal" con fechas 16 y 23 de septiembre (ya pasaron), el mock tenía otro, y el bot habla del curso TCC "Las violencias y la Teoría de la Desconexión Moral". Hace falta nombre, fechas, disertante y flyer del curso que tiene inscripciones abiertas, iguales en la web y en el bot.
- [ ] Archivos de **Decalotype Black** (y licencia web).
- [ ] Decisión sobre Helvetica (usar la del dispositivo o licencia).
- [ ] Por cada curso: flyer completo + recorte central para el círculo + temario + CV del docente + qué incluye.
- [ ] Logo de IEP en buena calidad (hoy solo JPG; para el formato redondo conviene SVG o PNG con fondo transparente).

### Falta confirmar (cambian el diseño, no bloquean)
- [ ] Cómo se ve el índice de la izquierda en celular (propuesta: se pasa a una barra arriba).
- [ ] Tags de los demás cursos: ¿"Activo" para los que se están dictando y nada para los finalizados?
- [ ] ¿Se muestran los valores en la web o solo los da Pantu por WhatsApp?
- [ ] ¿Sigue existiendo el "+/–" general por sección (punto 4) además del "+" por curso?
- [ ] Helvetica Bold para párrafos largos puede ser muy pesada: ¿se permite Helvetica normal para el cuerpo?
- [ ] Ubicación de la sección de reviews.
- [ ] Items de tipo "video" del buscador: ¿van a YouTube en vez de Instagram?

### Contenido que hay que conseguir
- [ ] Reviews reales (ver punto 18).
- [ ] Texto final de "Sobre nosotros", la declaración de interés municipal y las notas/menciones.
- [ ] Logo de Pantu en buena calidad.
- [ ] Productos de mercadería (a futuro).

---

## E. Pantu / bot de WhatsApp (proyecto aparte, no bloquea la web)

- Implementar el bot (bloqueado por la verificación del número en YCloud).
- Que reconozca "Quiero anotarme" y responda con precio (nacional/internacional) e inscripción.
- Pantu 2.0 (bot con RAG propio de psicología).

**Pregunta tuya: ¿varios códigos pueden llevar al mismo mensaje? Sí.** Se resuelve del lado del bot con una tabla de frases que apuntan a la misma respuesta:
- El mensaje de la web ya lleva el nombre del curso, así que el bot busca "quiero anotarme al curso de" + el nombre en su lista de cursos. Si se agrega un código corto al final del mensaje, funciona igual si lo cambian un poco.
- Si la persona edita el mensaje y no coincide con nada, cae al menú principal, y desde ahí tiene que poder llegar al curso por los números: opción 1 (curso actual) y opción 2 (otros cursos → lista → curso). Hay que revisar que el menú del bot cubra todos los cursos de la web.

---

## F. Orden sugerido (un prompt de Claude Code por paso)

1. Colores + tipografía con respaldo (tokens).
2. Hero + índice izquierdo + alternancia bordó/blanco.
3. "Nuestros cursos" (lista con círculo → cuadrado).
4. "¿Buscás un tema en específico?".
5. "Sobre nosotros" (con Lacan).
6. Reviews (cuando haya reales).

Fuera del código, en paralelo: conseguir fuentes, flyers y reviews; resolver YCloud.
