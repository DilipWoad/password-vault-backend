import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Vault } from "../models/vault.model.js";
import mongoose from "mongoose";

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

const isPinCorrect = asyncHandler(async (req, res) => {
  //verify jwt
  //then we will recevied pin from body
  const { pin } = req.body;
  console.log("pin chk in backend",pin)
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError("User does not exists.", 404);
  }

  const userPin = await user.isCorrectPin(pin);
  if (!userPin) {
    return res.status(200).json(new ApiResponse(200, false, "In-correct Pin"));
  }
  return res.status(200).json(new ApiResponse(200, true, "Correct Pin"));
});

const createVault = asyncHandler(async (req, res) => {
  try {
    //1) verify jwt auth
    //2) check the fields are not empty
    //3) notes can be empty
    // console.log("This is what req body looks :", req);
    const { title, username, password, url, note } = req.body;
    if (
      title.trim() === "" ||
      username.trim() === "" ||
      password.trim() === "" ||
      url.trim() === ""
    ) {
      throw new ApiError(
        "Fields title/username/password and url can't be empty."
      );
    }
    const vault = await Vault.create({
      user: req.user._id,
      title,
      username,
      password,
      url,
      note,
    });

    if (!vault) {
      throw new ApiError("Something went wrong while creating the vault.");
    }

    return res
      .status(201)
      .json(new ApiResponse(201, vault, "Vault created Successfully."));
  } catch (error) {
    console.error("Error while creating the vault.");

    if (error instanceof Error) {
      throw error;
    }

    throw new ApiError("Something went wrong while creating the vault.");
  }
});

const editVault = asyncHandler(async (req, res) => {
  //only verified user
  //we receive data from body and vault id from params
  //chck if id is vaild
  //then chk if vault exists with current userid
  //check if all fields except note is empty or not
  // then updates the vault with new values
  // then .save()
  try {
    const { vaultId } = req.params;
    const { title, username, password, url, note } = req.body;
    if (!mongoose.isValidObjectId(vaultId)) {
      throw new ApiError("Invalid vault Id.");
    }
    if (
      title.trim() === "" ||
      username.trim() === "" ||
      password.trim() === "" ||
      url.trim() === ""
    ) {
      throw new ApiError("Title/Username/Password and Url can't be empty");
    }

    const vault = await Vault.findOne({
      user: req.user._id,
      _id: vaultId,
    });

    if (!vault) {
      throw new ApiError("Vault does not Exists.");
    }

    vault.title = title;
    vault.username = username;
    vault.password = password;
    vault.url = url;
    vault.note = note;

    await vault.save();
    return res
      .status(200)
      .json(new ApiResponse(200, vault, "Vault updated successfully"));
  } catch (error) {
    console.error("Error while editing the vault.");

    if (error instanceof Error) {
      throw error;
    }

    throw new ApiError("Something went wrong while editing the vault.");
  }
});

const deleteVault = asyncHandler(async (req, res) => {
  try {
    const { vaultId } = req.params;
    if (!mongoose.isValidObjectId(vaultId)) {
      throw new ApiError("Invalid vault Id.");
    }

    const vault = await Vault.findOne({
      user: req.user._id,
      _id: vaultId,
    });

    if (!vault) {
      throw new ApiError("Vault does not Exists.");
    }

    await Vault.findByIdAndDelete(vaultId);

    return res
      .status(200)
      .json(new ApiResponse(200, [], "Vault deleted successfully"));
  } catch (error) {
    console.error("Error while deleting the vault.");

    if (error instanceof Error) {
      throw error;
    }

    throw new ApiError("Something went wrong while deleting the vault.");
  }
});

const getUserVault = asyncHandler(async (req, res) => {
  try {
    const user = req.user;

    const userVault = await Vault.find({
      user: user._id,
    });

    if (!userVault) {
      throw new ApiError(
        "Something went wrong while getting user password vaults."
      );
    }
    return res
      .status(200)
      .json(
        new ApiResponse(200, userVault, "User vault fetched successfully.")
      );
  } catch (error) {
    console.error("Error while getting user password vaults.");

    if (error instanceof Error) {
      throw error;
    }

    throw new ApiError(
      "Something went wrong while getting user password vaults."
    );
  }
});

export {
  isUserHasPinGenerated,
  generatePin,
  createVault,
  getUserVault,
  editVault,
  deleteVault,
  isPinCorrect
};
