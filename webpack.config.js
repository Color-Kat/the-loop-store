const path = require("path");

// Добавляет HTML и подключает туда собранные js файлы
const HTMLWebpackPlugin = require("html-webpack-plugin");

// Копирует статические файлы из src в dist
const CopyWebpackPlugin = require("copy-webpack-plugin");

// Сжимает css и добавляет его в отдельный файл
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimazeCssAssetWebpackPlugin = require("optimize-css-assets-webpack-plugin");
// Сжимает JS
const TerserWebpackPlugin = require("terser-webpack-plugin");

const {
    BundleAnalyzerPlugin
} = require("webpack-bundle-analyzer");

// Очищает dist от предыдущих файлов
const {
    CleanWebpackPlugin
} = require("clean-webpack-plugin");

// Определяет, в каком моде запущено приложение с помощью process
const isDev = process.env.NODE_ENV === "development";

// В зависимости от режима сборки (prod или dev) возвращает различные названия файлов (с хешем и без)
const filename = ext => (isDev ? `[name].${ext}` : `[name].[hash].${ext}`);

// Функция оптимизации продакшена
const optimization = () => {
    const config = {
        splitChunks: {
            chunks: "all"
        }
    };

    if (!isDev) {
        // В проде добавляет минификацию css и js
        config.minimizer = [new OptimazeCssAssetWebpackPlugin(), new TerserWebpackPlugin()];
    }

    return config;
};

// Функция, возвращающая массив для описания loader'а одного из css препроцессоров
const cssLoaders = extra => {
    const loaders = [{
            loader: MiniCssExtractPlugin.loader,
            options: {
                hmr: isDev,
                reloadAll: true
            }
        },
        "css-loader"
    ];

    if (extra) {
        loaders.push(extra);
    }

    return loaders;
};

// Добавляет различные пресеты babel для поддержки ts и react
const babelOptions = preset => {
    const opts = {
        presets: [
            ["@babel/preset-env", {
                useBuiltIns: "entry", // or "entry"
                corejs: 3,
            }]
        ],
        plugins: [
            '@babel/plugin-proposal-class-properties'
        ]
    };

    if (preset) {
        opts.presets.push(preset);
    }

    return opts;
}

// В режиме разработки добавляет esLint
const jsLoaders = () => {
    const loaders = [{
        loader: 'babel-loader',
        options: babelOptions()
    }]

    if (isDev) {
        loaders.push('eslint-loader');
    }

    return loaders;
}

const plugins = () => {
    const base = [
        new HTMLWebpackPlugin({
            template: "./index.html",
            // Минификация
            minify: false
            // {
            // Убрать пробелы, если в продакшене
            // collapseWhitespace: !isDev
            // }
        }),
        new CleanWebpackPlugin(),

        new MiniCssExtractPlugin({
            filename: filename("css")
        })
    ];

    if (!isDev) {
        base.push(new BundleAnalyzerPlugin());
        base.push(new CopyWebpackPlugin({
            patterns: [{
                from: path.resolve(__dirname, "assets"),
                to: path.resolve(__dirname, "dist/assets")
            }]
        }), )
    }

    return base;
}

module.exports = {
    mode: "development",
    // Определяет src папку, чтобы потом не писать ./src
    context: path.resolve(__dirname, "src"),
    // Входной файл js(который никто не подключает)
    entry: {
        main: ["./index.js"]
    },
    output: {
        filename: filename("js"), // Название выходного файла сборки
        path: path.resolve(__dirname, "dist") // Путь к dist
    },
    resolve: {
        // Какие расширения файлов webpack будет искать сам
        extensions: [".js", ".jsx", ".ts", ".tsx"],
        // Сокращенные пути
        alias: {
            "@modules": path.resolve(__dirname, "src/modules"),
            "@components": path.resolve(__dirname, "src/components"),
            "@": path.resolve(__dirname, "src")
        }
    },
    plugins: plugins(),
    module: {
        rules: [{
                test: /\.js$/,
                exclude: /node_modules/,
                use: jsLoaders()
            },
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                loader: {
                    loader: "babel-loader",
                    options: babelOptions()
                }
            },
            {
                test: /\.css$/,
                use: cssLoaders()
            },
            {
                test: /\.s[ac]ss$/i,
                use: cssLoaders("sass-loader")
            },
            {
                test: /\.(png|jpg|jpeg|svg|gif)$/,
                use: ["file-loader"]
            },
            {
                test: /\.(ttf|woff|woff2|eot)/,
                use: ["file-loader"]
            },
            {
                test: /\.xml$/,
                use: ["xml-loader"]
            },
            {
                test: /\.csv$/,
                use: ["csv-loader"]
            }

        ]
    },
    devtool: isDev ? 'source-map' : '', // добавить карту в режиме разработки
    optimization: optimization(),
    devServer: {
        port: 8080,
        hot: isDev
    }
};