import { cp, mkdir, rm } from 'node:fs/promises';

await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });
await cp('src/static', 'dist', { recursive: true });
console.log('Static Phaser portfolio built to dist/');
