import { Injectable, Logger } from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { AppService } from 'src/app.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { Address, AddressDocument } from 'src/Schemas';
import { UpdateAddressDto } from './dto/update-address.dto';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AddressService {
  constructor(
    @InjectModel(Address.name) private AddressModel: Model<AddressDocument>,
  ) {}

  private readonly logger = new Logger(AddressService.name);
  async save(addressObj, session) {
    const address = new this.AddressModel(addressObj);
    this.logger.log('saving address...');
    return await address.save({ session });
  }

  async createAndSave(reqBody, city, session) {
    this.logger.log('creating new user address');

    console.log(
      'USER COORDINATES',
      reqBody.location.coordinates[0],
      reqBody.location.coordinates[1],
    );

    return await this.save(
      {
        _id: new mongoose.Types.ObjectId(),
        address_details: reqBody.address_details,
        area_name: reqBody.area_name,
        location: {
          type: 'Point',
          coordinates: [
            reqBody.location.coordinates[0],
            reqBody.location.coordinates[1],
          ],
        },
        city_id: city._id,
      },
      session,
    );
  }

  async setAddressAndSave(address, addressObj, session) {
    await address.set(addressObj);
    this.logger.log('updating address');
    await address.save({ session });
  }

  async updateAddress(address, reqBody, city, session) {
    return await this.setAddressAndSave(
      address,
      {
        address_details: reqBody.address_details,
        area_name: reqBody.area_name,
        location: {
          type: 'Point',
          coordinates: [-122.5, 37.7],
        },
        city_id: city._id,
        updated_at: Date.now(),
      },
      session,
    );
  }

  async updateDirectly(userAddressId, reqBody, city, session) {
    return await this.AddressModel.findByIdAndUpdate(
      userAddressId,
      {
        $set: {
          address_details: reqBody.address_details,
          area_name: reqBody.area_name,
          location: {
            type: 'Point',
            coordinates: [-122.5, 37.7],
          },
          city_id: city._id,
          updated_at: Date.now(),
        },
      },
      { session, new: true, runValidators: true },
    );
  }

  create(createAddressDto: CreateAddressDto) {
    return 'This action adds a new address';
  }

  findAll() {
    return `This action returns all address`;
  }

  update(id: number, updateAddressDto: UpdateAddressDto) {
    return `This action updates a #${id} address`;
  }

  remove(id: number) {
    return `This action removes a #${id} address`;
  }
}
