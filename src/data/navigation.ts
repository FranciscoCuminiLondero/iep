// Pestañas del índice de secciones (BACKLOG.md §8-9). El id es también el
// ancla de la sección a la que lleva (#cursos, #educacion, #sobre-nosotros).
export const navTabs = [
	{ id: "cursos", label: "Cursos" },
	{ id: "educacion", label: "Educación" },
	{ id: "sobre-nosotros", label: "Sobre nosotros" },
] as const;

export type NavTabId = (typeof navTabs)[number]["id"];
