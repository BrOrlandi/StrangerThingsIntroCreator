var webpack = require('webpack'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    IndexHtmlPlugin = require('indexhtml-webpack-plugin'),
    LiveReloadPlugin = require('webpack-livereload-plugin'),
    path = require('path');

var autoprefixer = require('autoprefixer');

var cssExtractTextPlugin = new ExtractTextPlugin('[contenthash].css');

var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    'script': './scripts/index.js',
    'index.html': './index.html',
  },

  module: {
    loaders: [
      { test: /\.json$/, loader: 'json-loader'},
      { test: /\.js[x]?$/, exclude: /(node_modules|bower_components)\//, loader: 'babel-loader'},
      { test: /\.(ttf.*|eot.*|woff.*|ogg|mp3)$/, loader: 'file-loader'},
      { test: /.(png|jpe?g|gif|svg.*)$/, loader: 'file-loader!img-loader?optimizationLevel=7&progressive=true'},
      {
        test: /\.css$/,
        loader: cssExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader'),
      },
      {
        test: /\.scss$/,
        loader: cssExtractTextPlugin.extract('style-loader', 'css-loader!sass-loader'),
      },
      {
        test: /\.html$/,
        loader: 'html?attrs=link:href img:src',
      },
    ],
  },

  postcss: function() {
    return [autoprefixer({browsers: "> 3%"})];
  },

  plugins: [
    new CopyWebpackPlugin([{from: './termsOfService.html'},
        {from: './preview.png'},
        {from: './.nojekyll'},
        {from: './donateButtons.html'},
]),
    cssExtractTextPlugin,
    new IndexHtmlPlugin('index.html', 'index.html'),
    new webpack.DefinePlugin({
      Environment: JSON.stringify(require('config')),
    }),
    new LiveReloadPlugin({appendScriptTag:true}),
  ],

  resolve: {
    root: path.join(__dirname, 'scripts'),
    extensions: ['', '.js', '.json', '.jsx'],
  },

  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
  },
};
