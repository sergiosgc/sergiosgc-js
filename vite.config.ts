// vite.config.ts
import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  root: 'src',
  build: {
    outDir: '../dist',
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      fileName: (format, entryName) => 'sergiosgc-js.js',
      name: 'sergiosgc-js.js',
      formats: ['umd'],
    },
    emptyOutDir: true,
    sourcemap: true,
    minify: false,
    assetsDir: 'assets',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    }
  },
  define: {
    'process.env.NODE_ENV': '"production"'
  }
})