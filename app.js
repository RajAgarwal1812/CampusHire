const express = require("express");

const app = express();

const sha =
  process.env.RENDER_GIT_COMMIT || process.env.GIT_SHA || "local";
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

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatDate(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getStatus(dateString) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [year, month, day] = dateString.split("-").map(Number);
  const driveDate = new Date(year, month - 1, day);
  driveDate.setHours(0, 0, 0, 0);

  return driveDate >= today ? "Upcoming" : "Completed";
}

app.get("/", (req, res) => {
  const selectedMonth = req.query.month || "";

  const filteredDrives = selectedMonth
    ? drives.filter((drive) => drive.date.startsWith(selectedMonth))
    : drives;

  const today = new Date();
  const currentMonth = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}`;

  const thisMonthCount = drives.filter((drive) =>
    drive.date.startsWith(currentMonth)
  ).length;

  const upcomingCount = drives.filter(
    (drive) => getStatus(drive.date) === "Upcoming"
  ).length;

  const driveCards =
    filteredDrives.length > 0
      ? filteredDrives
          .map((drive) => {
            const status = getStatus(drive.date);

            return `
              <article class="drive-card">
                <div class="drive-card-top">
                  <div>
                    <div class="company-name">${escapeHtml(
                      drive.company
                    )}</div>
                    <div class="drive-subtitle">
                      Campus Recruitment Drive
                    </div>
                  </div>

                  <span class="status-badge ${status.toLowerCase()}">
                    ${status}
                  </span>
                </div>

                <div class="drive-date">
                  <span class="date-icon">DATE</span>
                  <span>${formatDate(drive.date)}</span>
                </div>
              </article>
            `;
          })
          .join("")
      : `
        <div class="empty-state">
          <div class="empty-title">No placement drives found</div>
          <div class="empty-text">
            Try selecting a different month or add a new drive.
          </div>
        </div>
      `;

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">

      <title>CampusHire | Placement Drive Tracker</title>

      <style>
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        :root {
          --primary: #3157d5;
          --primary-dark: #2444b2;
          --primary-light: #eef2ff;
          --text: #172033;
          --muted: #6b7280;
          --border: #e5e7eb;
          --background: #f6f8fc;
          --white: #ffffff;
          --success: #16845b;
          --success-bg: #e8f7f0;
          --completed: #64748b;
          --completed-bg: #f1f5f9;
        }

        body {
          min-height: 100vh;
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
          background: var(--background);
          color: var(--text);
          line-height: 1.5;
        }

        .page-shell {
          min-height: 100vh;
        }

        .navbar {
          background: var(--white);
          border-bottom: 1px solid var(--border);
        }

        .navbar-inner {
          max-width: 1120px;
          margin: 0 auto;
          padding: 20px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          color: var(--text);
        }

        .brand-mark {
          width: 38px;
          height: 38px;
          border-radius: 11px;
          display: grid;
          place-items: center;
          background: var(--primary);
          color: white;
          font-weight: 800;
          font-size: 15px;
          letter-spacing: -0.5px;
        }

        .brand-name {
          font-size: 20px;
          font-weight: 800;
          letter-spacing: -0.5px;
        }

        .nav-label {
          font-size: 14px;
          font-weight: 600;
          color: var(--muted);
        }

        .main-content {
          max-width: 1120px;
          margin: 0 auto;
          padding: 52px 24px 40px;
        }

        .hero {
          margin-bottom: 30px;
        }

        .eyebrow {
          display: inline-flex;
          align-items: center;
          padding: 7px 12px;
          border-radius: 999px;
          background: var(--primary-light);
          color: var(--primary);
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 14px;
        }

        .hero h1 {
          font-size: clamp(34px, 5vw, 52px);
          line-height: 1.05;
          letter-spacing: -1.8px;
          margin-bottom: 14px;
        }

        .hero p {
          max-width: 650px;
          color: var(--muted);
          font-size: 17px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
          margin-bottom: 28px;
        }

        .stat-card {
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: 18px;
          padding: 22px;
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.04);
        }

        .stat-label {
          color: var(--muted);
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 8px;
        }

        .stat-value {
          font-size: 34px;
          line-height: 1;
          font-weight: 800;
          letter-spacing: -1px;
        }

        .section-card {
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 26px;
          margin-bottom: 28px;
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.04);
        }

        .section-heading {
          margin-bottom: 20px;
        }

        .section-heading h2 {
          font-size: 21px;
          letter-spacing: -0.5px;
          margin-bottom: 4px;
        }

        .section-heading p {
          color: var(--muted);
          font-size: 14px;
        }

        .drive-form {
          display: grid;
          grid-template-columns: 1.5fr 1fr auto;
          gap: 14px;
          align-items: end;
        }

        .field {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .field label {
          font-size: 13px;
          font-weight: 700;
          color: #374151;
        }

        .field input {
          width: 100%;
          height: 46px;
          border: 1px solid #d7dce5;
          border-radius: 11px;
          padding: 0 14px;
          background: #fbfcfe;
          color: var(--text);
          font: inherit;
          outline: none;
          transition:
            border-color 0.2s,
            box-shadow 0.2s;
        }

        .field input:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 4px rgba(49, 87, 213, 0.1);
          background: white;
        }

        .primary-button {
          height: 46px;
          border: 0;
          border-radius: 11px;
          padding: 0 20px;
          background: var(--primary);
          color: white;
          font: inherit;
          font-weight: 800;
          cursor: pointer;
          transition:
            background 0.2s,
            transform 0.2s;
        }

        .primary-button:hover {
          background: var(--primary-dark);
          transform: translateY(-1px);
        }

        .drives-section {
          margin-top: 4px;
        }

        .drives-header {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 18px;
        }

        .drives-header h2 {
          font-size: 24px;
          letter-spacing: -0.7px;
        }

        .filter-form {
          display: flex;
          align-items: end;
          gap: 10px;
        }

        .filter-form .field {
          min-width: 190px;
        }

        .secondary-button {
          height: 42px;
          border: 1px solid #d7dce5;
          border-radius: 10px;
          padding: 0 15px;
          background: white;
          color: var(--text);
          font: inherit;
          font-weight: 700;
          cursor: pointer;
        }

        .secondary-button:hover {
          border-color: var(--primary);
          color: var(--primary);
        }

        .drive-list {
          display: grid;
          gap: 14px;
        }

        .drive-card {
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: 18px;
          padding: 22px;
          box-shadow: 0 6px 18px rgba(15, 23, 42, 0.035);
          transition:
            transform 0.2s,
            box-shadow 0.2s,
            border-color 0.2s;
        }

        .drive-card:hover {
          transform: translateY(-2px);
          border-color: #cbd5e1;
          box-shadow: 0 12px 28px rgba(15, 23, 42, 0.08);
        }

        .drive-card-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 18px;
        }

        .company-name {
          font-size: 21px;
          font-weight: 800;
          letter-spacing: -0.5px;
        }

        .drive-subtitle {
          color: var(--muted);
          font-size: 13px;
          margin-top: 3px;
        }

        .status-badge {
          flex-shrink: 0;
          padding: 6px 10px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .status-badge.upcoming {
          color: var(--success);
          background: var(--success-bg);
        }

        .status-badge.completed {
          color: var(--completed);
          background: var(--completed-bg);
        }

        .drive-date {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 20px;
          color: #374151;
          font-size: 14px;
          font-weight: 700;
        }

        .date-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 46px;
          height: 28px;
          border-radius: 7px;
          background: var(--primary-light);
          color: var(--primary);
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.04em;
        }

        .empty-state {
          background: white;
          border: 1px dashed #cbd5e1;
          border-radius: 18px;
          padding: 42px 24px;
          text-align: center;
        }

        .empty-title {
          font-weight: 800;
          font-size: 18px;
          margin-bottom: 5px;
        }

        .empty-text {
          color: var(--muted);
          font-size: 14px;
        }

        .footer {
          max-width: 1120px;
          margin: 10px auto 0;
          padding: 22px 24px 30px;
          color: #8a94a6;
          font-size: 12px;
          display: flex;
          justify-content: space-between;
          gap: 20px;
          border-top: 1px solid var(--border);
        }

        .commit {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        }

        @media (max-width: 760px) {
          .main-content {
            padding-top: 36px;
          }

          .navbar-inner {
            padding: 16px 18px;
          }

          .nav-label {
            display: none;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .drive-form {
            grid-template-columns: 1fr;
          }

          .drives-header {
            align-items: stretch;
            flex-direction: column;
          }

          .filter-form {
            align-items: stretch;
            flex-direction: column;
          }

          .filter-form .field {
            min-width: 0;
          }

          .primary-button,
          .secondary-button {
            width: 100%;
          }

          .drive-card-top {
            flex-direction: column;
          }

          .footer {
            flex-direction: column;
          }
        }
      </style>
    </head>

    <body>
      <div class="page-shell">

        <header class="navbar">
          <div class="navbar-inner">
            <a class="brand" href="/">
              <span class="brand-mark">CH</span>
              <span class="brand-name">CampusHire</span>
            </a>

            <span class="nav-label">Placement Dashboard</span>
          </div>
        </header>

        <main class="main-content">

          <section class="hero">
            <span class="eyebrow">Campus Recruitment</span>

            <h1>Placement Drive Tracker</h1>

            <p>
              Stay updated with upcoming campus recruitment opportunities
              and keep track of important drive dates in one place.
            </p>
          </section>

          <section class="stats-grid">
            <div class="stat-card">
              <div class="stat-label">Total Drives</div>
              <div class="stat-value">${drives.length}</div>
            </div>

            <div class="stat-card">
              <div class="stat-label">This Month</div>
              <div class="stat-value">${thisMonthCount}</div>
            </div>

            <div class="stat-card">
              <div class="stat-label">Upcoming</div>
              <div class="stat-value">${upcomingCount}</div>
            </div>
          </section>

          <section class="section-card">
            <div class="section-heading">
              <h2>Add New Placement Drive</h2>
              <p>
                Add a company and its campus recruitment drive date.
              </p>
            </div>

            <form class="drive-form" method="POST" action="/drives">

              <div class="field">
                <label for="company">Company Name</label>
                <input
                  id="company"
                  type="text"
                  name="company"
                  placeholder="e.g. TCS"
                  required
                >
              </div>

              <div class="field">
                <label for="date">Drive Date</label>
                <input
                  id="date"
                  type="date"
                  name="date"
                  required
                >
              </div>

              <button class="primary-button" type="submit">
                Add Drive
              </button>

            </form>
          </section>

          <section class="drives-section">

            <div class="drives-header">
              <div>
                <h2>Placement Drives</h2>
                <p style="color: #6b7280; margin-top: 4px;">
                  Explore upcoming and completed recruitment drives.
                </p>
              </div>

              <form class="filter-form" method="GET" action="/">

                <div class="field">
                  <label for="month">Filter by Month</label>
                  <input
                    id="month"
                    type="month"
                    name="month"
                    value="${escapeHtml(selectedMonth)}"
                  >
                </div>

                <button class="secondary-button" type="submit">
                  Apply Filter
                </button>

              </form>
            </div>

            <div class="drive-list">
              ${driveCards}
            </div>

          </section>

        </main>

        <footer class="footer">
          <span>CampusHire · Placement Drive Tracker</span>
          <span class="commit">commit ${escapeHtml(commit)}</span>
        </footer>

      </div>
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