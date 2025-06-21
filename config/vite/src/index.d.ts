import {
  type LibraryOptions,
  type BuildEnvironmentOptions,
  type UserConfig,
} from 'vite';

type Options = BuildEnvironmentOptions & {
  cjs?: boolean;
  outDir?: string;
  lib: LibraryOptions;
};

export function viteConfig(config: Options): UserConfig;
