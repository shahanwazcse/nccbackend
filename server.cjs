const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
require("dotenv").config();


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
});
const videoSchema = new mongoose.Schema({
  title: String,
  youtubeId: String,
});

const Video = mongoose.model("Video", videoSchema);

const News = mongoose.model("News", newsSchema);
const Ad = mongoose.model("Ad", adSchema);

const Booking = mongoose.model("Booking", bookingSchema);

const Service = mongoose.model("Service", serviceSchema);


// CREATE SERVICE
app.post("/api/services", async (req, res) => {
  const service = new Service(req.body);
  await service.save();
  res.json(service);
      delete data._id; // 🔥 safety

});
// CREATE BOOKING
app.post("/api/bookings", async (req, res) => {
  try {
    const booking = new Booking(req.body);
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
  const news = new News(req.body);
  const saved = await news.save();
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
    req.body,
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
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));