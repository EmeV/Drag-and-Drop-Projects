const path = require("path");
const CleanPlugin = require('clean-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/app.ts',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'), //constructs an absolute path to dist folder
  },
  devtool: 'none', //tell webpack, that there will be already generated source maps
  module: {
    rules: [
      //coulbe be more rules for different types of files, css, an so on
      {
        test: /\.ts$/, //reg .expt select all ts files
        use: "ts-loader", //what to do with the ts files? use the ts-loader
        exclude: /node_modules/
      },
    ],
  },
  resolve: {
    //add extentsions
    extensions: ['.ts', '.js'],
  },
  plugins: [
        new CleanPlugin.CleanWebpackPlugin() //clean the dist folder every time
  ]
};
