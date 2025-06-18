import { type LibraryOptions, type UserConfig } from 'vite';

type Options = LibraryOptions & {
  cjs?: boolean;
  outDir?: string;
};

export function viteConfig(config: Options): UserConfig;
