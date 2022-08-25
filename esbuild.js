const isDev = process.env.NODE_ENV === 'development';
const { htmlPlugin } = require('@craftamap/esbuild-plugin-html');

require('esbuild').build({
  entryPoints: ['src/main.ts', 'src/preload.ts'],
  bundle: true,
  platform: 'node',
  outdir: './dist',
  external: ['electron', 'electron-reload'],
  watch: isDev,
  minify: !isDev,
  sourcemap: isDev,
});

require('esbuild').build({
  entryPoints: ['src/App.tsx'],
  bundle: true,
  metafile: true,
  platform: 'browser',
  outdir: './dist',
  watch: isDev,
  minify: !isDev,
  sourcemap: isDev,
  plugins: [
    htmlPlugin({
      files: [
        {
          entryPoints: ['src/App.tsx'],
          filename: 'index.html',
          htmlTemplate: 'src/web/index.html',
        },
      ],
    }),
  ],
});

