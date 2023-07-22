import { randomUUID } from 'node:crypto'
import { Database } from "./database.js";
import buildRoutePath from './utils/buildRoutePath.js';

const database = new Database();

export const routes = [
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: (_req, res) => {
      const tasks = database.select('tasks')
      res
        .writeHead(200)
        .end(JSON.stringify(tasks))
    },
  },
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { title, description } = req.body

      if (!title || !description) {
        return res.writeHead(400).end();
      }

      const now = new Date().toISOString();
      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: now,
        updated_at: now,
      }
      database.insert('tasks', task)
      res.writeHead(201).end()
    },
  },
  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { title, description } = req.body;
      const { id } = req.params;

      if (!title || !description) {
        return res.writeHead(400).end();
      }

      try {
        const data = {
          title,
          description,
          updated_at: new Date().toISOString(),
        }
        database.update('tasks', data, id)
      } catch (error) {
        if (error.message === 'Id not found') {
          return res.writeHead(404).end();
        }
        return res.writeHead(400).end();
      }

      res.writeHead(204).end()
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;

      try {
        database.delete('tasks', id)
      } catch (error) {
        if (error.message === 'Id not found') {
          return res.writeHead(404).end();
        }
        return res.writeHead(400).end();
      }
      res.writeHead(204).end()
    },
  },
  {
    method: "PATCH",
    path: buildRoutePath("/tasks/:id/complete"),
    handler: (req, res) => {
      const { id } = req.params;

      try {
        const tasks = database.select('tasks', {
          id,
        })

        const isComplete = (tasks.length === 1 && tasks[0].id === id && !!tasks[0].completed_at)

        const now = new Date().toISOString();

        const data = {
          completed_at: isComplete ? null : now,
          updated_at: now,
        }
        database.update('tasks', data, id)
      } catch (error) {
        if (error.message === 'Id not found') {
          return res.writeHead(404).end();
        }
        return res.writeHead(400).end();
      }
      res.writeHead(204).end()
    },
  },
]
