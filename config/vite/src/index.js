// @ts-check
import { defineConfig } from 'vite';
import dts from 'unplugin-dts/vite';
import { externalizeDeps } from 'vite-plugin-externalize-deps';

const afterDiagnostic = (diagnostics) => {
  if (diagnostics?.length > 0) {
    console.error('请修复以上错误');
    process.exit(1);
  }
};

/**
 * @param {import('./index.js').Options} options
 * @returns {import('vite').UserConfig}
 */
export function viteConfig(options) {
  const outDir = options?.outDir ?? 'dist';
  const cjs = options?.cjs ?? true;

  return defineConfig({
    plugins: [
      externalizeDeps(),
      dts({ compilerOptions: { paths: void 0 }, afterDiagnostic }),
      // dts({ outDirs: `${outDir}/esm`, afterDiagnostic }),
      // cjs ? dts({ outDirs: `${outDir}/cjs`, afterDiagnostic }) : null,
    ],
    build: {
      ...options,
      emptyOutDir: true,
      outDir,
      sourcemap: false,
      minify: false,
      lib: {
        entry: options.lib.entry,
        formats: cjs ? ['es', 'cjs'] : ['es'],
        fileName: (format) => {
          if (format === 'cjs') {
            return 'cjs/[name].cjs';
          }
          return 'esm/[name].js';
        },
      },
      rollupOptions: {
        output: { preserveModules: true },
      },
    },
  });
}
