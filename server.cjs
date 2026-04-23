const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors({
  origin: "*"
}));
app.use(express.json());
require("dotenv").config();
const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);
// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log(err));
// Schema
const serviceSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  icon: String,
  color: String,
});
const bookingSchema = new mongoose.Schema({
  name: String,
  phone: String,
  serviceId: String,
  serviceName: String,
  price: Number,
  date: String,
  time: String,
  createdAt: String,
  status: String,
  bookingId: String,
});

const adSchema = new mongoose.Schema({
  title: String,
  subtitle: String,
  image: String,
  link: String,
  color: String,
});
const newsSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: String,
  category: String,
  link: String, // ✅ ADD THIS
});

const videoSchema = new mongoose.Schema({
  title: String,
  youtubeId: String,
});
const adminSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  resetToken: String, // ✅ ADD THIS
});
const counterSchema = new mongoose.Schema({
  name: String,
  seq: Number,
});

const Counter = mongoose.model("Counter", counterSchema);

const Admin = mongoose.model("Admin", adminSchema);

const Video = mongoose.model("Video", videoSchema);

const News = mongoose.model("News", newsSchema);
const Ad = mongoose.model("Ad", adSchema);

const Booking = mongoose.model("Booking", bookingSchema);

const Service = mongoose.model("Service", serviceSchema);
async function getNextSequence(name) {
  const counter = await Counter.findOneAndUpdate(
    { name },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
}

// CREATE SERVICE
app.post("/api/services", async (req, res) => {
  const data = { ...req.body };
  delete data._id;

  const service = new Service(data);
  const saved = await service.save();

  res.json(saved);
});
// CREATE BOOKING
app.post("/api/bookings", async (req, res) => {
  try {
const seq = await getNextSequence("booking");

const bookingId = `NISAR/${seq}`;

const booking = new Booking({
  ...req.body,
  bookingId,
});
    const saved = await booking.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET SERVICES
app.get("/api/services", async (req, res) => {
  const services = await Service.find();
  res.json(services);
});

// DELETE SERVICE
app.delete("/api/services/:id", async (req, res) => {
  await Service.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// GET BOOKING BY ID
app.get("/api/bookings/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET ALL BOOKINGS
app.get("/api/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/bookings/:id", async (req, res) => {
  const updated = await Booking.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );
  res.json(updated);
});


app.delete("/api/bookings/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid booking ID" });
    }

    const deleted = await Booking.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({ message: "Booking deleted successfully", deleted });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// CREATE AD
app.post("/api/ads", async (req, res) => {
  const ad = new Ad(req.body);
  const saved = await ad.save();
  res.json(saved);
});

// GET ALL ADS
app.get("/api/ads", async (req, res) => {
  const ads = await Ad.find();
  res.json(ads);
});

// DELETE AD
app.delete("/api/ads/:id", async (req, res) => {
  await Ad.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

app.put("/api/ads/:id", async (req, res) => {
  const updated = await Ad.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
});
// CREATE NEWS
app.post("/api/news", async (req, res) => {
  console.log("REQ BODY:", req.body); // 🔍 debug

  const news = new News({
    title: req.body.title,
    description: req.body.description,
    date: req.body.date,
    category: req.body.category,
    link: req.body.link || "", // ✅ FORCE SAVE LINK
  });

  const saved = await news.save();

  console.log("SAVED:", saved); // 🔍 debug

  res.json(saved);
});
// GET ALL NEWS
app.get("/api/news", async (req, res) => {
  const news = await News.find().sort({ date: -1 });
  res.json(news);
});

// DELETE NEWS
app.delete("/api/news/:id", async (req, res) => {
  await News.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// UPDATE NEWS
app.put("/api/news/:id", async (req, res) => {
  const updated = await News.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      description: req.body.description,
      date: req.body.date,
      category: req.body.category,
      link: req.body.link || "", // ✅ ALSO HERE
    },
    { new: true }
  );

  res.json(updated);
});
// CREATE VIDEO
app.post("/api/videos", async (req, res) => {
  const video = new Video(req.body);
  const saved = await video.save();
  res.json(saved);
});

// GET ALL VIDEOS
app.get("/api/videos", async (req, res) => {
  const videos = await Video.find();
  res.json(videos);
});

// DELETE VIDEO
app.delete("/api/videos/:id", async (req, res) => {
  await Video.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});


const bcrypt = require("bcryptjs");

app.post("/api/admin/login", async (req, res) => {
  const { username, password } = req.body;

  const admin = await Admin.findOne({ username });
  if (!admin) return res.status(404).json({ error: "User not found" });

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) return res.status(400).json({ error: "Wrong password" });

  res.json({ message: "Login successful" });
});

const nodemailer = require("nodemailer");

app.post("/api/admin/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ error: "Email not found" });
    }

    const resetToken = Math.random().toString(36).substring(2);

    admin.resetToken = resetToken;
    await admin.save();

    const resetLink = `http://nisardigitalhub.netlify.app/reset-password/${resetToken}`;

    // ✅ SEND EMAIL USING RESEND
    await resend.emails.send({
      from: "onboarding@resend.dev", // default works
      to: email,
      subject: "Reset Password",
      html: `<h2>Password Reset</h2>
             <p>Click below to reset your password:</p>
             <a href="${resetLink}">${resetLink}</a>`,
    });

    res.json({ message: "Reset link sent successfully" });

  } catch (err) {
    console.error("RESEND ERROR:", err);
    res.status(500).json({ error: "Email sending failed" });
  }
});

app.post("/api/admin/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const admin = await Admin.findOne({ resetToken: token });

    if (!admin) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    const bcrypt = require("bcryptjs");

    const hashed = await bcrypt.hash(password, 10);

    admin.password = hashed;
    admin.resetToken = undefined;

    await admin.save();

    res.json({ message: "Password updated successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));