const express = require("express");
const server = express();
const projects = [];

server.use(express.json());

// Middlewares
function checkIdExists(req, res, next) {
  const { id } = req.params;

  const project = projects.find(_project => _project.id === id);
  if (!project) {
    return res.status(400).json({ error: "ID not found." });
  }
  req.id = id;
  return next();
}
function requestLog(req, res, next) {
  console.count("Requisições: ");
  return next();
}
server.use(requestLog);

server.post("/projects", (req, res) => {
  const data = req.body;

  projects.push(data);

  return res.json(projects);
});

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.put("/projects/:id", checkIdExists, (req, res) => {
  const { title } = req.body;

  const project = projects.find(_project => _project.id === req.id);
  project.title = title;

  return res.json(projects);
});

server.delete("/projects/:id", checkIdExists, (req, res) => {
  const project = projects.findIndex(_project => _project.id === req.id);
  projects.splice(project, 1);

  return res.send();
});

server.post("/projects/:id/tasks", checkIdExists, (req, res) => {
  const { title } = req.body;

  const project = projects.find(_project => _project.id === req.id);
  project.tasks.push(title);

  return res.json(project);
});

server.listen("3000");
