const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const mod = process.env.NODE_ENV || 'development';

const options = {
  umd: {
    mode: 'production',
    devtool: false,
    entry: './src/index.tsx',
    output: {
      path: path.resolve(__dirname, 'lib'),
      filename: 'editor.umd.js',
      library: 'editor',
      libraryTarget:'umd',
      umdNamedDefine: true
    },
    externals: ['react', 'react-dom'],
  },
  browser: {
    mode: 'production',
    devtool: false,
    entry: './src/index.tsx',
    output: {
      path: path.resolve(__dirname, 'lib'),
      filename: 'editor.min.js',
      library: '',
      libraryTarget:'window',
    },
  },
  development: {
    mode: 'development',
    devtool: 'inline-source-map',
    entry: './src/development/index.ts',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'index.js',
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'src/development/index.html'),
        inject: true,
        hash: true,
      })
    ],
    devServer: {
      contentBase: path.join(__dirname, 'dist'),
      compress: true,
      port: 5000,
      noInfo: true,
      open: true,
      overlay: true,
      progress: true,
    },
  }
}

module.exports = {
  resolve: {
    extensions: [ '.tsx', '.ts', '.js', '.json' ]
  },
  module: {
    rules: [
      {
        test: /\.(m?js|tsx?)$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
          }
        }
      },
      {
        test: /\.module\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: true
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ],
        exclude: /\.module\.css$/
      },
    ]
  }
};

for (const key of Object.keys(options[mod])) {
  module.exports[key] = options[mod][key];
}