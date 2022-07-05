import { Expo } from 'expo-server-sdk';

const sendPushNotification = async (targetExpoPushToken, message, routine) => {
  console.log('target Token', targetExpoPushToken);
  const expo = new Expo();
  const chunks = expo.chunkPushNotifications([
    {
      to: targetExpoPushToken,
      sound: 'default',
      body: message,
      data: { routine: routine },
    },
  ]);

  const sendChunks = async () => {
    // This code runs synchronously. We're waiting for each chunk to be send.
    // A better approach is to use Promise.all() and send multiple chunks in parallel.
    chunks.forEach(async (chunk) => {
      console.log('Sending Chunk', chunk);
      try {
        const tickets = await expo.sendPushNotificationsAsync(chunk);
        console.log('Tickets', tickets);
      } catch (error) {
        console.log('Error sending chunk', error);
      }
    });
  };

  await sendChunks();
};

export default sendPushNotification;
