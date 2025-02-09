const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = (env) => {
  console.log(JSON.stringify(env, null, 2));
  const isProduction = env.production;
  const outputPath = path.resolve(__dirname, isProduction ? 'docs' : 'dist');
  const publicPath = isProduction ? env.PUBLIC_URL : '/';

  const mode = isProduction ? 'production' : 'development';
  console.log(`Running in ${mode} mode, path ${publicPath}, output directed to ${outputPath}.`);

  return {
    mode,
    entry: './src/app.ts',
    devtool: isProduction ? 'source-map' : 'inline-source-map',
    devServer: {
      port: isProduction ? 3377 : 3378,
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': JSON.stringify({ NODE_ENV: mode, PUBLIC_URL: publicPath }),
      }),
      new HtmlWebpackPlugin({
        title: 'Database for Human Enhancement Interventions',
        favicon: './src/favicon.ico',
        meta: { viewport: 'width=device-width, initial-scale=1' },
      }),
      new WebpackPwaManifest({
        name: 'Database for Human Enhancement Interventions',
        short_name: 'HEI',
        start_url: publicPath,
        scope: '/',
        description: 'A database with known interventions to enhance human performance.',
        background_color: '#ffffff',
        theme_color: '#ffffff',
        crossorigin: null, //can be null, use-credentials or anonymous
        display: 'standalone',
        lang: 'en',
        categories: ['government', 'personalization', 'productivity', 'utitlies'],
        icons: [
          {
            src: path.resolve('src/assets/android-chrome-512x512.png'),
            sizes: [96, 128, 192, 256, 384, 512], // multiple sizes
          },
          // {
          //   src: path.resolve('src/assets/large-icon.png'),
          //   size: '1024x1024', // you can also use the specifications pattern
          // },
          // {
          //   src: path.resolve('src/assets/maskable-icon.png'),
          //   size: '1024x1024',
          //   purpose: 'maskable',
          // },
        ],
      }),
      isProduction
        ? new WorkboxPlugin.GenerateSW({
            // these options encourage the ServiceWorkers to get in there fast
            // and not allow any straggling "old" SWs to hang around
            maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
            clientsClaim: true,
            skipWaiting: true,
            exclude: [/\.map$/, /manifest.*\.json$/],
          })
        : undefined,
      new HtmlWebpackTagsPlugin({
        metas: [
          {
            attributes: {
              property: 'og:title',
              content: 'Database for Human Enhancement Interventions',
            },
          },
          {
            attributes: {
              property: 'og:description',
              content:
                'A database where you can look for means to enhance human performance, e.g. by using drugs, specific training or other means.',
            },
          },
          {
            attributes: {
              property: 'og:url',
              content: publicPath,
            },
          },
          {
            path: './src/assets/logo.svg',
            attributes: {
              property: 'og:image',
            },
          },
          {
            attributes: { property: 'og:locale', content: 'en_UK' },
          },
          {
            attributes: { property: 'og:site_name', content: 'HEI' },
          },
          {
            attributes: {
              property: 'og:image:alt',
              content: 'Database for Human Enhancement Interventions',
            },
          },
          {
            attributes: {
              property: 'og:image:type',
              content: 'image/svg',
            },
          },
          {
            attributes: {
              property: 'og:image:width',
              content: '200',
            },
          },
          {
            attributes: {
              property: 'og:image:height',
              content: '200',
            },
          },
        ],
      }),
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css',
      }),
    ].filter((p) => p),
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        // {
        //   test: /\.css$/i,
        //   use: ['style-loader', 'css-loader'],
        // },
        {
          test: /\.(png|svg|jpg|jpeg|gif|webp)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
        // {
        //   test: /\.(csv|tsv)$/i,
        //   use: ['csv-loader'],
        // },
        // {
        //   test: /\.xml$/i,
        //   use: ['xml-loader'],
        // },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
    optimization: {
      minimizer: [
        // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
        // `...`,
        new CssMinimizerPlugin(),
      ],
    },
    output: {
      filename: '[name]-beta.bundle.js',
      path: outputPath,
      publicPath,
      clean: true,
    },
  };
};
