import path from 'path';

/** エディタで補完を効かせるために型定義をインポート */
import { Configuration } from 'webpack';

import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

const config: Configuration = {
  mode: 'development',
  // セキュリティ対策として 'electron-renderer' ターゲットは使用しない
  target: 'web',
  node: {
    __dirname: false,
    __filename: false,
  },
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.json'],
  },
  entry: {
    // エントリーファイル
    app: './src/index.tsx',
  },
  output: {
    // バンドルファイルの出力先（ここではプロジェクト直下の 'dist' ディレクトリ）
    path: path.resolve(__dirname, 'dist'),
    // webpack@5 + electron では必須の設定
    publicPath: './',
    /**
     * エントリーセクションで名前を付けていれば [name] が使える
     * ここでは 'app.js' として出力される
     */
    filename: '[name].js',
    // 画像などのアセット類は 'assets' フォルダへ配置する
    assetModuleFilename: 'assets/[name][ext]',
  },
  module: {
    rules: [
      {
        /**
         * 拡張子 '.ts' または '.tsx' （正規表現）のファイルを 'ts-loader' で処理
         * node_modules ディレクトリは除外する
         */
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: 'ts-loader',
      },
      {
        /** 拡張子 '.css' （正規表現）のファイル */
        test: /\.css$/,
        /** use 配列に指定したローダーは *最後尾から* 順に適用される */
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
          },
        ],
      },
      {
        /** 画像やフォントなどのアセット類 */
        test: /\.(bmp|ico|gif|jpe?g|png|svg|ttf|eot|woff?2?)$/,
        /** アセット類も同様に asset/inline は使用しない */
        /** なお、webpack@5.x では file-loader or url-loader は不要になった */
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: "./src/assets", to: "./" }
      ]
    }
    ),
    new MiniCssExtractPlugin(),
    /**
     * バンドルしたJSファイルを <script></script> タグとして差し込んだ
     * HTMLファイルを出力するプラグイン
     */
    new HtmlWebpackPlugin({
      template: './src/web/index.html',
      filename: 'index.html',
      scriptLoading: 'blocking',
      inject: 'body',
      minify: false,
    }),
  ],
  /**
   * developmentモードではソースマップを付ける
   *
   * レンダラープロセスでは、ソースマップがないと
   * electron のデベロッパーコンソールに 'Uncaught EvalError' が
   * 表示されてしまうことに注意
   */
  devtool: 'inline-source-map',
};

export default config;