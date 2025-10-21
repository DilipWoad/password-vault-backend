import mongoose from "mongoose";
import bcrypt from "bcrypt"; 
const vaultSchema = new mongoose.Schema(
  {

    user :{
      type:mongoose.Schema.ObjectId,
      ref:"User"
    },
    title: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    note: {
      type: String,
    },
  },
  { timestamps: true }
);

vaultSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  //call a function that takes the user send password
  //and encrpty it
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export const Vault = mongoose.model("vault", vaultSchema);
