/** Shallow-safe `dynamicData` key for user-added columns (`c_…` ids). */
export function ecoCcFieldKey(columnId: string): string {
  return `ecoCc__${columnId}`
}
