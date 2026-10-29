// Mensajes prearmados de WhatsApp (VOICE.md §3.4) — un solo lugar para que
// el texto de la web y lo que reconoce el bot de Pantu no se desalineen.
import { site } from "../../data/site";

export function whatsappUrl(text: string): string {
	return `https://wa.me/${site.whatsappPhone}?text=${encodeURIComponent(text)}`;
}

/** Inscripción al curso con inscripciones abiertas (BACKLOG.md §13). */
export function courseSignupMessage(course: { title: string }): string {
	return `Hola! Quiero anotarme al curso de "${course.title}".`;
}

/**
 * Pedido de información de un curso dictado: el código del curso (el número
 * de nodo del bot, 21–31) seguido del nombre, ej. "23 Introducción a la
 * Selección de Personal". El bot lo reconoce por el número inicial y
 * responde directo con la ficha del curso. Sin código, solo el nombre.
 */
export function courseInfoMessage(course: { code?: number; title: string }): string {
	return course.code ? `${course.code} ${course.title}` : course.title;
}
