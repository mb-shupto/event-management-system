import express from "express";
import cors from "cors";
const app = express();
const port = 3001;

app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

let events = [
  {
    id: 1,
    title: "AI Revolution Seminar",
    type: "seminar",
    date: "2025-08-01",
    time: "10:00 AM - 12:00 PM",
    location: "Main Auditorium, Dhaka University",
    description: "Explore the future of AI technology.",
    organizer: "AI Club",
  },
  {
    id: 2,
    title: "Campus Music Fest",
    type: "music show",
    date: "2025-08-10",
    time: "6:00 PM - 9:00 PM",
    location: "Open Ground, Campus",
    description: "Live performances by local bands.",
    organizer: "Music Society",
  },
];

let myEvents = {}; // Store events per userId (mock in-memory storage)

app.get("/api/events", (req, res) => {
  res.json(events);
});

app.get("/api/events/:id", (req, res) => {
  const event = events.find((e) => e.id === parseInt(req.params.id));
  if (event) res.json(event);
  else res.status(404).json({ message: "Event not found" });
});

app.post("/api/events", (req, res) => {
  const newEvent = {
    id: events.length + 1,
    ...req.body,
  };
  events.push(newEvent);
  res.status(201).json(newEvent);
});

app.put("/api/events/:id", (req, res) => {
  const index = events.findIndex((e) => e.id === parseInt(req.params.id));
  if (index !== -1) {
    events[index] = { ...events[index], ...req.body };
    res.json(events[index]);
  } else {
    res.status(404).json({ message: "Event not found" });
  }
});

app.delete("/api/events/:id", (req, res) => {
  const index = events.findIndex((e) => e.id === parseInt(req.params.id));
  if (index !== -1) {
    events.splice(index, 1);
    res.status(204).send();
  } else {
    res.status(404).json({ message: "Event not found" });
  }
});

app.post("/api/my-events", (req, res) => {
  const { eventId, userId } = req.body;
  if (!eventId || !userId) {
    return res.status(400).json({ message: "eventId and userId are required" });
  }
  if (!myEvents[userId]) myEvents[userId] = new Set();
  myEvents[userId].add(eventId);
  res.status(201).json({ message: "Event added to My Events", eventId, userId });
});

app.get("/api/my-events", (req, res) => {
  const userId = req.query.userId ? parseInt(req.query.userId) : 1;
  const userEvents = myEvents[userId] ? Array.from(myEvents[userId]) : [];
  const eventsList = userEvents.map((id) => events.find((e) => e.id === id)).filter(Boolean);
  res.json(eventsList);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});