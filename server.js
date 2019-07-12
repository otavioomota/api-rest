const express = require("express");

const server = express();
server.use(express.json());

const projects = [];
let counter = 0;

//Middlewares

//Count how many requets have been made

function counterRequest(req, res, next) {
  counter++;
  console.log(counter);
  return next();
}
//Check if the project exists
function checkProjectExists(req, res, next) {
  const { id } = req.params;

  const projectExists = projects.find(project => project.id == id);

  if (!projectExists) {
    return res.status(400).json({ error: "Project do not exist " });
  }

  return next();
}

server.use(counterRequest);

// List all projects
server.get("/", (req, res) => res.json(projects));

//Create a new Project
server.post("/projects", (req, res) => {
  const { id, title } = req.body;
  const newProject = {
    id,
    title,
    tasks: []
  };
  projects.push(newProject);

  return res.json(newProject);
});

//Update the project's title
server.put("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;

  const updatedProject = projects.find(project => project.id == id);
  updatedProject.title = req.body.title;

  return res.json(updatedProject);
});

// Delete a project finding by ID
server.delete("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.body;

  const deletedProjectIndex = projects.findIndex(project => project.id == id);

  projects.splice(deletedProjectIndex, 1);

  return res.json(projects);
});

server.post("/projects/:id/tasks", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const newTaskProject = projects.find(project => project.id == id);

  newTaskProject.tasks.push(title);

  return res.json(newTaskProject);
});
server.listen(3000);
