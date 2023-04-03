import { connect, Channel } from "amqplib";
import dotenv from "dotenv";
dotenv.config();

export interface MessageHandler {
  (message: any): Promise<void>;
}

export class RabbitMQService {
  private channel: Channel | null = null;
  private conUrl = process.env.AMQP_URL || "amqp://guest:guest@localhost:5672"

  async connect() {
    const conn = await connect(this.conUrl);
    this.channel = await conn.createChannel();
  }

  async createQueue(queueName: string) {
    await this.checkChannel();
    await this.channel!.assertQueue(queueName, { durable: false });
  }

  async sendMessage(queueName: string, message: any) {
    await this.checkChannel();
    const buffer = Buffer.from(JSON.stringify(message));
    await this.channel!.sendToQueue(queueName, buffer);
  }

  async consumeMessages(queueName: string, callback: MessageHandler) {
    await this.checkChannel();
    await this.channel!.consume(queueName, async (message) => {
      if (message !== null) {
        try {
          const messageContent = message.content.toString();
          const parsedMessage = JSON.parse(messageContent);
          await callback(parsedMessage);
          this.channel!.ack(message);
        } catch (error) {
          this.channel!.nack(message);
        }
      }
    });
  }

  async close() {
    if (this.channel !== null) {
      await this.channel.close();
      this.channel = null;
    }
  }

  private async checkChannel() {
    if (this.channel === null) {
      throw new Error("RabbitMQ channel is not connected");
    }
  }
}
