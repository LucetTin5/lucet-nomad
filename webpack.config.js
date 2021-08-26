const path = require('path');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');

const BASE_JS = './src/client/scripts/';
module.exports = {
  entry: {
    main: BASE_JS + 'main.js',
    video_grid: BASE_JS + 'video-grid.js',
    video_player: BASE_JS + 'videoPlayer.js',
    validator: BASE_JS + 'validator.js',
    comments: BASE_JS + 'comments.js',
    username: BASE_JS + 'username.js',
  },
  plugins: [
    new MiniCSSExtractPlugin({
      filename: 'css/styles.css',
    }),
  ],
  output: {
    filename: 'scripts/[name].js',
    path: path.resolve(__dirname, 'static'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['@babel/preset-env']],
          },
        },
      },
      {
        test: /\.s[ac]ss$/,
        use: [MiniCSSExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(jp(e*)g|png|svg|gif)$/i,
        use: {
          loader: 'file-loader',
          options: {
            publicPath: './static/',
            name: 'images/[name].[ext]?[hash]',
          },
        },
      },
    ],
  },
};
