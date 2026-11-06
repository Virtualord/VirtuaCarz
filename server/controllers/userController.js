import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";

// Register
export const register = async (req, res) => {
  try {
    const { uname, email, password, phone } = req.body;

    // Validation
    if (!uname || !email || !password || !phone) {
      return res.status(400).send({
        success: false,
        message: "Please provide all fields",
      });
    }

    // Check existing user
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.status(409).send({
        success: false,
        message: "User already exists",
      });
    }

    // Generate salt
    const salt = await bcrypt.genSalt(10);

    // Hash password
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = new userModel({
      uname,
      email,
      password: hashedPassword,
      phone,
    });

    // Save user
    await user.save();

    // Don't send password in response
    user.password = undefined;

    return res.status(201).send({
      success: true,
      message: "User created successfully",
      user,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).send({
      success: false,
      message: "Error in register",
      error: error.message,
    });
  }
};


// login
export const login = async (req, res) => {
  try {
    const {email, password} = req.body
    if (!email || !password) {
      return res.status(500).send({
        success: false,
        message: "Please add email or password"
      })
    }
    // find user
    const user = await userModel.findOne({email})
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Invalid Credentials"
      })
    }
    // Password check
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch) {
      return res.status(500).send({
        success: false,
        message: "Invalid Credentials"
      })
    }
    // token
    const token = JWT.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    user.password = undefined
    res.status(200).send({
      success: true,
      message: "Login Successfully",
      token,
      user,
    })

  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Login",
      error,
    })
  }
}

// Update User 
export const updateUser = async (req, res) => {
  try {
    const {id} = req.params
    if (!id) {
      return res.status(404).send({
        success: false,
        message: "User not found"
      })
    }
    const data = { ...req.body };

    // Hash password if user is updating it
    if (data.password) {
      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(data.password, salt);
    }

    const user = await userModel.findByIdAndUpdate(
      id,
      { $set: data },
      { returnDocument: "after" }
    );

    // Don't send password in response
    user.password = undefined;

    res.status(200).send({
      success: true,
      message: "User has been updated",
      user,
    });


  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Update API",
      error,
    });
  }
}

// Get current user
export const getUser = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "User fetched successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in get user API",
      error,
    });
  }
}