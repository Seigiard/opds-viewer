import postcssRandomFunction from "@csstools/postcss-random-function";
import postcssNesting from "postcss-nesting";
import postcssPseudoClasses from "postcss-pseudo-classes";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";

export default {
  plugins: [
    postcssRandomFunction(),
    autoprefixer(),
    postcssNesting(),
    postcssPseudoClasses({
      restrictTo: ["focus", "hover"],
    }),
    cssnano({
      preset: ["default", { discardComments: false }],
    }),
  ],
};
