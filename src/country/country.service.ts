import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import mongoose, { Model } from 'mongoose';
import { Country, CountryDocument } from 'src/Schemas';
import Util from 'src/utils/util';
import { CreateCountryDto } from './dto/create-country.dto';

@Injectable()
export class CountryService {
  logger: Logger = new Logger(CountryService.name);
  pageNumber = 1;
  pageSize = 10;

  constructor(
    @InjectModel(Country.name)
    private readonly countryModel: Model<CountryDocument>,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}

  getAllForAdmin(res: Response) {
    this.logger.log('getting country list for admin');
    this.countryModel
      .find({ enable: true })
      .skip((this.pageNumber - 1) * this.pageSize)
      .limit(this.pageSize)
      .sort({ name: 1 })
      .select({ name: 1, code: 1, country_code: 1, enable: 1, deleted: 1 })
      .then((result) => {
        return Util.getOkRequest(
          result,
          'Countries Listing Fetched Successfully',
          res,
        );
      })
      .catch((ex) => {
        this.logger.log(ex);
        return Util.getBadRequest(ex.message, res);
      });
  }

  getList(res: Response) {
    this.logger.log('getting country as lists for admin');
    this.countryModel
      .find({ enable: true })
      .sort({ name: 1 })
      .select({ _id: 1, name: 1 })
      .then((result) => {
        return Util.getOkRequest(
          result,
          'Country Listing Fetched Successfully',
          res,
        );
      })
      .catch((ex) => {
        this.logger.log(ex);
        return Util.getBadRequest(ex.message, res);
      });
  }

  async getForAdmin(id: string, res: Response) {
    try {
      this.logger.log('checking if country with given id exist or not');
      const country = await this.countryModel.findOne({ _id: id });
      if (!country)
        return Util.getBadRequest('Country Not Found with given id', res);
      this.logger.log('Country exist');
      this.logger.log('Country Details Fetched Succesfully');
      return Util.getOkRequest(
        country,
        'Country Details Fetched Successfully',
        res,
      );
    } catch (ex) {
      this.logger.log(ex);
      return Util.getBadRequest(ex.message, res);
    }
  }

  async deleteByAdmin(id: string, res: Response) {
    try {
      const country = await this.countryModel.findByIdAndRemove(id);
      if (!country)
        return Util.getBadRequest('Country Not Found with given id', res);
      this.logger.log('Country Succesfully Deleted');
      return Util.getSimpleOkRequest('Country Deleted Successfully', res);
    } catch (ex) {
      this.logger.log(ex);
      return Util.getBadRequest(ex.message, res);
    }
  }

  async createByAdmin(createCountryDto: CreateCountryDto, res: Response) {
    this.logger.log('req body is valid');
    try {
      this.logger.log('checking if country already exists or not?');
      let result = await this.countryModel.findOne({
        name: createCountryDto.name,
      });
      if (result) return Util.getBadRequest('Country Already exists', res);
      this.logger.log('country not exists');
      this.logger.log('creating new country');
      await this.createAndSave(createCountryDto);
      this.logger.log('Country Created Successfully');
      return Util.getSimpleOkRequest('Country Created Successfully', res);
    } catch (ex) {
      this.logger.log(ex);
      return Util.getBadRequest(ex.message, res);
    }
  }

  async createAndSave(createCountryDto: CreateCountryDto) {
    return await this.save({
      _id: new mongoose.Types.ObjectId(),
      name: createCountryDto.name,
      code: createCountryDto.code,
      country_code: createCountryDto.country_code,
      number_length: createCountryDto.number_length,
    });
  }

  async save(countryObj: Object) {
    this.logger.log('creating new country');
    const country = new this.countryModel(countryObj);
    this.logger.log('saving country..');
    return await country.save();
  }

  async updateByAdmin(
    id: string,
    createCountryDto: CreateCountryDto,
    res: Response,
  ) {
    this.logger.log('req body is valid');
    try {
      const country = await this.countryModel.findOne({ _id: id });
      if (!country)
        return Util.getBadRequest('Country Not Found with given id', res);
      this.logger.log('country found');
      await this.updateCountry(country, createCountryDto);
      this.logger.log(`updated country ${country}`);
      this.logger.log('Country Updated Successfully');
      return Util.getSimpleOkRequest('Country Updated Successfully', res);
    } catch (ex) {
      this.logger.log(ex);
      return Util.getBadRequest(ex.message, res);
    }
  }

  async updateCountry(country, createCountryDto: CreateCountryDto) {
    return await this.setCountryAndSave(country, {
      name: createCountryDto.name,
      code: createCountryDto.code,
      country_code: createCountryDto.country_code,
      number_length: createCountryDto.number_length,
      enable: createCountryDto.enable,
      deleted: createCountryDto.deleted,
      updated_at: Date.now(),
    });
  }

  async setCountryAndSave(country, countryObj) {
    await country.set(countryObj);
    this.logger.log('updating country');
    await country.save();
  }

  async updateDirectlyByAdmin(
    id: string,
    createCountryDto: CreateCountryDto,
    res: Response,
  ) {
    const session = this.connection.startSession();
    this.logger.log('req body is valid');
    try {
      const country = await this.updateDirectly(id, createCountryDto, session);
      this.logger.log(`updated country ${country}`);
      this.logger.log('Country Updated Successfully');
      return Util.getSimpleOkRequest('Country Updated Successfully', res);
    } catch (ex) {
      this.logger.log(ex);
      return Util.getBadRequest(ex.message, res);
    }
  }

  async updateDirectly(id, reqBody, session) {
    return await this.countryModel.findByIdAndUpdate(
      id,
      {
        $set: {
          name: reqBody.name,
          code: reqBody.code,
          country_code: reqBody.country_code,
          number_lenght: reqBody.number_lenght,
          updated_at: Date.now(),
          enable: reqBody.enable,
          deleted: reqBody.deleted,
        },
      },
      { session, new: true, runValidators: true },
    );
  }
}
