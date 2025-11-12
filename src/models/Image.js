import mongoose from 'mongoose';

const ImageSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  prompt: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  public: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for faster queries
ImageSchema.index({ userId: 1, public: 1 });
ImageSchema.index({ public: 1, createdAt: -1 });

export default mongoose.models.Image || mongoose.model('Image', ImageSchema);
