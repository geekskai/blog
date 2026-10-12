export function getPaginationHref(basePath: string, page: number) {
  return page === 1 ? `/${basePath}/` : `/${basePath}/page/${page}`
}
