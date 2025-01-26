// noinspection JSValidateTypes

const path = require("node:path");
const CopyPlugin = require("copy-webpack-plugin");
const DotenvPlugin = require("dotenv-webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = env => ({
    entry: ["./src/index.tsx"],
    module: {
        rules: [
            {
                test: /\.[tj]sx?$/,
                loader: "ts-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.(js|mjs)$/,
                // enforce: "pre",
                use: ["source-map-loader"],
            },
            {
                test: /\.jsx?$/,
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
        extensions: ["*", ".webpack.js", ".ts", ".tsx", ".js", ".jsx"],
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].[chunkhash:8].js",
        sourceMapFilename: "[file].map[query]",
        chunkFilename: "[name].[chunkhash:8].js",
        clean: true,
    },
    devtool: "source-map",
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
