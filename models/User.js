import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    roles : {
       isAdmin: {
        type: Boolean,
        default: false,
      },
       isVendor: {
        type: Boolean,
        default: false,
      }      
    },
    // isVendor: {
    //   type: Boolean,
    //   default: false,
    // },
    // isAdmin: {
    //   type: Boolean,
    //   default: false,
    // },
    isDeleted: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
