const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const CssMinimizaerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
	mode: 'production', // INDICAR EL MODO EXPLICITAMENTE
	entry: './src/index.js', // el punto de entrada de mi aplicación
	output: {
		// Esta es la salida de mi bundle
		path: path.resolve(__dirname, 'dist'),
		// resolve lo que hace es darnos la ruta absoluta de el S.O hasta nuestro archivo
		// para no tener conflictos entre Linux, Windows, etc
		filename: '[name].[contenthash].js', // EL NOMBRE DEL ARCHIVO FINAL
        assetModuleFilename:'assets/images/[hash][ext]'
	},
	resolve: {
		extensions: ['.js'], // LOS ARCHIVOS QUE WEBPACK VA A LEER
        alias:{
            '@utils': path.resolve(__dirname, 'src/utils/'),
            '@templates': path.resolve(__dirname, 'src/templates/'),
            '@styles': path.resolve(__dirname, 'src/styles/'),
            '@images': path.resolve(__dirname, 'src/assets/images/'),
        }
	},
	module: {
		// REGLAS PARA TRABAJAR CON WEBPACK
		rules: [
			{
				test: /\.m?js$/, // LEE LOS ARCHIVOS CON EXTENSION .JS,
				exclude: /node_modules/, // IGNORA LOS MODULOS DE LA CARPETA
				use: {
					loader: "babel-loader",
				},
			},
			{
				test: /\.css|.styl$/i, //LEE ARCHIVOS CON EXTENSION CSS Y LA EXTENSION DE STYLUS .STYL
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader', //CREAMOS LA CONFIGURACION PAR AEL LOADER CSS
					'stylus-loader',
				],
			},
			{
				test: /\.png/,
				type: 'asset/resource',
			},
			{
				//RULE URL-LOADER PARA FONTS
				test: /\.(woff|woff2)$/,
				use: {
					loader: 'url-loader',
					options: {
						limit: 10000,
						mimetype: 'application/font-woff',
						name: '[name].[contenthash].[ext]', //RESPETA EL NOMBRE Y LA EXTENSION DE LA FUENTE
						outputPath: './assets/fonts/', //A DONDE SE VA A MOVER EL RECURSO
						publicPath: '../assets/fonts/',
						esModule: false,
					},
				},
			},
		],
	},
	// SECCION DE PLUGINS
	plugins: [
		new HtmlWebpackPlugin({
			// CONFIGURACIÓN DEL PLUGIN
			inject: true, // INYECTA EL BUNDLE AL TEMPLATE HTML
			template: './public/index.html', // LA RUTA AL TEMPLATE HTML
			filename: './index.html', // NOMBRE FINAL DEL ARCHIVO
		}),
		new MiniCssExtractPlugin({
            filename: 'assets/[name].[contenthash].css'
        }), //UTILIZACION DEL RECURSO DE CSS
		new CopyPlugin({
			patterns: [
				{
					from: path.resolve(__dirname, 'src', 'assets/images'), //MOVIENDO LA CARPETA
					to: 'assets/images',
				},
			],
		}),
        new Dotenv(),
        new CleanWebpackPlugin(),
	],
    optimization:{
        minimize: true,
        minimizer: [
            new CssMinimizaerPlugin(),//COMPRIMIR ARCHIVOS CSS FINALES
            new TerserPlugin(),//OPTIMIZA LA MINIFICACION DEL JS 
        ]
    }
};
