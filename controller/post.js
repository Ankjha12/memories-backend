const { default: mongoose } = require("mongoose");
const postMessage = require("../modals/postMessage.js");
// import postMessage from "../modals/postMessage.js";
// module.exports = getPost = (req, res) => {
//     res.send("This works from the Controller File Also");
// }

// module.exports = createPost = (req, res) => {
//     res.send("post created")
// }

const getPost = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await postMessage.findById(id);

    res.status(201).send(post);
  } catch (error) {
    console.log(error);
  }
};

const getPosts = async (req, res) => {
  // res.send("This  Works from the Controller file")
  const { page } = req.query;
  console.log(page);
  try {
    const LIMIT = 8;
    const startIndex = (Number(page) - 1) * LIMIT; // this will give us the start index on every page suppose if we are on the 3rd page then the StartIndex is 3-1*8 = 16 in this way we can paginate the whole project

    const total = await postMessage.countDocuments({});

    const posts = await postMessage
      .find()
      .sort({ _id: -1 })
      .limit(LIMIT)
      .skip(startIndex);

    res.status(201).json({
      posts,
      currentPage: Number(page),
      numberOfPages: Math.ceil(total / LIMIT),
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const createPost = async (req, res) => {
  const post = req.body;

  const newPost = new postMessage({
    ...post,
    creator: req.userId,
    createdAt: new Date().toISOString(),
  });

  try {
    await newPost.save();

    res.status(201).json(newPost);
  } catch (error) {
    res.status(409).json({ message: error.message });
    console.log("error.message");
  }
};

const updatePost = async (req, res) => {
  const { id: _id } = req.params;
  const post = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("No POst Found With this ID");
  }
  try {
    const updatePost = await postMessage.findByIdAndUpdate(_id, post, {
      new: true,
    });
    res.send(updatePost);
  } catch (error) {
    console.log(error);
  }
};

const deletePost = async (req, res) => {
  const { id: _id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("No post found with this ID");
  }

  try {
    await postMessage.findByIdAndRemove(_id);

    console.log("postDeleted");

    res.send("Post deleted Successfully");
  } catch (error) {
    console.log(error);
  }
};

const likePost = async (req, res) => {
  const { id } = req.params;

  if (!req.userId) {
    return res.json({ message: "Unauthenticated" });
  }

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  const post = await postMessage.findById(id);

  const index = post.likes.findIndex((id) => id === String(req.userId));

  if (index === -1) {
    post.likes.push(req.userId);
  } else {
    post.likes = post.likes.filter((id) => id !== String(req.userId));
  }
  const updatedLikedPost = await postMessage.findByIdAndUpdate(id, post, {
    new: true,
  });
  res.status(200).json(updatedLikedPost);
};

//QUERY --> /posts?page=1 => page=1 is query
//PARAMS --> /posts/:id => id is params

const getPostsBySearch = async (req, res) => {
  const { searchTerm, tags } = req.query;
  console.log("Searchterm==>>>>", searchTerm);
  console.log("Tags ==>> ", tags);
  try {
    const title = new RegExp(searchTerm, "i");

    console.log("Api hitted and searchTerm are", title);

    const posts = await postMessage.find({
      $or: [{ title }, { tags: { $in: tags.split(",") } }],
    });
    //in the above logic we want to say to the database that find me the title OR tags where the tag is an array so we are saying in the tag by $in: string format

    res.status(201).json({ data: posts });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

const commentPost = async (req, res) => {
  const { id } = req.params;
  const { finalComment } = req.body;
  console.log("Api hitted of commnetPost");

  try {
    const post = await postMessage.findById(id);

    post.comments.push(finalComment);

    const updatePost = await postMessage.findByIdAndUpdate(id, post, {
      new: true,
    });

    res.status(201).json(updatePost);
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

module.exports = {
  getPost,
  getPosts,
  createPost,
  updatePost,
  deletePost,
  likePost,
  getPostsBySearch,
  commentPost,
};
