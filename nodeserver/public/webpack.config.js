const path = require('path');

module.exports = {
    entry: './js/index.js',  // Your main JavaScript file
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',  // Output bundle file
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']  // Transpile to compatible JavaScript
                    }
                }
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
        ]
    },
    devtool: 'source-map',
};