/** Prefix for files in /public so the site also works when served from a sub-path (e.g. GitHub Pages). */
export const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
