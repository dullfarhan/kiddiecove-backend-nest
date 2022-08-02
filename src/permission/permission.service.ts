import { Injectable, Logger } from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import Util from 'src/utils/util';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Permissions, PermissionDocument } from 'src/Schemas';
import { InjectModel } from '@nestjs/mongoose';
import { EndpointService } from 'src/endpoint/endpoint.service';

@Injectable()
export class PermissionService {
  constructor(
    @InjectModel(Permissions.name)
    private PermissionModel: Model<PermissionDocument>,
    private readonly endpointService: EndpointService,
  ) {}

  readonly logger = new Logger(PermissionService.name);
  getList(req, res) {
    this.logger.log('getting Permissions as lists for a particular role');
    this.PermissionModel.find()
      .sort({ endpoint: 1 })
      .select({ _id: 1, name: 1, endpoint: 1, enable: 1, deleted: 1 })
      .then((result) => {
        // this.logger.log(result);
        return Util.getOkRequest(
          result,
          'Permission Listing Fetched Successfully',
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
      const permission = await this.PermissionModel.findByIdAndRemove(
        req.params.id,
      );
      if (!permission)
        return Util.getBadRequest('Permission Not Found with given id', res);
      this.logger.log('Permission Succesfully Deleted');
      return Util.getSimpleOkRequest('Permission Deleted Successfully', res);
    } catch (ex) {
      this.logger.log(ex);
      return Util.getBadRequest(ex.message, res);
    }
  }

  async createByAdmin(req, res) {
    //Joi validation checking
    this.logger.log('validating req body');
    // const { error } = validatePermission(req.body);
    // if (error) return Util.getBadRequest(error.details[0].message, res);
    this.logger.log('req body is valid');
    try {
      this.logger.log('checking if Permission already exists or not?');
      const result = await this.PermissionModel.findOne({
        $or: [{ name: req.body.name }, { endpoint: req.body.endpoint }],
      });
      if (result) return Util.getBadRequest('Permission Already exists', res);
      this.logger.log('Permission not exists');
      const result1 = await this.endpointService.checkEndpointsExistOrNot(
        req.body.endpoint,
      );
      if (!result1) return Util.getBadRequest('Endpoint Does not exists', res);
      this.logger.log('creating new Permission');
      await this.createAndSave(req.body);
      this.logger.log('Permission Created Successfully');
      return Util.getSimpleOkRequest('Permission Created Successfully', res);
    } catch (ex) {
      this.logger.log(ex);
      return Util.getBadRequest(ex.message, res);
    }
  }

  async createAndSave(reqBody) {
    return await this.save({
      _id: new mongoose.Types.ObjectId(),
      name: reqBody.name,
      endpoint: reqBody.endpoint,
    });
  }

  async save(permissionObj) {
    this.logger.log('creating new Permission');
    const permission = new this.PermissionModel(permissionObj);
    this.logger.log('saving Permission...');
    return await permission.save();
  }

  async validateAndMakePermissionArray(permissionsArray) {
    this.logger.log('checking weather Permissions exists or not');
    const permissionsGlobalArray = [];
    if (permissionsArray) {
      for (const permissions of permissionsArray) {
        const permission = await this.PermissionModel.findById(permissions);
        if (permission) {
          permissionsGlobalArray.push(permissions);
        }
      }
    }
    console.log(permissionsGlobalArray);
    console.log(
      'this is the array' + JSON.stringify(permissionsGlobalArray, null, 4),
    );
    return permissionsGlobalArray;
  }

  ///////////////////////////////////////
  create(createPermissionDto: CreatePermissionDto) {
    return 'This action adds a new permission';
  }

  findAll() {
    return `This action returns all permission`;
  }

  findOne(id: number) {
    return `This action returns a #${id} permission`;
  }

  update(id: number, updatePermissionDto: UpdatePermissionDto) {
    return `This action updates a #${id} permission`;
  }

  remove(id: number) {
    return `This action removes a #${id} permission`;
  }
}
