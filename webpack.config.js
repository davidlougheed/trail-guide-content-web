// noinspection JSValidateTypes

const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const DotenvPlugin = require("dotenv-webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = env => ({
    entry: ["babel-polyfill", path.resolve(__dirname, "./src/index.js")],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ["babel-loader"]
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.(png|jpg)$/,
                use: ["url-loader"]
            }
        ]
    },
    resolve: {
        extensions: ["*", ".js", ".jsx"]
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].[chunkhash:8].js",
        sourceMapFilename: "[name].[chunkhash:8].map",
        chunkFilename: "[name].[chunkhash:8].js",
    },
    optimization: {
        splitChunks: {
            chunks: "all"
        }
    },
    plugins: [
        new CopyPlugin({
            patterns: [{from: "config", to: "config"}],
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "./src/template.html"),
            hash: true,
            publicPath: "/",
        }),
        ...(env.production ? [] : [
            new DotenvPlugin(),
        ]),
    ],
    devServer: {
        historyApiFallback: true,
    },
});
