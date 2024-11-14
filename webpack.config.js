const path = require("path");
const CircularDependencyPlugin = require("circular-dependency-plugin");
const DuplicatePackageCheckerPlugin = require("duplicate-package-checker-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const isProd = process.env.NODE_ENV === "production";
const isDev = !isProd;

module.exports = {
    context: path.resolve(__dirname, "source"),
    mode: isProd ? "production" : "development",
    entry: {
        main: "./js/main.js",
        vendor: "./js/vendor.js",
    },
    devtool: isDev ? "source-map" : false,
    output: {
        filename: "[name].min.js",
        path: path.resolve(__dirname, "build/js"),
    },
    optimization: {
        minimize: isProd,
        minimizer: isProd ? [new TerserPlugin()] : [],
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                options: {
                    presets: ["@babel/preset-env"],
                },
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            outputPath: "fonts/",
                            publicPath: "../fonts/",
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new DuplicatePackageCheckerPlugin(),
        new CircularDependencyPlugin(),
    ],
    devServer: {
        contentBase: path.resolve(__dirname, "build"),
        compress: true,
        port: 3000,
        open: true,
    },
};
