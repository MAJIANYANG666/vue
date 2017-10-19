module.exports = {
    entry: './app.js',
    output: {
          filename: 'bundle.js'
    },
    resolve: {
          alias: {
                  'vue$': 'vue/dist/vue.common.js'
                }
    },
     module: {
           loaders:[
                   {
                             test: /\.js[x]?$/,
                             exclude: /node_modules/,
                             loader: 'babel-loader?presets[]=es2015&presets[]=react'
                           },
                 ]
         }
  }
