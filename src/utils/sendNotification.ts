import { Expo } from 'expo-server-sdk';
import sendPushNotification from './pushNotifications';
export async function sendNotification(pushToken, message) {
  console.log('Send Pushtoken ', pushToken);
  if (Expo.isExpoPushToken(pushToken))
    await sendPushNotification(pushToken, message, '');
}
