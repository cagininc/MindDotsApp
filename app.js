const express = require("express");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();
const bcrypt=require("bcrypt")
const saltRounds = 10
const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.SECRET_KEY;
const nodemailer=require('nodemailer')





const transporter = nodemailer.createTransport({
    host: 'smtp.mailersend.net', 
    port: 587, 
    secure: false, 
    auth: {
      user: process.env.SMTP_USERNAME, 
      pass: process.env.SMTP_PASSWORD
    },
  });



mongoose.set("strictQuery", false);
 
const uri = process.env.MONGO_URI;
mongoose.connect(uri, { dbName: "SocialDB" });

const User = mongoose.model("User", {
  username: String,
  email: String,
  password: String,
});
const Post = mongoose.model("Post", {
  userId: mongoose.Schema.Types.ObjectId,
  text: String,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);
//Authentication
function authenticateJWT(req, res, next) {
  const token = req.session.token;

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

function requireAuth(req, res, next) {
  const token = req.session.token;

  if (!token) return res.redirect("/login");

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.redirect("/login");p
  }
}
//hero image
app.use('/images', express.static(path.join(__dirname, 'images')));
//html routes
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "public", "index.html"))
);
app.get("/register", (req, res) =>
  res.sendFile(path.join(__dirname, "public", "register.html"))
);
app.get("/login", (req, res) =>
  res.sendFile(path.join(__dirname, "public", "login.html"))
);
app.get("/post", requireAuth, (req, res) =>
  res.sendFile(path.join(__dirname, "public", "post.html"))
);
app.get("/index", requireAuth, (req, res) =>
  res.sendFile(path.join(__dirname, "public", "index.html"), {
    username: req.user.username,
  })
);


//Register
app.post("/register", async (req, res) => {
    const { username, email, password } = req.body;
  
    try {
      const existingUser = await User.findOne({ $or: [{ username }, { email }] });
  
      if (existingUser)
        return res.status(400).json({ message: "User already exists" });
  
      // Using Bcrypt
      const hashedPassword = await bcrypt.hash(password, saltRounds);
  
      const newUser = new User({ username, email, password: hashedPassword });
      await newUser.save();
  
      // E-mail sending process
      const mailOptions = {
        from: process.env.SMTP_USERNAME, 
        to: email, 
        subject: "Welcome to MindDots",
        html: `
            <h1>Welcome, ${username}!</h1>
            <p>Your registration has been successfully completed.</p>
            <p>You can click the button below to log in:</p>
            <a href="${process.env.SMTP_LINK}" style="display: inline-block; padding: 10px 20px; background-color: #0099ff; color: white; text-decoration: none; border-radius: 5px;">Log In</a>
            <p>"Fill your paper with the breathings of your heart." — William Wordsworth</p>
        `,
    };

    // E-posta gönder
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Failed to send email:", error);
            return res.status(500).json({ message: "Failed to send email" });
        }
        // console.log("Email sent:", info.response);
    });
      const token = jwt.sign(
        { userId: newUser._id, username: newUser.username },
        SECRET_KEY,
        { expiresIn: "1h" }
      );
      req.session.token = token;
  
      // Success
      res.send(`<h1>The user ${username} has been successfully registered!</h1>
                <p>Please check your email for confirmation.</p>
                <script>setTimeout(function() { window.location.href = '/login'; }, 3800);</script>`);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
//Login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {

    const user = await User.findOne({ username,});

    if (!user) return res.status(401).json({ message: "Invalid credentials" });

const isPasswordValid=await bcrypt.compare(password,user.password)

if(!isPasswordValid)
    return res.status(401).json({message:"Invalid password"})

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      SECRET_KEY,
      { expiresIn: "1h" }
    );
    req.session.token = token;

    
    res.json({token,username:user.username})
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

//Reads DB FOR POSTS

 app.get("/posts", authenticateJWT, async (req, res) => {
    try {
        const{page=1,limit=4}=req.query;// acording to querry
        const skip=(page-1)*limit;

        const posts = await Post.find({ userId: req.user.userId })
        .skip(skip) 
        .limit(parseInt(limit)); //limit
     const totalPosts=await Post.countDocuments({userId:req.user.userId})
      res.json({posts,totalPosts});
     } catch (error) {
      console.error(error);
       res.status(500).json({ message: "Error retrieving posts" });
    }
  });
  




// ADD NEW POST
app.post("/posts", authenticateJWT, async (req, res) => {
  const { text } = req.body;

  if (!text || typeof text !== "string")
    return res
      .status(400)
      .json({ message: "Please provide valid post content" });

  const newPost = new Post({ userId: req.user.userId, text });
  //post.push(newPost);
  try{
await newPost.save();//DB
// res.status(201).json({ message: "Post created successfully" });
res.status(201).json({ message: "Post created successfully", post: newPost });

}

catch(error){res.status(500).json({message:"Error creating post"})}


  
});
//MODİFY
app.put("/posts/:postId", authenticateJWT, async (req, res) => {
    try {
      const postId = req.params.postId;
      const { text } = req.body;
  
      // Validate postId format
      if (!mongoose.isValidObjectId(postId)) {
        return res.status(400).json({ message: "Invalid post ID format" });
      }
  
      const post = await Post.findById(postId); // Find post by ID using Mongoose
  
      // Check if the post exists and if the user is authorized to edit it
      if (!post || post.userId.toString() !== req.user.userId) {
        return res.status(404).json({ message: "Post not found or unauthorized" });
      }
  
      // Update the post text
      post.text = text;
      await post.save(); // Save updated post
  
      res.json({
        message: "Post updated successfully",
        updatedPost: post,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "An error occurred" });
    }
  });
  
//DELETE
app.delete("/posts/:postId", authenticateJWT, async (req, res) => {
    const postId = req.params.postId; 
  
    try {
      //find user post
      const post = await Post.findOne({ _id: postId, userId: req.user.userId });
  
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
  
      //delete from db
      await Post.findByIdAndDelete(postId);
  
      res.json({ message: "Post deleted successfully", deletedPost: post });
    } catch (error) {
      console.error("Error deleting post:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  //Logout 
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) console.error(err);
    res.redirect("/");
  });
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
