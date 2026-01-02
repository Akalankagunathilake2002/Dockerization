const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const amqp = require('amqplib')

const app = express()
const port = 3003

app.use(bodyParser.json())

mongoose.connect(process.env.MONGO_URI || 'mongodb://mongo:27017/tasks')
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error", err))

const TaskSchema = new mongoose.Schema({
  title: String,
  description: String,
  userId: String,
  createdAt: { type: Date, default: Date.now }
})

const Task = mongoose.model('Task', TaskSchema)

let channel, connection

async function connectRabbitMQWithRetry(retries = 5, delay = 3000) {
  while (retries > 0) {
    try {
      connection = await amqp.connect("amqp://rabbitmq:5672")
      channel = await connection.createChannel()
      await channel.assertQueue("task_created")
      console.log("Connected to RabbitMQ")
      return
    } catch (error) {
      console.error("RabbitMQ connection error:", error.message)
      retries--
      console.log(`Retrying in ${delay / 1000}s... Remaining retries: ${retries}`)
      await new Promise(res => setTimeout(res, delay))
    }
  }
  console.error("Could not connect to RabbitMQ after retries.")
}

app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find()
    res.json(tasks)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/tasks', async (req, res) => {
  try {
    const { title, description, userId } = req.body
    const task = new Task({ title, description, userId })
    await task.save()

    const message = { taskId: task._id.toString(), userId, title }

    if (!channel) {
      return res.status(503).json({ error: "RabbitMQ not connected" })
    }

    channel.sendToQueue("task_created", Buffer.from(JSON.stringify(message)))

    res.status(201).json(task)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.listen(port, () => console.log(`Task service listening on port ${port}`))
connectRabbitMQWithRetry()
