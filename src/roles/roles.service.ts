import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role, RoleDocument } from 'src/Schemas';
import Util from 'src/utils/util';
import mongoose, { Model } from 'mongoose';
import { Request, Response } from 'express';
import { PermissionService } from 'src/permission/permission.service';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name) private RoleModel: Model<RoleDocument>,
    private readonly permissionService: PermissionService,
  ) {}

  readonly logger = new Logger(RolesService.name);
  getList(req, res) {
    this.logger.log('getting roles as lists');
    this.RoleModel.find()
      .populate('permissions', 'name')
      .sort({ name: 1 })
      .select({ _id: 1, name: 1, permissions: 1, enable: 1, deleted: 1 })
      .then((result) => {
        this.logger.log(result);
        return Util.getOkRequest(
          result,
          'Role Listing Fetched Successfully',
          res,
        );
      })
      .catch((ex) => {
        this.logger.log(ex);
        return Util.getBadRequest(ex.message, res);
      });
  }

  async get(req, res) {
    try {
      const role = await this.RoleModel.findOne({ _id: req.params.id })
        .populate('permissions', 'name')
        .select({ _id: 1, name: 1, permissions: 1 });
      if (!role) return Util.getBadRequest('Role Not Found with given id', res);
      this.logger.log('Role Details Fetched Succesfully');
      return Util.getOkRequest(role, 'Role Details Fetched Successfully', res);
    } catch (ex) {
      this.logger.log(ex);
      return Util.getBadRequest(ex.message, res);
    }
  }

  async updateByAdmin(req: Request, res: Response) {
    this.logger.log('validating req body');
    // const { error } = validateRole(req.body);
    // if (error) return Util.getBadRequest(error.details[0].message, res);
    this.logger.log('req body is valid');
    try {
      const role = await this.RoleModel.findOne({ name: req.body.name });
      if (!role) return Util.getBadRequest('Role Not Found with given id', res);
      this.logger.log('role found');
      this.logger.log('updating existing role');
      const permissionsArray =
        await this.permissionService.validateAndMakePermissionArray(
          req.body.permissions,
        );
      this.logger.log(
        `returning permission array after validating permissions ${permissionsArray}`,
      );
      if (req.query.addNew) {
        permissionsArray.forEach((permissionID) => {
          role.permissions.push(permissionID);
        });
        await this.updateRoleAndAddNewPermission(role, req.body);
      } else await this.updateRole(role, req.body, permissionsArray);
      this.logger.log(`updated role ${role}`);
      this.logger.log('Role Updated Successfully');
      return Util.getSimpleOkRequest('Role Updated Successfully', res);
    } catch (ex) {
      this.logger.log(ex);
      return Util.getBadRequest(ex.message, res);
    }
  }

  async deleteByAdmin(req: Request, res: Response) {
    try {
      const role = await this.RoleModel.findByIdAndRemove(req.params.id);
      if (!role) return Util.getBadRequest('Role Not Found with given id', res);
      this.logger.log('Role Succesfully Deleted');
      return Util.getSimpleOkRequest('Role Deleted Successfully', res);
    } catch (ex) {
      this.logger.log(ex);
      return Util.getBadRequest(ex.message, res);
    }
  }

  async createByAdmin(req: Request, res: Response) {
    //Joi validation checking
    this.logger.log('validating req body');
    // const { error } = validateRole(req.body);
    // if (error) return Util.getBadRequest(error.details[0].message, res);
    this.logger.log('req body is valid');
    try {
      this.logger.log('checking if role already exists or not?');
      const result = await this.RoleModel.findOne({ name: req.body.name });
      const Dto: CreateRoleDto = req.body;
      console.log(Dto.permissions);
      if (result) return Util.getBadRequest('Role Already exists', res);
      this.logger.log('Role not exists');
      this.logger.log('creating new role');
      const permissionsArray =
        await this.permissionService.validateAndMakePermissionArray(
          req.body.permissions,
        );
      this.logger.log(
        `returning permission array after validating permissions ${permissionsArray}`,
      );
      await this.createAndSave(req.body, permissionsArray);
      this.logger.log('Role Created Successfully');
      return Util.getSimpleOkRequest('Role Created Successfully', res);
    } catch (ex) {
      this.logger.log(ex);
      return Util.getBadRequest(ex.message, res);
    }
  }

  async checkRoleExistOrNot(role_id: mongoose.Types.ObjectId) {
    this.logger.log('checking if role exists or not?');
    return await this.RoleModel.findOne({ _id: role_id });
  }

  async updateRole(role, reqBody, permissionsArray) {
    return await this.setRoleAndSave(role, {
      updated_at: Date.now(),
      permissions: permissionsArray,
      enable: reqBody.enable,
      deleted: reqBody.deleted,
    });
  }

  async updateRoleAndAddNewPermission(role, reqBody) {
    return await this.setRoleAndSave(role, {
      updated_at: Date.now(),
      enable: reqBody.enable,
      deleted: reqBody.deleted,
    });
  }

  async setRoleAndSave(role, roleObj) {
    await role.set(roleObj);
    this.logger.log('updating role');
    await role.save();
  }

  async createAndSave(reqBody, permissionsArray) {
    return await this.save({
      _id: new mongoose.Types.ObjectId(),
      name: reqBody.name,
      permissions: permissionsArray,
    });
  }

  async save(roleObj) {
    this.logger.log('creating new role');
    const role = new this.RoleModel(roleObj);
    this.logger.log('saving role...');
    return await role.save();
  }

  async getRole(roleName) {
    this.logger.log('checking weather roles exists or not');
    return await this.RoleModel.findOne({ name: roleName });
  }

  /////////////////////////////////////////////////////////
  create(createRoleDto: CreateRoleDto) {
    return 'This action adds a new role';
  }

  findAll() {
    return `This action returns all roles`;
  }

  findOne(id: number) {
    return `This action returns a #${id} role`;
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
