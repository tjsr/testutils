import { findFileUpwards } from "@tjsr/fs-utils";

export const findPackageJson = (startDir?: string, maxDepth: number = 2): string|undefined => {
  return findFileUpwards('package.json', maxDepth, startDir);
};

export const findEnvFile = (envFileName: string = '.env', startDir?: string): string => {
  return findFileUpwards(envFileName, undefined, startDir);
};

export const findViteConfigPath = ():string => {
  return findFileUpwards('vite.config.ts');
};
