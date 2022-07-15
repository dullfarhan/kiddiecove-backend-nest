import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { City, CityDocument } from 'src/Schemas/city.schema';
import { CountryDocument, Country } from 'src/Schemas/country.schema';
import Util from 'src/utils/util';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';

const logger = new Logger('city');

@Injectable()
export class CityService {
  constructor(
    @InjectModel(City.name) private CityModel: Model<CityDocument>,
    @InjectModel(Country.name) private CountryModel: Model<CountryDocument>,
  ) {}

  // constructor(
  //   @InjectModel(Country.name) private CountryModel: Model<CountryDocument>,
  // ) {}
  pageNumber = 1;
  pageSize = 10;

  getAllForAdmin(req, res) {
    logger.log('getting city list for admin');
    this.CityModel.find({ enable: true })
      .skip((this.pageNumber - 1) * this.pageSize)
      .limit(this.pageSize)
      .sort({ name: 1 })
      .select({ name: 1, code: 1, enable: 1, deleted: 1 })
      .then((result) => {
        logger.log(result);
        return Util.getOkRequest(
          result,
          'Cities Listing Fetched Successfully',
          res,
        );
      })
      .catch((ex) => {
        logger.log(ex);
        return Util.getBadRequest(ex.message, res);
      });
  }

  getList(req, res) {
    logger.log('getting city as lists for a particular country');
    this.CityModel.find({ country_id: req.params.id })
      .sort({ name: 1 })
      .select({ _id: 1, name: 1 })
      .then((result) => {
        logger.log(result);
        return Util.getOkRequest(
          result,
          'City Listing Fetched Successfully',
          res,
        );
      })
      .catch((ex) => {
        logger.log(ex);
        return Util.getBadRequest(ex.message, res);
      });
  }

  async getForAdmin(req, res) {
    try {
      logger.log('checking if city with given id exist or not');
      const city = await this.checkCityExistOrNot(req.params.id);
      if (!city) return Util.getBadRequest('City Not Found with given id', res);
      logger.log('City exist');
      logger.log('City Details Fetched Succesfully');
      return Util.getOkRequest(city, 'City Details Fetched Successfully', res);
    } catch (ex) {
      logger.log(ex);
      return Util.getBadRequest(ex.message, res);
    }
  }

  async updateByAdmin(req, res) {
    logger.log('validating req body');
    // const { error } = validateCity(req.body);
    // if (error) return Util.getBadRequest(error.details[0].message, res);
    logger.log('req body is valid');
    try {
      const city = await this.checkCityExistOrNot(req.params.id);
      if (!city) return Util.getBadRequest('City Not Found with given id', res);
      logger.log('city found');

      await this.updateCity(city, req.body);
      logger.log(`updated city ${city}`);
      logger.log('City Updated Successfully');
      return Util.getSimpleOkRequest('City Updated Successfully', res);
    } catch (ex) {
      logger.log(ex);
      return Util.getBadRequest(ex.message, res);
    }
  }

  async updateDirectlyByAdmin(req, res) {
    logger.log('validating req body');
    // const { error } = validateCity(req.body);
    // if (error) return Util.getBadRequest(error.details[0].message, res);
    logger.log('req body is valid');
    const session = '';
    try {
      const city = await this.updateDirectly(req.params.id, req.body, session);
      logger.log(`updated city ${city}`);
      logger.log('City Updated Successfully');
      return Util.getSimpleOkRequest('City Updated Successfully', res);
    } catch (ex) {
      logger.log(ex);
      return Util.getBadRequest(ex.message, res);
    }
  }

  async deleteByAdmin(req, res) {
    try {
      const city = await this.CityModel.findByIdAndRemove(req.params.id);
      if (!city) return Util.getBadRequest('City Not Found with given id', res);
      logger.log('City Succesfully Deleted');
      return Util.getSimpleOkRequest('City Deleted Successfully', res);
    } catch (ex) {
      logger.log(ex);
      return Util.getBadRequest(ex.message, res);
    }
  }

  async createByAdmin(req, res) {
    //Joi validation checking
    logger.log('validating req body');
    // const { error } = validateCity(req.body);
    // if (error) return Util.getBadRequest(error.details[0].message, res);
    logger.log('req body is valid');
    try {
      logger.log('checking if city already exists or not?');
      let result = await this.CityModel.findOne({ name: req.body.name });
      if (result) return Util.getBadRequest('City Already exists', res);
      logger.log('City not exists');
      logger.log('checking if country exists or not?');
      result = await this.CountryModel.findOne({ _id: req.body.country_id });
      if (!result) return Util.getBadRequest('Country Not exists', res);
      logger.log('Country exists');
      logger.log('creating new city');
      await this.createAndSave(req.body);
      logger.log('City Created Successfully');
      return Util.getSimpleOkRequest('City Created Successfully', res);
    } catch (ex) {
      logger.log(ex);
      return Util.getBadRequest(ex.message, res);
    }
  }

  async checkCityExistOrNot(city_id) {
    logger.log('checking if city exists or not?');
    return await this.CityModel.findOne({ _id: city_id });
  }

  async setCityAndSave(city, cityObj) {
    await city.set(cityObj);
    logger.log('updating city');
    return await city.save();
  }

  async updateCity(city, reqBody) {
    return await this.setCityAndSave(city, {
      name: reqBody.name,
      code: reqBody.code,
      enable: reqBody.enable,
      deleted: reqBody.deleted,
      updated_at: Date.now(),
    });
  }

  async createAndSave(reqBody) {
    return await this.save({
      _id: new mongoose.Types.ObjectId(),
      name: reqBody.name,
      code: reqBody.code,
      country_id: reqBody.country_id,
    });
  }

  async save(cityObj) {
    logger.log('creating new city');
    const city = new this.CityModel(cityObj);
    logger.log('saving city...');
    return await city.save();
  }

  async updateDirectly(id, reqBody, session) {
    return await this.CityModel.findByIdAndUpdate(
      id,
      {
        $set: {
          name: reqBody.name,
          code: reqBody.code,
          updated_at: Date.now(),
          enable: reqBody.enable,
          deleted: reqBody.deleted,
        },
      },
      { session, new: true, runValidators: true },
    );
  }

  create(createCityDto: CreateCityDto) {
    return 'This action adds a new city';
  }

  findAll() {
    return `This action returns all city`;
  }

  findOne(id: number) {
    return `This action returns a #${id} city`;
  }

  update(id: number, updateCityDto: UpdateCityDto) {
    return `This action updates a #${id} city`;
  }

  remove(id: number) {
    return `This action removes a #${id} city`;
  }
}
