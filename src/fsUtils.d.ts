declare module '@tjsr/fs-utils' {
  export function findFileUpwards(searchFilename?: string, maxDepth?: number, startDir?: string): string;
}
