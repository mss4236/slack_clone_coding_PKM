import path from 'path';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import webpack, {Configuration as WebpackConfiguration} from 'webpack';
import {Configuration as WebpackDevServerConfiguration} from 'webpack-dev-server';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';

interface Configuration extends WebpackConfiguration {
    devServer? : WebpackDevServerConfiguration;
}

const isDevelopment = process.env.NODE_ENV !== 'production';

const config: Configuration = {
    name: 'sleack',
    mode: isDevelopment ? 'development' : 'production',
    devtool: isDevelopment ? 'hidden-source-map' : 'eval',
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
        alias: {
            '@hooks': path.resolve(__dirname, 'hooks'),
            '@components': path.resolve(__dirname, 'components'),
            '@layouts': path.resolve(__dirname, 'layouts'),
            '@pages': path.resolve(__dirname, 'pages'),
            '@utils': path.resolve(__dirname, 'utils'),
            '@typings': path.resolve(__dirname, 'typings'),
        },
    },
    entry: {
        app: './client',
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'babel-loader',
                options: {
                    presets: [
                        [
                            '@babel/preset-env',
                            {
                                targets: { browsers: ['IE 10']},
                                debug: isDevelopment,
                            },
                        ],
                        '@babel/preset-react',
                        '@babel/preset-typescript',
                    ],
                    env: {
                        development: {
                            plugins: [['@emotion', { sourceMaps: true}], require.resolve('react-refresh/babel')],
                        },
                        production: {
                            plugins: ['@emotion']
                        }
                    },
                },
                exclude: path.join(__dirname, 'node_modules'),
            },
            {
                test: /\.css?$/,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    plugins: [
        new ForkTsCheckerWebpackPlugin({    // ts랑 webpack이랑 동시에 돌아가게 해줌. 원래 ts검사할때 blocking식으로 함
            async: false,
            // eslint: {
            //     files: "./src/**/*",
            // },
        }),
        new webpack.EnvironmentPlugin({ NODE_ENV: isDevelopment ? 'development' : 'production' }),  // process.env.NODE_ENV 같은거는 back에서만(정확히는 node runtime) 사용가능한데 그거를 front에서 사용가능하게 해줌
    ],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js',  // [name]은 entry의 app: './client'에서 app // 여러개를 만들수 있음 app: './client', app2: './client' 하면 결과물이 app.js , app2.js 이렇게 2개나옴
        publicPath: '/dist/',
    },
    devServer: {
        historyApiFallback: true, // react-router할때 필요한 설정
        port: 3090,
        devMiddleware: { publicPath: '/dist/'},
        static: { directory: path.resolve(__dirname) },
        proxy: {    // front에서 cors 문제 해결할때 (front랑 back 둘다 localhost일때나 쓸수있음)
            '/api/': {  // /api/ 로 시작하면
                target: 'http://localhost:3095',    // 3095에서 요청을 보낸거처럼 한다
                changeOrigin: true,
            }
        }
    },
};

if(isDevelopment && config.plugins) {
    config.plugins.push(new webpack.HotModuleReplacementPlugin());
    config.plugins.push(new ReactRefreshWebpackPlugin());
    //config.plugins.push(new BundleAnalyzerPlugin({ analyzerMode: 'server', openAnalyzer: false}));
}
if(!isDevelopment && config.plugins){
    config.plugins.push(new webpack.LoaderOptionsPlugin({ minimize: true }));
    //config.plugins.push(new BundleAnalyzerPlugin({ analyzerMode: 'static' }));
}

export default config;