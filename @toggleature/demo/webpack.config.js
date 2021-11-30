module.exports = {
  mode: "development",
  resolve: {
    extensions: [".js", ".json", ".jsx", ".ts", ".tsx"],
  },
  module: {
    rules: [
      {
        test: /\.[j|t]sx?$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};
