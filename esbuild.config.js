import { build } from 'esbuild';

await build({
  entryPoints: ['server/index.ts'],
  platform: 'node',
  packages: 'external',
  bundle: true,
  format: 'esm',
  outdir: 'dist',
  external: ['vite', '@vitejs/plugin-react', '@replit/vite-plugin-shadcn-theme-json', '@replit/vite-plugin-runtime-error-modal'],
  target: 'node18',
  sourcemap: false,
  minify: false,
}); 