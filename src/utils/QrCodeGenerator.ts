import { Logger } from '@nestjs/common';
const QRCode = require('qrcode');
const logger: Logger = new Logger('app:utility:qr-code-generator');
const options = {
  width: 800,
  height: 600,
  margin: 1,
};

const generateQR = async (text) => {
  console.log({ text });
  try {
    logger.log('Generating qr code');
    const obj = await QRCode.toDataURL(text, options);
    return obj;
  } catch (err) {
    logger.log(err.message);
  }
};

export default generateQR;
