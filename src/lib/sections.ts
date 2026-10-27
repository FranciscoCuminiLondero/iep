// Contrato común de las secciones de la página (index.astro las arma en
// orden y les pasa estos props). La variante de color sale de la POSICIÓN,
// no de cada sección: así la alternancia bordó/blanco (BACKLOG.md §1) se
// mantiene sola si se agregan, sacan o reordenan secciones.
import type { NavTabId } from "../data/navigation";

export type SectionVariant = "burgundy" | "white";

export interface SectionProps {
	id: string;
	variant: SectionVariant;
	/** Pestaña del índice que se resalta mientras se ve esta sección. */
	nav?: NavTabId;
	/** Destino del link "siguiente sección" (NextSectionLink). */
	next?: { id: string; label: string };
}

/** El Hero (posición 0) es bordó y de ahí se alterna. */
export const variantAt = (index: number): SectionVariant => (index % 2 === 0 ? "burgundy" : "white");
