import { findFileUpwards } from "@tjsr/fs-utils";

export const findPackageJson = (startDir?: string, maxDepth: number = 2): string => {
  return findFileUpwards('package.json', maxDepth, startDir);
};

export const findEnvFile = (envFileName: string = '.env', startDir?: string): string => {
  return findFileUpwards(envFileName, undefined, startDir);
};

export const findViteConfigPath = (searchDir?: string):string => {
  return findFileUpwards('vite.config.ts', undefined, searchDir);
};
