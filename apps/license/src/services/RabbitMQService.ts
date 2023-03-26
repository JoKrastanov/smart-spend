import { connect, Channel } from "amqplib";

export interface MessageHandler {
  (message: any): Promise<void>;
}

export class RabbitMQService {
  private channel: Channel | null = null;

  async connect() {
    const conn = await connect("amqp://localhost");
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

// export const sendRegisteredEmployee = async (
//   firstName: string,
//   lastName: string,
//   address: string,
//   phoneNumber: string,
//   country: Country,
//   companyId: string,
//   email: string,
//   password: string,
//   department: string,
//   accountType: AccountType
// ) => {
//   const connection = await connect("amqp://localhost");
//   const channel = await connection.createChannel();
//   await channel.assertQueue(employeeQueue, { durable: false });
//   channel.sendToQueue(
//     employeeQueue,
//     Buffer.from(
//       JSON.stringify({
//         firstName,
//         lastName,
//         address,
//         phoneNumber,
//         country,
//         companyId,
//         email,
//         password,
//         department,
//         accountType,
//       })
//     )
//   );