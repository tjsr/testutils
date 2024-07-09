import { findFileUpwards } from "@tjsr/fs-utils";

export const findPackageJson = (startDir?: string, maxDepth: number = 2): string|undefined => {
  return findFileUpwards('package.json', maxDepth, startDir);
};

export const findEnvFile = (): string => {
  return findFileUpwards('.env.test');
};

export const findViteConfigPath = ():string => {
  return findFileUpwards('vite.config.ts');
};
