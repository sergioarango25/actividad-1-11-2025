const express = require("express");
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World desde Express!");
}); 

let tasks = [
  { id: 1, title: 'Primera tarea', description: 'Hacer la tarea de programacion', status: 'PENDING' },
  { id: 2, title: 'Segunda tarea', description: 'Leer documentacion', status: 'COMPLETED' },
  { id: 3, title: 'Tercera tarea', description: 'Subir video', status: 'PENDING' }
];

let nextId = 4;

app.post('/tasks', (req, res) => {
  const { title, description } = req.body;
  if (!title) return res.status(400).json({ message: 'Title is required' });
  const newTask = { id: nextId++, title, description, status: 'PENDING' };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.get('/tasks', (req, res) => {
  res.json(tasks);
});


app.get('/tasks/summary', (req, res) => {
  const todo = tasks.filter(t => t.status === 'PENDING').length;
  const done = tasks.filter(t => t.status === 'COMPLETED').length;
  const doing = tasks.filter(t => t.status === 'IN_PROGRESS').length;

  res.json({ todo, doing, done });
});

app.get('/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id == req.params.id);
  if (!task) return res.status(404).json({ message: 'Task not found' });
  res.json(task);
});

app.put('/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id == req.params.id);
  if (!task) return res.status(404).json({ message: 'Task not found' });
  const { title, description, status } = req.body;
  task.title = title || task.title;
  task.description = description || task.description;
  task.status = status || task.status;
  res.json(task);
});

app.delete('/tasks/:id', (req, res) => {
  tasks = tasks.filter(t => t.id != req.params.id);
  res.json({ message: 'Task deleted successfully' });
});

app.patch('/tasks/:id/status', (req, res) => {
  const task = tasks.find(t => t.id == req.params.id);
  if (!task) return res.status(404).json({ message: 'Task not found' });

  const { status } = req.body;
  const allowedStatuses = ['COMPLETED', 'PENDING', 'IN_PROGRESS']; // estados válidos
  if (!status || !allowedStatuses.includes(status)) {
    return res.status(400).json({ message: `Status must be one of ${allowedStatuses.join(', ')}` });
  }

  task.status = status;
  res.json({ id: task.id, status: task.status });
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor activo en http://localhost:${PORT}`);
});
