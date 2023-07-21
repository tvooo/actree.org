const path = require("path");
const markdownIt = require("markdown-it");
const sass = require("sass");
const format = require("date-fns/format");
const _ = require('lodash')

const md = markdownIt({ html: true, linkify: true, typographer: true });

module.exports = function (eleventyConfig) {
  eleventyConfig.addFilter("regularDate", (dateObj) => {
    return format(dateObj, "dd.MM.yyyy");
  });
  eleventyConfig.addFilter("longDate", (dateObj) => {
    return format(dateObj, "dd LLLL yyyy");
  });
  eleventyConfig.addFilter("cloudinaryUrl", (ran) => {
    return "";
  });

  eleventyConfig.addFilter("date", (dateObj) => {
    return format(dateObj, "dd LLL yyyy");
  });
  eleventyConfig.addFilter("md", (str) => {
    // console.log(markdownIt({ html: true, linkify: true, typographer: true }).render(str))
    // return md.renderInline(str);
    console.error(md.renderInline(str))
    return md.renderInline(str)
  });

  eleventyConfig.addFilter("tagUrl", (tagSlug) => {
		return ('/entries/tag/' + tagSlug);
	});

  eleventyConfig.addFilter("sort", function (aCollection){
    // WARNING
    return _.sortBy(aCollection, 'name')
  })

  eleventyConfig.addFilter("latest10", function (entries){
    // WARNING
    return [...entries].reverse().slice(0, 10)
  })

  eleventyConfig.addFilter("entriesForTag", function (entries, tag){
    // WARNING
    // console.log(entries[0])
    // console.log(tag)
    return [...entries].reverse().filter(e => {
      if(e.data?.entrytags) {
        // console.log(e.data.entrytags)
        // return true
        return e.data.entrytags.includes(tag)
      }
      return false
    
    })
    // return entries
  })
 

  eleventyConfig.addTemplateFormats("scss");

  // Creates the extension for use
  eleventyConfig.addExtension("scss", {
    outputFileExtension: "css", // optional, default: "html"

    // `compile` is called once per .scss file in the input directory
    compile: async function (inputContent, inputPath) {
      let parsed = path.parse(inputPath);
      if (parsed.name.startsWith("_")) {
        return;
      }
      let result = sass.compileString(inputContent, {
        loadPaths: [path.resolve("styles")],
      });

      // This is the render function, `data` is the full data cascade
      return async (data) => {
        return result.css;
      };
    },
  });

  eleventyConfig.addPassthroughCopy("static");
  eleventyConfig.addPassthroughCopy("images");
};

console.log(path.resolve("styles"));
