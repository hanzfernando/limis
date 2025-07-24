import mongoose from 'mongoose';

const vaultSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: { 
      type: String,
      required: true
    },
    desc: {
      type: String,
      default: '',
    },
    ciphertext: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
      required: true, 
    },
    iv: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Vault', vaultSchema);
