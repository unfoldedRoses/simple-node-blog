const express = require("express");
const Blog = require("./models/Blog");
var methodOverride = require("method-override");
//bring in mongoose
const mongoose = require("mongoose");

const blogRouter = require("./routes/blogs");

const app = express();

mongoose
  .connect("mongodb://localhost:27017/crubblog", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB CONNECTED"))
  .catch((err) => console.log("DB CONNECTION ERR", err));
// Catch errors

//set template engine
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

app.use(methodOverride("_method"));
//route for the index
app.get("/", async (request, response) => {
  let blog = await Blog.find();
  if (blog) {
    response.render("index", { blogs: blog });
  } else {
    response.send("oopsy daisy!");
  }
});

app.use(express.static("public"));
app.use("/blogs", blogRouter);

//listen port
app.listen(5001);
