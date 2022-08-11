import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Request, Response } from 'express';
import mongoose, {
  ClientSession,
  Model,
  mongo,
  Mongoose,
  ObjectId,
} from 'mongoose';
import { ClassService } from 'src/class/class.service';
import CurrentUser from 'src/currentuser/currentuser.service';
import { ParentService } from 'src/parent/parent.service';
import {
  Class,
  ClassDocument,
  Kid,
  KidDocument,
  User,
  UserDocument,
} from 'src/Schemas';
import Constant from 'src/utils/enums/Constant.enum';
import { RegistartionStatus } from 'src/utils/enums/RegistartionStatus';
import { UserType } from 'src/utils/enums/UserType.enum';
import Util from 'src/utils/util';
import { UpdateKidDto } from './dto/update-kid.dto';

@Injectable()
export class KidService {
  private readonly logger: Logger = new Logger(KidService.name);
  pageNumber = 1;
  pageSize = 10;

  constructor(
    @InjectModel(Kid.name) private readonly kidModel: Model<KidDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Class.name) private readonly classModel: Model<ClassDocument>,
    @InjectConnection() private readonly connection: mongoose.Connection,
    @Inject(forwardRef(() => ParentService))
    private readonly parentService: ParentService,
    @Inject(forwardRef(() => CurrentUser))
    private readonly currentUser: CurrentUser,
    @Inject(forwardRef(() => ClassService))
    private readonly classService: ClassService,
  ) {}

  async getAllKidsForAdmin(res: Response) {
    this.logger.log('getting Kids list for admin');
    this.getAllKids(res, { enable: true, registered: true }, {});
  }

  getAllKids(res: Response, filter: Object, selects: Object) {
    this.logger.log('getting Kids list');
    this.kidModel
      .find(filter)
      .skip((this.pageNumber - 1) * this.pageSize)
      .limit(this.pageSize)
      .sort({ name: 1 })
      .select(selects)
      .then((result) => {
        this.logger.log(result);
        return Util.getOkRequest(
          result,
          'Kids Listing Fetched Successfully',
          res,
        );
      })
      .catch((ex) => {
        this.logger.log(ex);
        return Util.getBadRequest(ex.message, res);
      });
  }

  async getAllKidsForSchoolAdmin(req: Request, res: Response) {
    this.logger.log('getting Kids list for school admin');
    const response = await this.currentUser.getCurrentUser(
      req,
      UserType.SCHOOL_ADMIN,
      this.userModel,
    );
    if (response.status === Constant.FAIL)
      return Util.getBadRequest(response.message, res);
    this.logger.log('Current School Admin User Found');
    const schoolAdmin = response.data;
    this.getAllKids(
      res,
      {
        enable: true,
        registered: true,
        school_id: schoolAdmin.school_id,
      },
      {},
    );
  }

  async getAllKidsForParent(req: Request, res: Response) {
    this.logger.log('getting Kids list for parent');
    const response = await this.currentUser.getCurrentUser(
      req,
      UserType.PARENT,
      this.userModel,
    );
    if (response.status === Constant.FAIL)
      return Util.getBadRequest(response.message, res);
    this.logger.log('Current Parent User Found');
    const parent = response.data;
    this.getAllKids(
      res,
      {
        enable: true,
        parent_id: parent._id,
      },
      {},
    );
  }

  async getAllKidsAsListingForParent(req, res) {
    this.logger.log('getting Kids as listing for parent');
    const response = await this.currentUser.getCurrentUser(
      req,
      UserType.PARENT,
      this.userModel,
    );
    if (response.status === Constant.FAIL)
      return Util.getBadRequest(response.message, res);
    this.logger.log('Current Parent User Found');
    const parent = response.data;
    this.getAllKids(
      res,
      {
        enable: true,
        parent_id: parent._id,
      },
      { _id: 1, name: 1, avatar: 1 },
    );
  }

  async getAllKidsAsListingForParentForRegistration(req, res) {
    this.logger.log('getting Kids as listing for parent');
    const response = await this.currentUser.getCurrentUser(
      req,
      UserType.PARENT,
      this.userModel,
    );
    if (response.status === Constant.FAIL)
      return Util.getBadRequest(response.message, res);
    this.logger.log('Current Parent User Found');
    const parent = response.data;
    this.getAllKids(
      res,
      {
        enable: true,
        parent_id: parent._id,
        registration_status: RegistartionStatus.NOT_REGISTERED,
      },
      { _id: 1, name: 1, avatar: 1 },
    );
  }

  async getAllKidsForRegistrationAsListingForParent(req, res) {
    this.logger.log('getting un registered Kids as listing for parent');
    const response = await this.currentUser.getCurrentUser(
      req,
      UserType.PARENT,
      this.userModel,
    );
    if (response.status === Constant.FAIL)
      return Util.getBadRequest(response.message, res);
    this.logger.log('Current Parent User Found');
    const parent = response.data;
    this.getAllKids(
      res,
      {
        enable: true,
        registered_status: RegistartionStatus.NOT_REGISTERED,
        parent_id: parent._id,
      },
      { _id: 1, name: 1 },
    );
  }

  async getKidForAdmin(id, res) {
    this.logger.log('getting Kid detail for admin');
    this.getKid(res, {
      _id: id,
      enable: true,
      registered: true,
    });
  }

  async getKid(res, filter) {
    try {
      this.logger.log('checking if Kid with given id exist or not');
      const kid = await this.kidModel.findOne(filter);
      if (!kid) return Util.getBadRequest('Kid Not Found with given id', res);
      this.logger.log('Kid exist');
      this.logger.log('Kid Details Fetched Succesfully');
      return Util.getOkRequest(kid, 'Kid Details Fetched Successfully', res);
    } catch (ex) {
      this.logger.log(ex);
      return Util.getBadRequest(ex.message, res);
    }
  }

  async getKidForSchoolAdmin(req, res) {
    this.logger.log('getting Kid detail for school admin');
    const response = await this.currentUser.getCurrentUser(
      req,
      UserType.SCHOOL_ADMIN,
      this.userModel,
    );
    if (response.status === Constant.FAIL)
      return Util.getBadRequest(response.message, res);
    this.logger.log('Current School Admin User Found');
    const schoolAdmin = response.data;
    this.getKid(res, {
      enable: true,
      registered: true,
      school_id: schoolAdmin.school_id,
      _id: req.params.id,
    });
  }

  async getKidForParent(req: Request, res: Response) {
    this.logger.log('getting Kid listing for parent');
    const response = await this.currentUser.getCurrentUser(
      req,
      UserType.PARENT,
      this.userModel,
    );
    if (response.status === Constant.FAIL)
      return Util.getBadRequest(response.message, res);
    this.logger.log('Current Parent User Found');
    const parent = response.data;
    this.getKid(res, {
      enable: true,
      parent_id: parent._id,
      _id: req.params.id,
    });
  }

  async updateByParent(id, updateKidDto: UpdateKidDto, res) {
    const session = await this.connection.startSession();
    this.logger.log('req body is valid');
    try {
      session.startTransaction();
      const kid = await this.kidModel.findOne({ _id: id });
      if (!kid) return Util.getBadRequest('Kid Not Found with given id', res);
      this.logger.log('Kid found');
      await this.updateAndSaveKid(kid, updateKidDto, session);
      this.logger.log(`updated Kid ${kid}`);
      await session.commitTransaction();
      this.logger.log('Kid and Kid User Updated Successfully');
      return Util.getSimpleOkRequest('Kid Successfully Updated', res);
    } catch (ex) {
      this.logger.log(ex);
      await session.abortTransaction();
      return Util.getBadRequest(ex.message, res);
    } finally {
      session.endSession();
    }
  }

  async updateAndSaveKid(
    kid,
    updateKidDto: UpdateKidDto,
    session: ClientSession,
  ) {
    return await this.setKidAndSave(
      kid,
      {
        name: updateKidDto.name,
        age: updateKidDto.age,
        updated_at: Date.now(),
        gender: updateKidDto.gender,
        avatar:
          updateKidDto.avatar !== undefined
            ? updateKidDto.avatar
            : 'https://i.ibb.co/hcV96cm/pp-boy.png',
        birthday_date: updateKidDto.birthday_date,
      },
      session,
    );
  }

  async setKidAndSave(Kid, KidObj, session) {
    await Kid.set(KidObj);
    this.logger.log('updating Kid');
    await Kid.save({ session });
  }

  async deleteByAdmin(id, res) {
    const session = await this.connection.startSession();

    try {
      session.startTransaction();
      const kid = await this.removeSchool(id, session);
      if (!kid) return Util.getBadRequest('Kid Not Found with given id', res);
      const siblings = await this.checkSiblingsInSchool(
        kid.parent_id,
        kid.school_id,
        kid._id,
      );
      if (!siblings)
        await this.parentService.removeSchool(
          kid.parent_id,
          kid.school_id,
          session,
        );
      this.logger.log('Kid Successfully Deleted From School');
      await session.commitTransaction();
      return Util.getSimpleOkRequest(
        'Kid Successfully deleted From School',
        res,
      );
    } catch (ex) {
      this.logger.log(ex);
      await session.abortTransaction();
      return Util.getBadRequest(ex.message, res);
    } finally {
      session.endSession();
    }
  }

  async removeSchool(id, session) {
    return await this.kidModel.findByIdAndUpdate(
      id,
      {
        $set: {
          registered: false,
          registration_status: RegistartionStatus.NOT_REGISTERED,
          updated_at: Date.now(),
        },
        $unset: {
          school_id: 1,
          school_name: 1,
          class_id: 1,
          class_name: 1,
        },
      },
      { session, new: true },
    );
  }

  async checkSiblingsInSchool(parentId, schoolId, kidId) {
    this.logger.log(
      'checking if Kid has siblings in this school from which he had been removed?',
    );
    return await this.kidModel.findOne({
      parent_id: parentId,
      school_id: schoolId,
      _id: { $ne: kidId },
    });
  }

  async deleteAllSiblingsInSchool(parentId: mongoose.Types.ObjectId) {
    this.logger.log(
      'checking if Kid has siblings in this school from which he had been removed?',
    );

    const KidsDeleted = await this.kidModel.deleteMany({
      parent_id: parentId,
    });
    this.logger.log('The total seleted kids are ' + KidsDeleted.deletedCount);
    return KidsDeleted;
  }

  async deleteBySchoolAdmin(id, req, res) {
    const session = await this.connection.startSession();
    try {
      session.startTransaction();
      const response = await this.currentUser.getCurrentUser(
        req,
        UserType.SCHOOL_ADMIN,
        this.userModel,
      );
      if (response.status === Constant.FAIL)
        return Util.getBadRequest(response.message, res);
      this.logger.log('Current School Admin User Found');
      const schoolAdmin = response.data;
      if (schoolAdmin.registered !== true)
        return Util.getBadRequest('School Admin Not Registered', res);
      this.logger.log('School Admin is registered');
      let kid = await this.checkKidExistenceWithSchool(
        id,
        schoolAdmin.school_id,
      );
      if (!kid)
        return Util.getBadRequest('Kid Not Exist With This School', res);
      kid = await this.removeSchool(kid.id, session);
      if (!kid)
        return Util.getBadRequest('Failed To Delete Kid From School', res);
      const siblings = await this.checkSiblingsInSchool(
        kid.parent_id,
        schoolAdmin.school_id,
        kid._id,
      );
      if (!siblings)
        await this.parentService.removeSchool(
          kid.parent_id,
          schoolAdmin.school_id,
          session,
        );
      this.logger.log('Kid Successfully Deleted From School');
      await session.commitTransaction();
      return Util.getSimpleOkRequest(
        'Kid Successfully deleted From School',
        res,
      );
    } catch (ex) {
      this.logger.log(ex);
      await session.abortTransaction();
      return Util.getBadRequest(ex.message, res);
    } finally {
      session.endSession();
    }
  }

  async checkKidExistenceWithSchool(kidId, schoolId) {
    this.logger.log(
      'checking if Kid belongs to the school of current school admin user?',
    );
    return await this.kidModel.findOne({ _id: kidId, school_id: schoolId });
  }

  async deleteByParent(id: string, res: Response) {
    const session = await this.connection.startSession();
    try {
      session.startTransaction();
      const kid = await this.kidModel.findByIdAndRemove(id, {
        session,
      });
      if (!kid) return Util.getBadRequest('Kid Not Found with given id', res);
      const siblings = await this.checkSiblingsInSchool(
        kid.parent_id,
        kid.school_id,
        kid._id,
      );
      if (!siblings)
        await this.parentService.removeSchool(
          kid.parent_id,
          kid.school_id,
          session,
        );
      this.logger.log('these are siblings' + JSON.stringify(siblings, null, 4));
      this.logger.log('Kid Successfully Deleted From School');
      this.logger.log('Kid Successfully Deleted');
      await session.commitTransaction();
      return Util.getSimpleOkRequest('Kid Successfully deleted', res);
    } catch (ex) {
      this.logger.log(ex);
      await session.abortTransaction();
      return Util.getBadRequest(ex.message, res);
    } finally {
      session.endSession();
    }
  }

  async createKidByParent(
    createUserBody: UpdateKidDto,
    req: Request,
    res: Response,
  ) {
    const session = await this.connection.startSession();
    this.logger.log('req body is valid');
    try {
      session.startTransaction();
      const response = await this.currentUser.getCurrentUser(
        req,
        UserType.PARENT,
        this.userModel,
      );
      if (response.status === Constant.FAIL)
        return Util.getBadRequest(response.message, res);
      this.logger.log('Current Parent User Found');
      const parent = response.data;
      if (!parent) return Util.getBadRequest('Parent Not Found', res);
      this.logger.log('parent found');
      const kid = await this.createAndSave(createUserBody, parent, session);
      await session.commitTransaction();
      this.logger.log('Kid Created Successfully');
      return Util.getSimpleOkRequest('Kid Created Successfully', res);
    } catch (ex) {
      this.logger.log('Error While Creating kid ' + ex);
      await session.abortTransaction();
      return Util.getBadRequest(ex.message, res);
    } finally {
      session.endSession();
    }
  }

  async createAndSave(
    createUserBody: UpdateKidDto,
    parent,
    session: ClientSession,
  ) {
    return await this.save(
      {
        _id: new mongoose.Types.ObjectId(),
        name: createUserBody.name,
        age: createUserBody.age,
        registration_status: RegistartionStatus.NOT_REGISTERED,
        registered: parent.registered,
        gender: createUserBody.gender,
        birthday_date: createUserBody.birthday_date,
        avatar:
          createUserBody.avatar !== undefined
            ? createUserBody.avatar
            : 'https://i.ibb.co/hcV96cm/pp-boy.png',
        address: {
          _id: new mongoose.Types.ObjectId(),
          address_details: parent.user.address.address_details,
          area_name: parent.user.address.area_name,
          city: parent.user.address.city,
        },
        parent_id: parent._id,
        parent_name: parent.name,
      },
      session,
    );
  }

  async save(kidObj: Object, session) {
    this.logger.log('creating new Kid');
    const kid = new this.kidModel(kidObj);
    this.logger.log('saving Kid...');
    return await kid.save({ session });
  }

  async updateStatusToPending(req, school, session) {
    this.logger.log('updating pending status for Kids');
    const submittingInfo = req.body.submitting_info;
    let response;
    for (const info of submittingInfo) {
      console.log('CLASS ID', info.class_id);
      const standard = await this.classService.checkClassExistOrNot(
        info.class_id,
      );
      const kid = await this.kidModel.findById(info.kid_id);
      if (!kid) {
        this.logger.log('kid not found');
        response = { ...response, [info.kid_id]: 'kid not found' };
        continue;
      }
      if (!standard) continue;
      this.logger.log('class found!');
      if (standard.school_name != school.name) {
        this.logger.log('the class does not belog to given school');
        response = {
          ...response,
          [info.class_id]: 'the class does not belog to given school',
        };
        continue;
      }

      if (req.user.name !== kid.parent_name) {
        this.logger.log('the user is not kid parent');
        response = {
          ...response,
          [info.kid_id]: 'the user is not kid parent',
        };
        continue;
      }

      this.logger.log('class found!');
      await this.kidModel.findByIdAndUpdate(
        info.kid_id,
        {
          $set: {
            registration_status: RegistartionStatus.PENDING,
            school_id: school._id,
            school_name: school.name,
            class_id: standard._id,
            class_name: standard.standard,
            updated_at: Date.now(),
            'user.updated_at': Date.now(),
          },
        },
        { session, new: true, runValidators: true },
      );

      response = {
        ...response,
        [info.kid_id]: 'success',
      };
    }
    return response;
  }

  async removeSchoolDueToParentRemoval(parentId, schoolId, session) {
    return await this.kidModel.updateMany(
      { parent_id: parentId, school_id: schoolId },
      {
        $set: {
          registered: false,
          registration_status: RegistartionStatus.NOT_REGISTERED,
          updated_at: Date.now(),
        },
        $unset: {
          school_id: 1,
          school_name: 1,
          class_id: 1,
          class_name: 1,
        },
      },
      { session, new: true },
    );
  }
  async updateStatusToRegister(parentId, session) {
    return (
      await this,
      this.kidModel.updateMany(
        {
          parent_id: parentId,
          registration_status: RegistartionStatus.PENDING,
        },
        {
          $set: {
            registered: true,
            registration_status: RegistartionStatus.REGISTERED,
            updated_at: Date.now(),
          },
        },
        { session, new: true },
      )
    );
  }

  //no check applied
  async updateStatusToRegisterBySchoolAdmin(parentId, schoolId, session) {
    const obj = await this.kidModel.updateMany(
      {
        parent_id: parentId,
        registration_status: RegistartionStatus.PENDING,
        school_id: schoolId,
      },
      {
        $set: {
          registered: true,
          registration_status: RegistartionStatus.REGISTERED,
          updated_at: Date.now(),
        },
      },
      { session, new: true },
    );
    return obj;
  }
}
