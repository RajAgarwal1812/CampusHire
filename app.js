const express = require("express");

const app = express();

const sha = process.env.RENDER_GIT_COMMIT || process.env.GIT_SHA || "local";
const commit = sha.slice(0, 7);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const drives = [
  {
    company: "TCS",
    date: "2026-09-25",
  },
  {
    company: "Infosys",
    date: "2026-10-10",
  },
];

app.get("/", (req, res) => {
  const selectedMonth = req.query.month || "";

  const filteredDrives = selectedMonth
    ? drives.filter((drive) => drive.date.startsWith(selectedMonth))
    : drives;

  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>CampusHire - Placement Drive Tracker</title>
    </head>
    <body>
      <h1>CampusHire</h1>
      <h2>Placement Drive Tracker</h2>

      <form method="POST" action="/drives">
        <label>Company Name:</label>
        <input type="text" name="company" required>

        <label>Drive Date:</label>
        <input type="date" name="date" required>

        <button type="submit">Add Drive</button>
      </form>

      <h2>Filter by Month</h2>

      <form method="GET" action="/">
        <label>Select Month:</label>
        <input type="month" name="month" value="${selectedMonth}">

        <button type="submit">Filter</button>
      </form>

      <h2>Placement Drives</h2>

      <ul>
        ${
          filteredDrives.length > 0
            ? filteredDrives
                .map(
                  (drive) =>
                    `<li>${drive.company} - ${drive.date}</li>`
                )
                .join("")
            : "<li>No placement drives found for this month.</li>"
        }
      </ul>
            <footer>commit ${commit}</footer>
    </body>
    </html>
  `);
});

app.post("/drives", (req, res) => {
  const { company, date } = req.body;

  if (!company || !date) {
    return res.status(400).send("Company and date are required.");
  }

  drives.push({
    company,
    date,
  });

  res.redirect("/");
});

app.get("/api/drives", (req, res) => {
  res.json(drives);
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

module.exports = app;