const jwt = require("jsonwebtoken");

//user wnats to like a post
// we have to check whether the user is the owner of the post or not;

const auth = async (req, res, next) => {
  try {
    console.log(req.headers);
    const token = req.headers.authorization.split(" ")[1];
    const isCustomAuth = token.length < 500;

    let decodedData;

    if (token && isCustomAuth) {
      decodedData = jwt.verify(token, "test");

      req.userId = decodedData?.id;
    } else {
      decodedData = jwt.decode(token);

      req.userId = decodedData?.sub; // sub is a specific id from which goggle diffrentiate its every single user
    }

    next(); // this will send the user to the next action they perform
  } catch (error) {
    console.log(error);
  }
};

module.exports = auth;
