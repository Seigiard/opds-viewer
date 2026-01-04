import postcssRandomFunction from "@csstools/postcss-random-function";
import postcssNesting from "postcss-nesting";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";

export default {
  plugins: [
    postcssRandomFunction(),
    autoprefixer(),
    postcssNesting({
      edition: "2021",
      noIsPseudoSelector: true,
    }),
    cssnano({
      preset: ["default", { discardComments: false }],
    }),
  ],
};
