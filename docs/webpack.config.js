module.exports = {
     entry: './src/app.js',
     output: {
         path: '.',
         filename: 'app.bundle.js',
     },
     module: {
         loaders: [{
             test: /\.jsx?$/,
             exclude: /node_modules/,
             loader: 'babel-loader',
             query: {
                presets: ['es2015']
             }
         },
        { test: /\.css$/, loader: "style-loader!css-loader" }
         ]
     }
 }
