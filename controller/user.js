const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../modals/Usermodel");

const signIn = async (req, res) => {
  const { email, password } = req.body;

  console.log("flow reached here");
  console.log(email, password);

  try {
    // Here we are checking that the User is existing inthe database or not.because it is a signIn request then we should know whether the user is signed up adlready or not
    const existingUser = await userModel.findOne({ email });

    console.log(existingUser);

    //if the email we are finding above is not found in the database then we return status of 404 and user not found

    if (!existingUser) {
      return res
        .status(404)
        .json({ message: "No user is Found Please sign Up and Login again" });
    }

    // if the user is found in the database the we will check that whether the password entered by user is correct or not
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    // if the password is wrong the we send invalid cRdentials message back to the frontend

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // if user found send the user and token to frontend
    const token = jwt.sign(
      { email: existingUser?.email, id: existingUser._id },
      "test",
      { expiresIn: "1h" }
    );

    res.status(200).json({ result: existingUser, token });
  } catch (error) {
    res.status(500).json({ message: "Something went Wrong" });
    console.error(error);
  }
};

const signUp = async (req, res) => {
  const { email, password, confirmPassword, firstName, lastName } = req.body;

  try {
    // Here we findout the user is already signed Up or not
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Email Already exists" });
    }

    if (password !== confirmPassword)
      return res.status(404).json({ message: "passwords don't match" });

    // Now we are going to create the user in database first we have to hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    console.log("the code is reaching here ");
    console.log("Hashed Password", hashedPassword);

    const result = await userModel.create({
      email,
      password: hashedPassword,
      name: `${firstName} ${lastName}`,
    });

    // now we have to generate the token for this created user
    const token = jwt.sign({ email: result?.email, id: result?._id }, "test", {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "User Created", result, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    console.log(error);
  }
};

module.exports = {
  signIn,
  signUp,
};
