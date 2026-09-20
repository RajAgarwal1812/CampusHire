const { test } = require("node:test");
const assert = require("node:assert/strict");
const app = require("../app");

test("health route returns ok", async () => {
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;

  const response = await fetch(`${base}/health`);
  const data = await response.json();

  assert.equal(response.status, 200);
  assert.equal(data.status, "ok");

  server.close();
});

test("adding a placement drive works", async () => {
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;

  const response = await fetch(`${base}/drives`, {
    method: "POST",
    body: new URLSearchParams({
      company: "Wipro",
      date: "2026-11-15",
    }),
    redirect: "manual",
  });

  assert.equal(response.status, 302);

  server.close();
});

test("invalid placement drive is rejected", async () => {
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;

  const response = await fetch(`${base}/drives`, {
    method: "POST",
    body: new URLSearchParams({
      company: "",
      date: "",
    }),
  });

  assert.equal(response.status, 400);

  server.close();
});

test("filtering placement drives by month works", async () => {
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;

  const response = await fetch(`${base}/?month=2026-09`);
  const html = await response.text();

  assert.equal(response.status, 200);
 assert.ok(html.includes("TCS"));
assert.ok(!html.includes("Infosys"));

  server.close();
});