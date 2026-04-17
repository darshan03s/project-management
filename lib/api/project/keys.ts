export const projectKeys = {
  all: ['projects'],
  detail: (id: string) => ['projects', id] as const
}
