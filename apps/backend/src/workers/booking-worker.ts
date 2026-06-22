import { SQSClient, ReceiveMessageCommand, DeleteMessageCommand, MessageSystemAttributeNameForSends } from "@aws-sdk/client-sqs"

import * as dotenv from "dotenv"
dotenv.config()

const sqsClient = new SQSClient({
    region: process.env.AWS_REGION || "us-east-1",
    endpoint: process.env.AWS_ENDPOINT || "http://localhost:4566",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "test",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "test",
    },
})

const QUEUE_URL = process.env.SQS_QUEUE_URL!

const processMessage = async (body: string, receiptHandle: string) => {
    const message = JSON.parse(body);
    console.log(`⚙️  Processing booking: ${message.booking_id}`);

    await new Promise((res, rej) => {
        setTimeout(() => {
            res(1);
        }, 1000);
    });

    console.log(`✅ Booking ${message.booking_id} confirmed for ${message.customer_email}`);

    await sqsClient.send(new DeleteMessageCommand({
        QueueUrl: QUEUE_URL,
        ReceiptHandle: receiptHandle,
    }));
}

const poll = async () => {
    console.log("Poller started");
    
    while (true) {
        const { Messages } = await sqsClient.send(new ReceiveMessageCommand({
            QueueUrl: QUEUE_URL,
            MaxNumberOfMessages: 5,
            WaitTimeSeconds: 10,
        }))

        if (Messages) {
            await Promise.all(Messages.map(msg => processMessage(msg.Body!, msg.ReceiptHandle!)))
        }
    }
}

poll().catch(err => {
    console.error("Error in booking worker:", err);
    process.exit(1);
})