import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/Schemas';
import Util from 'src/utils/util';
import { sendNotification } from 'src/utils/sendNotification';
@Injectable()
export class ExpoPushTokenServiceService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async addToken(req, res) {
    const foundUser = await this.userModel.findById(req.userID);
    if (!foundUser) return Util.getBadRequest('Invalid User ', res);
    const updatedData = await this.userModel.findByIdAndUpdate(
      req.userID,
      {
        pushToken: req.pushtoken,
      },
      {
        new: true,
      },
    );
    sendNotification(req.pushtoken, 'hello');
    if (!updatedData) return Util.getBadRequest('Data Not Updated', res);
    console.log('updated data', updatedData);
    return Util.getSimpleOkRequest(updatedData, res);
  }
}
