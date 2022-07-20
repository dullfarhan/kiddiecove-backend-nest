import { Injectable, Logger } from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import Util from 'src/utils/util';
import { CreateEndpointDto } from './dto/create-endpoint.dto';
import { UpdateEndpointDto } from './dto/update-endpoint.dto';
import { EndPoint, EndPointDocument } from 'src/Schemas/endpoint.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class EndpointService {
  constructor(
    @InjectModel(EndPoint.name)
    private readonly endpointModel: Model<EndPointDocument>,
  ) {}

  readonly logger = new Logger(EndpointService.name);
  pageNumber = 1;
  pageSize = 10;
  getList(req, res) {
    this.logger.log('getting endpoints list for admin');
    this.endpointModel
      .find({ enable: true })
      .skip((this.pageNumber - 1) * parseInt(req.query.pageSize))
      .limit(parseInt(req.query.pageSize))
      .sort({ endpoint: 1 })
      .select({ endpoint: 1 })
      .then((result) => {
        // this.logger.log(result);
        return Util.getOkRequest(
          result,
          'Endpoints Listing Fetched Successfully',
          res,
        );
      })
      .catch((ex) => {
        this.logger.log(ex);
        return Util.getBadRequest(ex.message, res);
      });
  }

  async deleteByAdmin(req, res) {
    try {
      const endpoints = await this.endpointModel.findByIdAndRemove(
        req.params.id,
      );
      if (!endpoints)
        return Util.getBadRequest('Endpoints Not Found with given id', res);
      this.logger.log('Endpoints Succesfully Deleted');
      return Util.getSimpleOkRequest('Endpoints Deleted Successfully', res);
    } catch (ex) {
      this.logger.log(ex);
      return Util.getBadRequest(ex.message, res);
    }
  }

  async createByAdmin(req, res) {
    //Joi validation checking
    this.logger.log('validating req body');
    // const { error } = validateEndpoint(req.body);
    // if (error) return Util.getBadRequest(error.details[0].message, res);
    this.logger.log('req body is valid');
    try {
      this.logger.log('checking if Endpoints already exists or not?');
      const result = await this.endpointModel.findOne({
        endpoint: req.body.endpoint,
      });
      if (result) return Util.getBadRequest('Endpoints Already exists', res);
      this.logger.log('Endpoints not exists');
      this.logger.log('creating new Endpoints');
      await this.createAndSave(req.body);
      this.logger.log('Endpoint Created Successfully');
      return Util.getSimpleOkRequest('Endpoint Created Successfully', res);
    } catch (ex) {
      this.logger.log(ex);
      return Util.getBadRequest(ex.message, res);
    }
  }

  async checkEndpointsExistOrNot(endpoint) {
    this.logger.log('checking if Endpoint exists or not?');
    return await this.endpointModel.findOne({ endpoint: endpoint });
  }

  // async  updateEndpoints(endpoints, endpointsObj) {
  //   await endpoints.set(endpointsObj)
  //   this.logger.log('updating Endpoints')
  //   await endpoints.save()
  // }

  async createAndSave(reqBody) {
    return await this.save({
      _id: new mongoose.Types.ObjectId(),
      endpoint: reqBody.endpoint,
    });
  }

  async save(endpointObj) {
    this.logger.log('creating new Endpoint');
    const endpoint = new this.endpointModel(endpointObj);
    this.logger.log('saving Endpoints...');
    return await endpoint.save();
  }
  /////////////////////////////////////////
  create(createEndpointDto: CreateEndpointDto) {
    return 'This action adds a new endpoint';
  }

  findAll() {
    return `This action returns all endpoint`;
  }

  findOne(id: number) {
    return `This action returns a #${id} endpoint`;
  }

  update(id: number, updateEndpointDto: UpdateEndpointDto) {
    return `This action updates a #${id} endpoint`;
  }

  remove(id: number) {
    return `This action removes a #${id} endpoint`;
  }
}
