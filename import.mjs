import path from "path";
import { stringify } from "yaml";
import fs from "fs-extra";
import { format, parse, parseISO } from "date-fns";
import posts from "./posts.json" assert { type: "json" };
import postcategories from "./postcategories.json" assert { type: "json" };
import users from "./users.json" assert { type: "json" };
import entries from "./entries.json" assert { type: "json" };
import tags from "./tags.json" assert { type: "json" };

const makePostFile = (post) => {
  const filename = `${post.slug}.md`;
  const category = postcategories.find(
    (c) => c._id.$oid === post.category?.$oid
  );
  const author = users.find((u) => u._id.$oid === post.author?.$oid);
  const meta = {
    layout: "post",
    tags: post.state === "published" ? ["blog"] : [],
    title: post.title,
    // state: post.state,
    slug: post.slug,
    brief: post.content.brief,
    image: post.image?.secure_url,
    imageCredit: post.imageCredit.md,
    category: category?.name || "",
    author: {
      name: author.name,
      bio: author.bio,
      avatar: author.avatar?.secure_url,
    },
  };
  if (post.state === "published") {
    console.log(post.publishedDate.$date);
    meta.date = format(parseISO(post.publishedDate.$date), "yyyy-MM-dd");
    // meta.date = post.publishedDate.$date
  }
  const content = `---
${stringify(meta)}---

${post.content.extended.md}`.replace("\r", "");
  return [filename, content];
};

const getTags = (entry) => {
  return entry.tags.map(tag => {
    return tags.find(t => t._id.$oid === tag.$oid)
  }).filter(Boolean).map(t => t.name)
}

const makeEntryFile = (entry) => {
  const filename = `${entry.slug}.md`;

  const meta = {
    layout: "entry",
    title: entry.title,
    website: entry.url,
    image: entry.image?.secure_url ? entry.image?.secure_url : entry.oldImage ? entry.oldImage : undefined,
    tags: [entry.state === "published" && 'entry'].filter(Boolean),
    entrytags: getTags(entry)
  }
  meta.date = entry.publishedDate
  if(meta.date.length === 8) {
    meta.date = format(parse(entry.publishedDate, "dd.MM.yy", new Date()), "yyyy-MM-dd");
  }
  if (typeof meta.date === "object") {
    // console.log(post.publishedDate.$date);
    meta.date = format(parseISO(entry.publishedDate.$date), "yyyy-MM-dd");
    // meta.date = post.publishedDate.$date
  }
  console.log(meta.date)

  const content = `---
${stringify(meta)}---

${entry.description.md}`.replace("\r", "");

  return [filename, content];
};

posts.forEach((post) => {
  console.log("Creating blog post", post.title);
  const [filename, content] = makePostFile(post);
  fs.outputFileSync(path.join("blog", filename), content);
});

entries.forEach((entry) => {
  console.log("Creating entry", entry.title);
  const [filename, content] = makeEntryFile(entry);
  fs.outputFileSync(path.join("entries", filename), content);
});

fs.outputFileSync(path.join("_data", "tagswithentries.json"), JSON.stringify(tags));
