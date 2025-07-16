import mongoose, { mongo } from 'mongoose';
import crypto from 'crypto'
import bcrypt from 'bcrypt';
import type { HydratedDocument } from 'mongoose';
import sendVerificationEmail from '../utils/sendVerificationEmail';
import type { IUser, IUserModel } from '../types/User';

const userSchema = new mongoose.Schema<IUser, IUserModel>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    verificationToken: {
      type: String,
      default: null
    },
    vaultKeySalt: {
      type: String,
      required: true
    },
  },
  {
    timestamps: true
  }
);

// Hash before saving
userSchema.pre('save', async function(next) {
  if(!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
})

// Instance method
userSchema.methods.comparePassword = async function (candidatePassword: string) {
  return await bcrypt.compare(candidatePassword, this.password);
}

// Static login method
userSchema.statics.login = async function (email: string, password: string) {
  const user = await this.findOne({ email });
  if (!user) throw new Error('Incorrect email');

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new Error('Incorrect password');

  return user;
};

// Static signup method
userSchema.statics.signup = async function(
  email: string,
  password: string,
  vaultKeySalt: string,
  origin: string
): Promise<HydratedDocument<any>> {
   const existing = await this.findOne({ email });
   if(existing){
    throw new Error('Email already in use')
   }

   // generate verification token
   const verificationToken =  crypto.randomBytes(32).toString('hex');
   const verifyURL = `${origin}/verify-email?token=${verificationToken}&email=${encodeURIComponent(email)}`;

   await sendVerificationEmail(email, verifyURL);

   const user = new this({
    email,
    password,
    vaultKeySalt,
    verificationToken,
    isVerified: false
   });

   await user.save();
   return user;
}


export default mongoose.model<IUser, IUserModel>('User', userSchema);