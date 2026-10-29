// Scroll animado compartido (ScrollNav.astro, desplegables de cursos). Se
// usa en lugar de scroll-behavior:smooth porque la curva y la duración del
// navegador son fijas: un salto de varias pantallas en el mismo tiempo que
// uno corto se ve brusco.
//
// - Duración proporcional a la distancia (400–1000ms).
// - Curva ease-in-out: arranca y frena suave, sin el tirón inicial de una
//   curva solo de salida en saltos largos.
// - Si el usuario mueve la rueda o toca la pantalla, la animación se corta y
//   el scroll queda en sus manos (no pelea contra él).
// - Sin animación con prefers-reduced-motion.
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function easeInOutCubic(t: number) {
	return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

let activeAnimation = 0;

/**
 * Lleva el scroll a `targetY`. `onDone` se llama al terminar o si el usuario
 * la interrumpe — no si otra llamada a smoothScrollTo la reemplaza.
 */
export function smoothScrollTo(targetY: number, onDone?: () => void) {
	const animation = ++activeAnimation;
	const startY = window.scrollY;
	const diff = targetY - startY;
	// Un frame extra antes de avisar: deja que los IntersectionObserver vean
	// la posición final.
	const finish = () => requestAnimationFrame(() => requestAnimationFrame(() => onDone?.()));

	if (Math.abs(diff) < 1 || prefersReducedMotion.matches) {
		window.scrollTo({ top: targetY, left: 0, behavior: "instant" });
		finish();
		return;
	}

	const duration = Math.min(1000, Math.max(400, 300 + Math.abs(diff) * 0.2));
	const start = performance.now();

	const interrupt = () => {
		if (animation !== activeAnimation) return;
		activeAnimation++;
		finish();
	};
	window.addEventListener("wheel", interrupt, { once: true, passive: true });
	window.addEventListener("touchstart", interrupt, { once: true, passive: true });

	const step = (now: number) => {
		if (animation !== activeAnimation) return;
		const t = Math.min((now - start) / duration, 1);
		window.scrollTo({ top: startY + diff * easeInOutCubic(t), left: 0, behavior: "instant" });
		if (t < 1) {
			requestAnimationFrame(step);
			return;
		}
		window.removeEventListener("wheel", interrupt);
		window.removeEventListener("touchstart", interrupt);
		finish();
	};
	requestAnimationFrame(step);
}

/** Margen superior para que algo quede visible bajo la barra fija (mobile). */
export function topOffsetFor(element: Element) {
	const section = element.closest("[data-section]");
	return section ? parseFloat(getComputedStyle(section).scrollMarginTop) || 0 : 0;
}

/**
 * Posición de scroll que deja `element` a `gap` px del tope visible.
 *
 * No alcanza con scrollY + getBoundingClientRect().top: si la sección ya
 * quedó pegada (sticky), su contenido no se mueve con el scroll y esa cuenta
 * da cualquier cosa. Se mide desde el sentinel anterior a la sección
 * (index.astro), que no es sticky. Y en una sección sticky el resultado se
 * limita al punto donde se pega: más allá el contenido ya no sube.
 *
 * `extraHeight`: cuánto va a crecer la sección (un desplegable que se está
 * abriendo), para calcular ese límite con el alto final.
 */
export function scrollTargetFor(element: Element, gap = 0, extraHeight = 0) {
	const offset = topOffsetFor(element) + gap;
	const section = element.closest<HTMLElement>("[data-section]");
	const marker = section?.previousElementSibling;

	if (!section || !marker?.hasAttribute("data-section-sentinel")) {
		return Math.max(0, window.scrollY + element.getBoundingClientRect().top - offset);
	}

	const sectionTop = marker.getBoundingClientRect().bottom + window.scrollY;
	const offsetInSection = element.getBoundingClientRect().top - section.getBoundingClientRect().top;
	let target = sectionTop + offsetInSection - offset;

	if (getComputedStyle(section).position === "sticky") {
		const stickPoint = sectionTop + section.offsetHeight + extraHeight - document.documentElement.clientHeight;
		target = Math.min(target, Math.max(sectionTop, stickPoint));
	}
	return Math.max(0, target);
}
