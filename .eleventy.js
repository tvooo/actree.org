const path = require('path')
const sass = require("sass");
const format = require("date-fns/format");

module.exports = function(eleventyConfig) {
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return format(dateObj, "dd LLL yyyy");
  });
  eleventyConfig.addFilter("longDate", (dateObj) => {
    return format(dateObj, "dd LLLL yyyy");
  });
  eleventyConfig.addFilter("cloudinaryUrl", (ran) => {
    return ""
  });

  eleventyConfig.addFilter("date", (dateObj) => {
    return format(dateObj, "dd LLL yyyy");
  });
  
  eleventyConfig.addTemplateFormats("scss");

  // Creates the extension for use
  eleventyConfig.addExtension("scss", {
    outputFileExtension: "css", // optional, default: "html"

    // `compile` is called once per .scss file in the input directory
    compile: async function(inputContent, inputPath) {
      let parsed = path.parse(inputPath);
      if(parsed.name.startsWith("_")) {
        return;
      }
      let result = sass.compileString(inputContent, { loadPaths: [path.resolve("styles")]});

      // This is the render function, `data` is the full data cascade
      return async (data) => {
        return result.css;
      };
    }
  });
};

console.log(path.resolve("styles"))