//blog routes

const express = require("express");
const Blog = require("./../models/Blog");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
var path = require("path");
global.appRoot = path.resolve(__dirname);
//define storage for the images

const storage = multer.diskStorage({
  //destination for files
  destination: function (request, file, callback) {
    callback(null, "./public/uploads/images");
  },

  //add back the extension
  filename: function (request, file, callback) {
    callback(null, Date.now() + file.originalname);
  },
});

//upload parameters for multer
const upload = multer({
  storage: storage,
  limits: {
    fieldSize: 1024 * 1024 * 3,
  },
});

router.get("/new", (request, response) => {
  response.render("new");
});

// route that handles edit view
router.get("/edit/:id", async (request, response) => {
  let blog = await Blog.findById(request.params.id);
  response.render("edit", { blog: blog });
});

//view route
router.get("/:slug", async (request, response) => {
  let blog = await Blog.findOne({ slug: request.params.slug });

  if (blog) {
    response.render("show", { blog: blog });
  } else {
    response.redirect("/");
  }
});

//route to handle updates
router.put("/:id", upload.single("image"), async (request, response) => {
  let new_image = "";
  if (request.file) {
    new_image = request.file.filename;
    try {
      await fs.unlink("public" + request.body.old_image, (err) => {
        console.log(err);
      });
    } catch (error) {
      console.log(error);
    }
  } else {
    new_image = request.body.old_image;
  }
  request.blog = await Blog.findById(request.params.id);
  console.log("reached!");
  let blog = request.blog;
  blog.title = request.body.title;
  blog.author = request.body.author;
  blog.description = request.body.description;
  blog.image = request.body.new_image;
  try {
    blog = await blog.save();
    //redirect to the view route
    response.redirect(`/blogs/${blog.slug}`);
  } catch (error) {
    console.log(error);
    response.redirect(`/seblogs/edit/${blog.id}`, { blog: blog });
  }
});

//route that handles new post
//route that handles new post
router.post("/", upload.single("image"), async (request, response) => {
  console.log(request.file);
  // console.log(request.body);
  let blog = new Blog({
    title: request.body.title,
    author: request.body.author,
    description: request.body.description,
    img: request.file.filename,
  });

  try {
    blog = await blog.save();

    response.redirect(`blogs/${blog.slug}`);
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
