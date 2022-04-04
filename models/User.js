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
    isDeleted: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true}
);

//const User = mongoose.model("User", UserSchema);

// User.init().
//   // then(() => U2.create(dup)).
//   then(() => console.log('called in init')).
//   catch(error => {
//     console.log('caught called init ');
//     console.log('errors', error);
//   });
const User = mongoose.model("User", UserSchema);
//UserSchema.indexes({ username: 1 }, { unique: true });
//UserSchema.index({username: 1, email: 1}, {unique: true});
//export default mongoose.model("User", UserSchema);
export default User;