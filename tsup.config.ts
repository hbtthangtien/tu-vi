import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'ziwei/index': 'src/ziwei/index.ts',
    'nihai/index': 'src/nihai/index.ts',
    'classics/index': 'src/classics/index.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  splitting: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  outDir: 'dist',
});
