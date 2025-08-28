const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

async function registerController(req, res) {
  const { username, password } = req.body;

  const ifUserAlreadyExists = await userModel.findOne({
    username,
  });
  if (ifUserAlreadyExists) {
    return res.status(409).json({
      message: "User  already exists",
    });
  }

  const user = await userModel.create({
    username,
    password: await bcrypt.hash(password, 10),
  });

  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET
  );
  res.cookie("token", token);

  res.status(201).json({
    message: "User Created",
    user,
  });
}

async function loginController(req, res) {
  const { username, password } = req.body;

  const user = await userModel.findOne({
    username: username,
  });
  if (!user) {
    return res.status(401).json({
      message: "user accout not found [invalid credentials]",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({
      message: "invalid password",
    });
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.cookie("token", token, {
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
  });
  res.status(200).json({
    message: "user logged in sucessfully",
  });
}

async function userController(req, res) {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({
      message: "chor",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel
      .findOne({
        _id: decoded.id,
      })
      .select("-password");

    res.status(200).json({
      message: "user data fetched sucessfully",
      user,
    });
  } catch (err) {
    return res.status(401).json({
      message: "chor - Invalid token",
    });
  }
}

module.exports = { registerController, loginController, userController };
