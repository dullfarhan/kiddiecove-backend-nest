const accountSid = 'ACd78f0a2ec18416b8d5d7b95ac53563ed';
const authToken = '3a93b3fa569ec2affb9e0a08803116f4';
import Client from 'twilio';

const send = async () => {
  const client = Client(accountSid, authToken);
  console.log('aya ha ');
  await client.messages
    .create({
      body: 'Hi Hamaz +12526240039',
      from: '+12526240039',
      to: '+92 3444555178',
    })
    .then((message) => console.log(message.sid))
    .catch((error) => {
      console.log('Error ', error);
    });
};

exports.send = send;
