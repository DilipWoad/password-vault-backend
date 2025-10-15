// import { generateAccessToken, generateRefreshToken } from "../constant.js";

// const registerUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (email.trim() === "") {
//       return res
//         .status(401)
//         .json({ message: "Email cannot be empty!", success: false });
//     }
//     if (password.trim() === "") {
//       return res
//         .status(401)
//         .json({ message: "Password cannot be empty!", success: false });
//     }
//     //find if email already exists
//     const userExists = await prisma.user.findUnique({
//       where: {
//         email,
//       },
//     });

//     console.log(userExists);

//     if (userExists) {
//       return res
//         .status(401)
//         .json({ message: "User email already Exists.", success: false });
//     }

//     const newUser = await prisma.user.create({
//       data: {
//         email,
//         password,
//       },
//       select: {
//         id: true,
//         email: true,
//       },
//     });
//     console.log(`{login : ${email},password : ${password}}`);

//     return res.status(200).json({
//       data: newUser,
//       message: "User register Successfully.",
//       success: true,
//     });
//   } catch (error) {
//     console.error(`error while login the User : ${error} `);
//     return res
//       .status(500)
//       .json({ error: "Could not create user", details: error.message });
//   }
// };

// const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (email.trim() === "") {
//       return res
//         .status(401)
//         .json({ message: "Email cannot be empty!", success: false });
//     }
//     if (password.trim() === "") {
//       return res
//         .status(401)
//         .json({ message: "Password cannot be empty!", success: false });
//     }
//     //find if email already exists
//     const userExists = await prisma.user.findUnique({
//       where: {
//         email,
//       },
//     });

//     if (!userExists) {
//       return res
//         .status(404)
//         .json({ message: "User email does not Exists.", success: false });
//     }

//     //exists check if password matches
//     if (userExists.password !== password) {
//       return res
//         .status(401)
//         .json({ message: "Invalid password", success: false });
//     }
//     //once both email and password matched generate refresh and access token
//     //store refresh token in the backend
//     //and store both token in cookies
//     console.log(`{login : ${email},password : ${password}}`);
//     const AccessTokenOptions = {
//       httpOnly: true,
//       secure: process.env.NODE_ENV,
//       sameSite: "None",
//       // sameSite: "Strict",
//       maxAge: 24 * 60 * 60 * 1000,
//     };
//     const RefreshTokenOptions = {
//       httpOnly: true,
//       secure: process.env.NODE_ENV,
//       sameSite: "None",
//       // sameSite: "Strict",
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//     };
//     const accessToken = await generateAccessToken(email, userExists.id);
//     const refreshToken = await generateRefreshToken(userExists.id);
//     res.cookie("accessToken", accessToken, AccessTokenOptions);
//     res.cookie("refreshToken", refreshToken, RefreshTokenOptions);
//     //
//     console.log(
//       `{Access Token : ${accessToken},Refresh Token : ${refreshToken}}`
//     );

//     const user = await prisma.user.update({
//       where: {
//         email,
//       },
//       data: {
//         refreshToken,
//       },
//       select: {
//         id: true,
//         email: true,
//       },
//     });

//     return res.status(200).json({
//       data: user,
//       message: "User login Successfully.",
//       success: true,
//     });
//   } catch (error) {
//     console.error(`error while login the User : ${error} `);
//     return res
//       .status(500)
//       .json({ error: "Could not create user", details: error.message });
//   }
// };

// const logoutUser = async (req, res) => {
//   try {
//     //verifyJwt
//     // then clear cookie
//     //also remove refresh token from the db
//     const user = req.user;
//     console.log(user);
//     if (!user) {
//       return res.status(401).json({
//         message: "Invalid api call for logout ,make sure you are logged in.",
//         success: false,
//       });
//     }

//     //remove from db
//     const userRefresh = await prisma.user.update({
//       where: {
//         id: user.id,
//       },
//       data: {
//         refreshToken: "",
//       },
//     });
//     if (!userRefresh) {
//       return res.status(500).json({
//         message: "Something went wrong while removing RefreshToken.",
//         success: false,
//       });
//     }
//     //options for cookie
//     const options = {
//       httpOnly: true,
//       sameSite: "Strict",
//       secure: true,
//     };
//     //remove from cookie
//     res
//       .status(200)
//       .clearCookie("refreshToken", options)
//       .clearCookie("accessToken", options)
//       .json({ message: "User Logout Successfully!!", data: [], success: true });
//   } catch (error) {
//     console.error(`Error while logout : ${error} `);
//     return res.status(500).json({
//       error: "Something went wrong while logout.",
//       details: error.message,
//     });
//   }
// };
// export { loginUser, registerUser, logoutUser };

const generateAcessAndRefreshTokens = async (userId) => {
  try {
    //first find user document
    const user = await User.findById(userId);
    //now we have the user document i.e -> {id,email,username,fullName etc...}

    //create access and refresh token using function created for each schema
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    //once created both add the refresh token to the database
    user.refreshToken = refreshToken;
    //now save the database
    //while saving the database will validate the schema Again
    //so dont validate
    user.save({ validateBeforeSave: false });
    //now return both Access and Refresh Token

    return { accessToken, refreshToken };
    //try to wrap around in try-catch
  } catch (error) {
    throw new ApiError("Something went wrong while generating tokens", 500);
  }
};

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";

const registerUser = asyncHandler(async (req, res) => {
  //get the info from the form comming from the body
  // console.log(req.body);
  const { email, password } = req.body;

  if (
    [email, password].some((feild) => {
      return feild === "";
    })
  ) {
    throw new ApiError("Feilds can't be empty", 400);
  }

  //check is user already in the DataBase
  const existedUser = await User.findOne({
    email,
  });
  if (existedUser) {
    throw new ApiError("User Already Exist", 409);
  }

  //Now Create A User
  const user = await User.create({
    email,
    password,
  });

  //password is bcrypt in the userModel and added their
  const userCreated = await User.findById(user._id).select("-password -refreshToken");
  //now we can send a response to user but we will remove password and refreshToken from it

  if (!userCreated) {
    throw new ApiError("Something went wrong will creating the user!!", 500);
  }

  return res
    .status(201)
    .json(new ApiResponse(201, userCreated, "User Created Successfully!!!"));
});

const loginUser = asyncHandler(async (req, res) => {
  //get login credentials from the user
  const { email, password } = req.body;

  //validate email and password
  if (email.trim() === "" || password.trim() === "") {
    throw new ApiError("Email and Password are required", 400);
  }

  //if not empty,now check if user exist or not
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError("User Not Found or Incorrect email ID", 401);
  }

  //if exist check the password is correct or not
  const isPasswordCorrect = await user.isCorrectPassword(password);
  if (!isPasswordCorrect) {
    throw new ApiError("Incorrect Password,Please Try Again!!", 401);
  }

  // If both Email and Password correct generate a refresh and access token
  // add refresh token to MongoDB and send Access token to user
  const { accessToken, refreshToken } = await generateAcessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
  //add this token to the cookie
  //and it through response

  const AccessTokenOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV,
    sameSite:
      process.env.CROSS_ORIGIN === "http://localhost:3000" ? "Strict" : "None",
    // sameSite: "Strict",
    maxAge: 24 * 60 * 60 * 1000,
  };
  const RefreshTokenOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV,
    sameSite:
      process.env.CROSS_ORIGIN === "http://localhost:3000" ? "Strict" : "None",
    // sameSite: "Strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, AccessTokenOptions)
    .cookie("refreshToken", refreshToken, RefreshTokenOptions)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
        },
        "User Logged In Successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  //for logout
  //clear the cookies make sure user is present in the body
  //also remove the refreshToken from the user schema /in database
  // make sure a valid access token can handle this logout

  //usig req.user we have user details

  const user = req.user;
  if (!user) {
    throw new ApiError("Invalid Api Call make sure you are Logged in", 401);
  }

  //if loggedin
  //clear the cookies
  //find the user in database and remove the refreshtoken
  const userRefresh = await User.findByIdAndUpdate(
    user._id,
    {
      $unset: {
        refreshToken: "",
      },
    },
    { new: true }
  );
  if (!userRefresh) {
    throw new ApiError("Somthing went wrong while updating refreshtoken", 401);
  }
  // userRefresh.save({validateBeforeSave:false});
  //now clear the cokies

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV,
    sameSite:
      process.env.CROSS_ORIGIN === "http://localhost:3000" ? "Strict" : "None",
    // sameSite: "Strict",
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(201, [], "User Logged Out Successfully!!"));
});

const refreshAccessTokens = asyncHandler(async (req, res) => {
  const receivedRefreshToken =
    req.cookies?.refreshToken || req.body?.refreshToken;

  if (!receivedRefreshToken) {
    throw new ApiError("Invalid Request: No refresh token found", 401);
  }
  console.log("receivedRefreshToken", receivedRefreshToken);
  // 1. Verify refresh token
  try {
    payload = jwt.verify(
      receivedRefreshToken,
      process.env.REFRESH_TOKEN_SECRET_KEY
    );
    console.log("payload", payload);
  } catch (error) {
    throw new ApiError("Refresh Token is invalid or expired", 403);
  }

  // 2. Find user by id from decoded payload
  const userInDatabase = await User.findById(payload._id);
  if (!userInDatabase) {
    throw new ApiError("User not found", 404);
  }

  // 3. Optional: compare refresh tokens (can skip if not storing in DB)
  if (userInDatabase.refreshToken !== receivedRefreshToken) {
    throw new ApiError("Refresh Token does not match DB", 403);
  }

  // 4. Generate new tokens
  const { accessToken, refreshToken } = await generateAcessAndRefreshTokens(
    userInDatabase._id
  );
  console.log(accessToken, refreshToken);
  // 5. Update refresh token in DB
  userInDatabase.refreshToken = refreshToken;
  await userInDatabase.save({ validateBeforeSave: false });

  // 6. Cookie options
  const isProduction = process.env.NODE_ENV === "production";

  const AccessTokenOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite:
      process.env.CROSS_ORIGIN === "http://localhost:3000" ? "Strict" : "None",
    maxAge: 24 * 60 * 60 * 1000, // 15 min
  };

  const RefreshTokenOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite:
      process.env.CROSS_ORIGIN === "http://localhost:3000" ? "Strict" : "None",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, AccessTokenOptions)
    .cookie("refreshToken", refreshToken, RefreshTokenOptions)
    .json(
      new ApiResponse(
        200,
        {
          accessToken,
          refreshToken,
        },
        "Access Token refreshed successfully"
      )
    );
});

export { loginUser, logoutUser, registerUser, refreshAccessTokens };
