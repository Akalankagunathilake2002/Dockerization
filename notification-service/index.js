const amqp = require("amqplib");

let connection, channel;

async function start(retries = 10, delay = 3000) {
  while (retries > 0) {
    try {
      connection = await amqp.connect("amqp://rabbitmq:5672");
      channel = await connection.createChannel();
      await channel.assertQueue("task_created");

      console.log("notification service is enabled for messages ✅");

      channel.consume("task_created", (msg) => {
        const taskData = JSON.parse(msg.content.toString());
        console.log("Notification: New Task:", taskData.title);
        channel.ack(msg);
      });

      return; // ✅ SUCCESS: stop here, don’t print failure
    } catch (error) {
      console.error("RabbitMQ connection error:", error.message);
      retries--;
      console.log(`Retrying... remaining: ${retries}`);
      await new Promise((res) => setTimeout(res, delay));
    }
  }

  console.error("Could not connect to RabbitMQ after retries ❌");
}

start();
