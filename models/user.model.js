import mongoose ,{Schema} from 'mongoose';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    role: {
      type: Number,
      default: 0,
    },
    refreshToken: {
        type: String,

    }
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
    // only hash the password if it has been modified (or is new)
    if (!this.isModified("password")) return next();

    try {
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
        next();
    } catch (error) {
        return next(error);
    }
});



userSchema.methods.isPasswordValid = async function(password){
    // console.log('Plain text password:', password);
    // console.log('Hashed password:', this.password);
    return await bcrypt.compare(password , this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id:this._id,
            name:this.name,
            email:this.email
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: "1d"
        }
    )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id:this._id,
            name:this.name,
            email:this.email
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: "10d"
        }
    )
}
const User = mongoose.model('User', userSchema);

export default User;
