// Project Model with image support
const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, default: 'Web Development' },
  description: { type: String, required: true },
  technologies: [{ type: String }],
  imageUrl: { type: String, default: '' },
  imageFile: { type: String, default: '' }, // Store base64 image
  liveUrl: { type: String, default: '' },
  githubUrl: { type: String, default: '' },
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});