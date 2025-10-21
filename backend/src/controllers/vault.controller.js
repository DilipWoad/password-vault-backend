import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";

const isUserHasPinGenerated = asyncHandler(async (req, res) => {
  try {
    //1)it should be verified user
    //will check is user exists for safty
    const user = req.user;
    if (!user) {
      //if not exits return error
      throw new ApiError("User does not Exixts.", 404);
    }
    //now check does pin is present or not
    if (!user.pin) {
      //if not present return res as false

      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { pinCreated: false },
            "User does not have pin created."
          )
        );
    }
    //if present return true
    return res
      .status(200)
      .json(
        new ApiResponse(200, { pinCreated: true }, "User have pin generated.")
      );
  } catch (error) {
    console.error("Error while checking does user has generated pin.");

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      "Something went wrong while checking does user has generated pin.",
      500
    );
  }
});

const generatePin = asyncHandler(async (req, res) => {
  try {
    //1)verify jwt
    //take pin from the req.body
    // const user = req.user;
    const { pin } = req.body;
    //make sure it is number and has length of 4
    if (pin.trim() === "") {
      throw new ApiError("Pin cannot be Empty.", 400);
    }
    if (pin.length > 4) {
      throw new ApiError("Pin length should be equal to 4.", 400);
    }
    //get user id using req.user
    //check user exits with giving user.id
    const user = await User.findById(req.user._id);
    if (!user) {
      throw new ApiError("User does not exists.", 404);
    }
    //now check if pin already generated
    if (user.pin) {
      throw new ApiError("Pin is Already Generated.", 400);
    }
    //if already generated reetun error
    user.pin = pin;
    await user.save();
    //if not then update the user obj
    //then save
    return res
      .status(201)
      .json(new ApiResponse(201, [], "Pin Generated Successfully."));
  } catch (error) {
    console.error("Error while generating user pin.");

    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError("Something went wrong while generating user pin.", 500);
  }
});

export { isUserHasPinGenerated, generatePin };
