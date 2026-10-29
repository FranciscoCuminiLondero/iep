// Imágenes de curso por convención de nombre — sin tocar el contenido.
// Alcanza con dejar el archivo en src/assets/cursos/ con el slug del curso
// (el nombre de su .md en src/content/courses/):
//
//   <slug>.png          → flyer completo
//   <slug>-circulo.png  → recorte central para la miniatura circular
//
// Formatos aceptados: webp, png, jpg, jpeg (si hay varios con el mismo
// nombre, en ese orden de preferencia). import.meta.glob lo resuelve Vite:
// en `astro dev` un archivo nuevo aparece solo; en producción, con el
// próximo deploy. Si el .md trae `flyer` explícito, gana ese valor.
const EXTENSIONS = ["webp", "png", "jpg", "jpeg"];

const modules = import.meta.glob<{ default: ImageMetadata }>("/src/assets/cursos/*.{webp,png,jpg,jpeg}", { eager: true });

export interface CourseImage {
	src: string;
	width: number;
	height: number;
}

const imagesByName = new Map<string, CourseImage & { extension: string }>();

for (const [path, module] of Object.entries(modules)) {
	const file = path.slice(path.lastIndexOf("/") + 1);
	const dot = file.lastIndexOf(".");
	const name = file.slice(0, dot);
	const extension = file.slice(dot + 1).toLowerCase();
	const current = imagesByName.get(name);
	if (!current || EXTENSIONS.indexOf(extension) < EXTENSIONS.indexOf(current.extension)) {
		const { src, width, height } = module.default;
		imagesByName.set(name, { extension, src, width, height });
	}
}

export function findCourseImage(name: string): CourseImage | undefined {
	const image = imagesByName.get(name);
	return image && { src: image.src, width: image.width, height: image.height };
}
