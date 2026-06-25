const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));


console.log('Starting server...');

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/portfolio';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err.message);
  console.log('💡 Make sure MongoDB is running. For local MongoDB:');
  console.log('   1. Download from https://www.mongodb.com/try/download/community');
  console.log('   2. Install and start MongoDB service');
  console.log('   3. Or use MongoDB Atlas (cloud)');
});

// ========== MODELS ==========

// Project Model
// const projectSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   category: { type: String, default: 'Web Development' },
//   description: { type: String, required: true },
//   technologies: [{ type: String }],
//   imageUrl: { type: String, default: '' },
//   liveUrl: { type: String, default: '' },
//   githubUrl: { type: String, default: '' },
//   featured: { type: Boolean, default: false },
//   order: { type: Number, default: 0 },
//   createdAt: { type: Date, default: Date.now }
// });
// Project Model with multiple images support
const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, default: 'Web Development' },
  description: { type: String, required: true },
  technologies: [{ type: String }],
  images: [{ type: String }], // Array of base64 images
  liveUrl: { type: String, default: '' },
  githubUrl: { type: String, default: '' },
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});
// Experience Model
const experienceSchema = new mongoose.Schema({
  year: { type: String, required: true },
  title: { type: String, required: true },
  company: { type: String, required: true },
  description: { type: String, required: true },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

// Education Model
const educationSchema = new mongoose.Schema({
  year: { type: String, required: true },
  degree: { type: String, required: true },
  institution: { type: String, required: true },
  description: { type: String, required: true },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

// Skill Model
const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, default: 'Technical' },
  level: { type: Number, default: 80 },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});
// Contact Model
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
const Contact = mongoose.model('Contact', contactSchema);

// Admin Model
const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const Project = mongoose.model('Project', projectSchema);
const Experience = mongoose.model('Experience', experienceSchema);
const Education = mongoose.model('Education', educationSchema);
const Skill = mongoose.model('Skill', skillSchema);
const Admin = mongoose.model('Admin', adminSchema);

// Initialize default admin
const initAdmin = async () => {
  try {
    const adminExists = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
      await Admin.create({
        email: process.env.ADMIN_EMAIL,
        password: hashedPassword
      });
      console.log('✅ Default admin created');
      console.log(`   Email: ${process.env.ADMIN_EMAIL}`);
      console.log(`   Password: ${process.env.ADMIN_PASSWORD}`);
    }
  } catch (error) {
    console.error('Error creating admin:', error.message);
  }
};

// Initialize sample data
const initSampleData = async () => {
  try {
    // Check if projects exist
    const projectCount = await Project.countDocuments();
    if (projectCount === 0) {
      await Project.create([
        {
          title: 'FullStack Thread Clone',
          category: 'Web Application',
          description: 'A full-stack thread-based discussion platform similar to Reddit. Users can create posts, comment, and upvote content.',
          technologies: ['MongoDB', 'Express', 'React', 'Node.js', 'Socket.io'],
          featured: true
        },
        {
          title: 'SAAS Canva Website',
          category: 'Web Development',
          description: 'A SAAS platform for creating stunning designs with drag-and-drop functionality and template library.',
          technologies: ['Next.js', 'Strapi', 'Tailwind CSS', 'PostgreSQL'],
          featured: true
        },
        {
          title: 'E-Commerce Platform',
          category: 'E-Commerce',
          description: 'Full-featured e-commerce platform with product management, cart, checkout, and payment integration.',
          technologies: ['MERN Stack', 'Redux Toolkit', 'Stripe', 'JWT'],
          featured: true
        },
        {
          title: 'Portfolio Website',
          category: 'Personal',
          description: 'Modern responsive portfolio website with admin panel and dynamic content management.',
          technologies: ['React', 'Node.js', 'Express', 'MongoDB'],
          featured: true
        },
        {
          title: 'Task Management App',
          category: 'Productivity',
          description: 'Task management application with drag-and-drop, real-time updates, and team collaboration features.',
          technologies: ['React', 'Node.js', 'Socket.io', 'MongoDB'],
          featured: false
        },
        {
          title: 'Weather Dashboard',
          category: 'Utility',
          description: 'Real-time weather dashboard with interactive maps and 7-day forecasts.',
          technologies: ['React', 'OpenWeather API', 'Chart.js', 'CSS3'],
          featured: false
        }
      ]);
      console.log('✅ Sample projects added');
    }

    // Check if experiences exist
    const expCount = await Experience.countDocuments();
    if (expCount === 0) {
      await Experience.create([
        {
          year: '2023 - Present',
          title: 'Frontend Developer',
          company: 'Mindstay Technology',
          description: 'Building responsive and optimized UIs using React.js and Tailwind CSS. Collaborating with backend teams to integrate REST APIs and improve user experience by 40%.'
        },
        {
          year: '2022 - 2023',
          title: 'Frontend Developer Intern',
          company: 'Tech Solutions Pvt Ltd',
          description: 'Developed reusable React components and managed state using Redux. Implemented responsive designs and improved page load performance by 35%.'
        }
      ]);
      console.log('✅ Sample experiences added');
    }

    // Check if education exists
    const eduCount = await Education.countDocuments();
    if (eduCount === 0) {
      await Education.create([
        {
          year: '2020 - 2023',
          degree: 'Bachelor of Computer Applications (BCA)',
          institution: 'CS University, Dehradun',
          description: 'Studied core subjects like Data Structures, Web Development, Operating Systems, and Database Management. Built multiple academic projects using JavaScript and the MERN stack. Graduated with First Class Distinction.'
        },
        {
          year: '2018 - 2020',
          degree: 'Higher Secondary Education (12th)',
          institution: 'Punjab School Education Board',
          description: 'Completed higher secondary education with Computer Science, Mathematics, and Physics as major subjects. Achieved 88% aggregate.'
        }
      ]);
      console.log('✅ Sample education added');
    }

    // Check if skills exist
    const skillCount = await Skill.countDocuments();
    if (skillCount === 0) {
      await Skill.create([
        { name: 'HTML5', category: 'Frontend', level: 90 },
        { name: 'CSS3', category: 'Frontend', level: 85 },
        { name: 'JavaScript', category: 'Frontend', level: 85 },
        { name: 'React.js', category: 'Frontend', level: 80 },
        { name: 'Node.js', category: 'Backend', level: 75 },
        { name: 'Express.js', category: 'Backend', level: 75 },
        { name: 'MongoDB', category: 'Database', level: 70 },
        { name: 'Git & GitHub', category: 'Tools', level: 80 },
        { name: 'Tailwind CSS', category: 'Frontend', level: 85 },
        { name: 'REST APIs', category: 'Backend', level: 75 }
      ]);
      console.log('✅ Sample skills added');
    }
  } catch (error) {
    console.error('Error adding sample data:', error.message);
  }
};

// ========== AUTH MIDDLEWARE ==========
const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.adminId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// ========== AUTH ROUTES ==========
app.post('/api/admin/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt:', email);
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, admin: { email: admin.email } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/admin/verify', authMiddleware, (req, res) => {
  res.json({ valid: true });
});

// ========== PROJECT ROUTES ==========
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/projects/featured', async (req, res) => {
  try {
    const projects = await Project.find({ featured: true }).sort({ order: 1 }).limit(6);
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/projects', authMiddleware, async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put('/api/projects/:id', authMiddleware, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/projects/:id', authMiddleware, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// ========== CONTACT ROUTES ==========
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;
  try {
    const contact = new Contact({ name, email, message });
    await contact.save();
    console.log('📩 New contact message from:', name, '(', email, ')');
    res.json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all contact messages (admin only)
app.get('/api/contacts', authMiddleware, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Update project
app.put('/api/projects/:id', authMiddleware, async (req, res) => {
  try {
    const projectId = req.params.id;
    const updateData = req.body;
    
    console.log('Updating project:', projectId);
    console.log('Update data:', updateData);
    
    // Find and update
    const project = await Project.findByIdAndUpdate(
      projectId, 
      updateData, 
      { 
        new: true,           // Return the updated document
        runValidators: true  // Run schema validations
      }
    );
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    console.log('Project updated successfully:', project);
    res.json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(400).json({ message: error.message });
  }
});

// Mark message as read
app.put('/api/contacts/:id/read', authMiddleware, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id, 
      { read: true }, 
      { new: true }
    );
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete contact message
app.delete('/api/contacts/:id', authMiddleware, async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// ========== EXPERIENCE ROUTES ==========
app.get('/api/experiences', async (req, res) => {
  try {
    const experiences = await Experience.find().sort({ order: 1, year: -1 });
    res.json(experiences);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/experiences', authMiddleware, async (req, res) => {
  try {
    const experience = new Experience(req.body);
    await experience.save();
    res.status(201).json(experience);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put('/api/experiences/:id', authMiddleware, async (req, res) => {
  try {
    const experience = await Experience.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(experience);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/experiences/:id', authMiddleware, async (req, res) => {
  try {
    await Experience.findByIdAndDelete(req.params.id);
    res.json({ message: 'Experience deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ========== EDUCATION ROUTES ==========
app.get('/api/education', async (req, res) => {
  try {
    const education = await Education.find().sort({ order: 1, year: -1 });
    res.json(education);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/education', authMiddleware, async (req, res) => {
  try {
    const edu = new Education(req.body);
    await edu.save();
    res.status(201).json(edu);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put('/api/education/:id', authMiddleware, async (req, res) => {
  try {
    const edu = await Education.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(edu);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/education/:id', authMiddleware, async (req, res) => {
  try {
    await Education.findByIdAndDelete(req.params.id);
    res.json({ message: 'Education deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ========== SKILL ROUTES ==========
app.get('/api/skills', async (req, res) => {
  try {
    const skills = await Skill.find().sort({ order: 1, category: 1 });
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/skills', authMiddleware, async (req, res) => {
  try {
    const skill = new Skill(req.body);
    await skill.save();
    res.status(201).json(skill);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put('/api/skills/:id', authMiddleware, async (req, res) => {
  try {
    const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(skill);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/skills/:id', authMiddleware, async (req, res) => {
  try {
    await Skill.findByIdAndDelete(req.params.id);
    res.json({ message: 'Skill deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ========== CONTACT ROUTE ==========
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;
  console.log('Contact form submission:', { name, email, message });
  res.json({ success: true, message: 'Message sent successfully!' });
});

// ========== START SERVER ==========
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await initAdmin();
  await initSampleData();
  
  app.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
    console.log(`📧 Admin Login: http://localhost:${PORT}/admin (via frontend)`);
    console.log(`\n📋 API Endpoints:`);
    console.log(`   GET  /api/projects     - Get all projects`);
    console.log(`   GET  /api/experiences  - Get all experiences`);
    console.log(`   GET  /api/education    - Get all education`);
    console.log(`   GET  /api/skills       - Get all skills`);
    console.log(`   POST /api/contact      - Send contact message`);
  });
};

startServer();