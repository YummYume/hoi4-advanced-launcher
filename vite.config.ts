import * as path from 'path';
import * as process from 'process';
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [svelte()],
    resolve: {
        alias: {
            '@': path.resolve('src/renderer/src')
        }
    },
    root: path.resolve(process.cwd(), 'src/renderer'),
    base: './',
    build: {
        target: 'esnext'
    },
    server: {
        watch: {
            usePolling: true
        }
    }
});
