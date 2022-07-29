import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import {
  School,
  SchoolDocument,
  ParentDocument,
  Parent,
  AddressDocument,
  Address,
} from 'src/Schemas';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { CityService } from 'src/city/city.service';
import { AddressService } from 'src/address/address.service';
import { RolesService } from 'src/roles/roles.service';
import { UserService } from 'src/user/user.service';
import { SchoolAdminService } from 'src/school-admin/school-admin.service';
import Util from 'src/utils/util';
import { UserType } from 'src/utils/enums/UserType.enum';
import generateQR from 'src/utils/QrCodeGenerator';
import makePdf from 'src/utils/PdfGenerator';
import Constant from 'src/utils/enums/Constant.enum';

@Injectable()
export class SchoolService {
  constructor(
    @InjectConnection() private readonly connection: mongoose.Connection,
    @InjectModel(School.name)
    private SchoolModel: Model<SchoolDocument>,
    @InjectModel(Address.name)
    private AddressModel: Model<AddressDocument>,
    private readonly schoolAdminService: SchoolAdminService,
    private readonly cityService: CityService,
    private readonly addressService: AddressService,
  ) {}
  private readonly logger = new Logger(SchoolService.name);
  pageNumber = 1;
  pageSize = 10;

  getAllAsListing(req, res) {
    this.logger.log('getting School as listing for admin');
    this.SchoolModel.find({ enable: true })
      .skip((this.pageNumber - 1) * this.pageSize)
      .limit(this.pageSize)
      .sort({ name: 1 })
      .select({ name: 1 })
      .then((result) => {
        this.logger.log(result);
        return Util.getOkRequest(
          result,
          'Schools Listing Fetched Successfully for admin',
          res,
        );
      })
      .catch((ex) => {
        this.logger.log(ex);
        return Util.getBadRequest(ex.message, res);
      });
  }

  getAllForAdmin(req, res) {
    this.logger.log('getting School as listing for admin');
    this.SchoolModel.find({ enable: true })
      .skip((this.pageNumber - 1) * this.pageSize)
      .limit(this.pageSize)
      .sort({ name: 1 })
      .then((result) => {
        this.logger.log(result);
        return Util.getOkRequest(
          result,
          'Schools Listing Fetched Successfully for admin',
          res,
        );
      })
      .catch((ex) => {
        this.logger.log(ex);
        return Util.getBadRequest(ex.message, res);
      });
  }

  async checkSchoolExistOrNot(schoolId) {
    this.logger.log('checking school exist or not');
    return await this.SchoolModel.findOne({ _id: schoolId });
  }

  async getForAdmin(req, res) {
    try {
      this.logger.log('checking if School with given id exist or not');
      const school = await this.SchoolModel.findOne({
        _id: req.params.id,
      });
      if (!school)
        return Util.getBadRequest('School Not Found with given id', res);
      this.logger.log('School exist');
      this.logger.log('School Details Fetched Succesfully');
      return Util.getOkRequest(
        school,
        'School Details Fetched Successfully',
        res,
      );
    } catch (ex) {
      this.logger.log(ex);
      return Util.getBadRequest(ex.message, res);
    }
  }

  async updateByAdmin(req, res) {
    const session = await this.connection.startSession();
    this.logger.log('validating req body');
    // const { error } = validateSchool(req.body);
    // if (error) return Util.getBadRequest(error.details[0].message, res);
    this.logger.log('req body is valid');
    try {
      session.startTransaction();
      const city = await this.cityService.checkCityExistOrNot(req.body.city_id);
      if (!city) return Util.getBadRequest('City Not Found with given id', res);
      this.logger.log('city found');
      const school = await this.SchoolModel.findOne({ _id: req.params.id });
      if (!school)
        return Util.getBadRequest('School Not Found with given id', res);
      this.logger.log('School found');
      const address = await this.AddressModel.findOne({
        _id: school.address_id,
      });
      if (!address)
        return Util.getBadRequest('Address Not Found with given id', res);
      this.logger.log('address found');
      await this.addressService.updateAddress(address, req.body, city, session);
      this.logger.log(`updated address ${address}`);
      await this.updateAndSaveSchool(school, req.body, city, session);
      this.logger.log(`updated School ${school}`);
      await session.commitTransaction();
      this.logger.log('School and School Address Updated Successfully');
      return Util.getSimpleOkRequest('School Successfully Updated', res);
    } catch (ex) {
      this.logger.log(ex);
      await session.abortTransaction();
      return Util.getBadRequest(ex.message, res);
    } finally {
      session.endSession();
    }
  }

  async updateDirectlyByAdmin(req, res) {
    const session = await this.connection.startSession();

    this.logger.log('validating req body');
    // const { error } = validateSchool(req.body);
    // if (error) return Util.getBadRequest(error.details[0].message, res);
    this.logger.log('req body is valid');
    try {
      session.startTransaction();
      const city = await this.cityService.checkCityExistOrNot(req.body.city_id);
      if (!city) return Util.getBadRequest('City Not Found', res);
      this.logger.log('city found');
      const school = await this.updateDirectly(
        req.params.id,
        req.body,
        city,
        session,
      );
      this.logger.log(`updated School ${school}`);
      const address = await this.addressService.updateDirectly(
        school.address_id,
        req.body,
        city,
        session,
      );
      this.logger.log(`updated address ${address}`);
      await session.commitTransaction();
      this.logger.log('School and School Address Updated Successfully');
      return Util.getSimpleOkRequest('School Successfully Updated', res);
    } catch (ex) {
      this.logger.log(ex);
      await session.abortTransaction();
      return Util.getBadRequest(ex.message, res);
    } finally {
      session.endSession();
    }
  }

  async deleteByAdmin(req, res) {
    const session = await this.connection.startSession();

    try {
      session.startTransaction();
      const school = await this.SchoolModel.findByIdAndRemove(req.params.id, {
        session,
      });
      if (!school)
        return Util.getBadRequest('School Not Found with given id', res);
      this.logger.log('School Successfully Deleted');
      const address = await this.AddressModel.findByIdAndRemove(
        school.address_id,
        {
          session,
        },
      );
      if (!address)
        return Util.getBadRequest('Address Not Found with given id', res);
      this.logger.log('Address Successfully Deleted');
      this.logger.log('Getting School Admin details from deleted School');
      let schoolAdmin =
        await this.schoolAdminService.checkSchoolAdminExistOrNot(
          school.school_admin_id,
        );
      schoolAdmin = await this.schoolAdminService.removeSchool(
        schoolAdmin._id,
        session,
      );
      if (!schoolAdmin)
        return Util.getBadRequest('School Admin Not Un Registered', res);
      this.logger.log('School Admin Un Registered');
      await session.commitTransaction();
      Util.getSimpleOkRequest('School Successfully deleted', res);
    } catch (ex) {
      this.logger.log(ex);
      await session.abortTransaction();
      return Util.getBadRequest(ex.message, res);
    } finally {
      session.endSession();
    }
  }

  async getQrCodeForAdmin(req, res) {
    try {
      this.logger.log('checking if School with given id exist or not');
      const school = await this.SchoolModel.findOne({ _id: req.params.id });
      if (!school)
        return Util.getBadRequest('School Not Found with given id', res);
      this.logger.log('School exist');
      this.logger.log('School Details Fetched Succesfully');
      const pdf = await this.generateQrCode(req, res, school);
      this.logger.log(school.name.replace(/\s/g, ''));
      res.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-Disposition':
          'attachment; filename=' + school.name.replace(/\s/g, '') + '.pdf',
        'Content-Length': pdf.length,
      });
      res.end(pdf);
    } catch (ex) {
      this.logger.log(ex);
      return Util.getBadRequest(ex.message, res);
    }
  }

  async generateQrCode(req, res, school) {
    try {
      this.logger.log('Generating Pdf For School');
      console.log(school);
      const qrCode = await generateQR(school._id.toString());
      return await makePdf(qrCode, school);
    } catch (ex) {
      this.logger.log(ex);
      return Util.getBadRequest(ex.message, res);
    }
  }

  // async getQrCodeForSchoolAdmin(req, res) {
  //   try {
  //     const response = await CurrentUser.getCurrentUser(
  //       req,
  //       UserType.SCHOOL_ADMIN,
  //     );
  //     if (response.status === Constant.FAIL)
  //       return Util.getBadRequest(response.message, res);
  //     this.logger.log('Current School Admin User Found');
  //     const schoolAdmin = response.data;
  //     if (schoolAdmin.registered !== true)
  //       return Util.getBadRequest('School Admin Not Registered', res);
  //     this.logger.log('School Admin is registered');
  //     this.logger.log('checking if School with given id exist or not');
  //     const school = await this.SchoolModel.findOne({
  //       _id: schoolAdmin.school_id,
  //     });
  //     if (!school)
  //       return Util.getBadRequest(
  //         'School Not Found with given id For School Admin',
  //         res,
  //       );
  //     this.logger.log('School exist');
  //     this.logger.log('School Details Fetched Succesfully');
  //     const pdf = await this.generateQrCode(req, res, school);
  //     this.logger.log(school.name.replace(/\s/g, ''));
  //     res.writeHead(200, {
  //       'Content-Type': 'application/pdf',
  //       'Content-Disposition':
  //         'attachment; filename=' + school.name.replace(/\s/g, '') + '.pdf',
  //       'Content-Length': pdf.length,
  //     });
  //     res.end(pdf);
  //   } catch (ex) {
  //     this.logger.log(ex);
  //     return Util.getBadRequest(ex.message, res);
  //   }
  // }

  // async approveRequest(req, res) {
  //   const session = await this.connection.startSession();
  //   try {
  //     session.startTransaction();
  //     const parent = await parentService.checkParentExistOrNot(req.params.id);
  //     if (!parent) return Util.getBadRequest('parent not found', res);
  //     if (!parent.schools)
  //       return Util.getBadRequest('parent not requested yet', res);
  //     //make reuse of this code also using in post get by parent
  //     const schoolIds = [];
  //     for (const school of parent.schools) {
  //       this.logger.log('hello' + school);
  //       schoolIds.push(school.school_id);
  //     }
  //     console.log('this is' + schoolIds);
  //     await parentService.updateStatusToRegister(parent, schoolIds, session);
  //     await kidService.updateStatusToRegister(parent._id, session);
  //     await this.userService.updateParentUserConnection(
  //       parent.user_id,
  //       session,
  //     );
  //     await session.commitTransaction();
  //     return Util.getSimpleOkRequest('Parent Successfully Registered', res);
  //   } catch (ex) {
  //     this.logger.log('Error While Submitting Parent Request ' + ex);
  //     await session.abortTransaction();
  //     return Util.getBadRequest(ex.message, res);
  //   } finally {
  //     session.endSession();
  //   }
  // }

  // async approveRequestBySchoolAdmin(req, res) {
  //   const session = await this.connection.startSession();
  //   try {
  //     session.startTransaction();
  //     const parent = await parentService.checkParentExistOrNot(req.params.id);
  //     if (!parent) return Util.getBadRequest('parent not found', res);
  //     if (!parent.schools)
  //       return Util.getBadRequest('parent not requested yet', res);
  //     //get school admin school
  //     const response = await CurrentUser.getCurrentUser(
  //       req,
  //       UserType.SCHOOL_ADMIN,
  //     );
  //     if (response.status === Constant.FAIL)
  //       return Util.getBadRequest(response.message, res);
  //     this.logger.log('Current School Admin User Found');
  //     const schoolAdmin = response.data;
  //     if (schoolAdmin.registered !== true)
  //       return Util.getBadRequest('School Admin Not Registered', res);
  //     this.logger.log('School Admin is registered');
  //     this.logger.log('checking if School with given id exist or not');
  //     const school = await this.SchoolModel.findOne({
  //       _id: schoolAdmin.school_id,
  //     });
  //     if (!school)
  //       return Util.getBadRequest(
  //         'School Not Found with given id For School Admin',
  //         res,
  //       );
  //     this.logger.log('School Admin School exist');
  //     await parentService.updateStatusToRegister(
  //       parent._id,
  //       school._id,
  //       session,
  //     );
  //     await kidService.updateStatusToRegisterBySchoolAdmin(
  //       parent._id,
  //       school._id,
  //       session,
  //     );
  //     await this.userService.updateParentUserConnection(
  //       parent.user_id,
  //       session,
  //     );
  //     await session.commitTransaction();
  //     return Util.getSimpleOkRequest('Parent Successfully Registered', res);
  //   } catch (ex) {
  //     this.logger.log('Error While Submitting Parent Request ' + ex);
  //     await session.abortTransaction();
  //     return Util.getBadRequest(ex.message, res);
  //   } finally {
  //     session.endSession();
  //   }
  // }

  async createByAdmin(req, res) {
    //Joi validation checking
    const session = await this.connection.startSession();
    this.logger.log('validating req body');
    // const { error } = validateSchool(req.body);
    // if (error) return Util.getBadRequest(error.details[0].message, res);
    this.logger.log('req body is valid');
    try {
      session.startTransaction();
      if (await this.checkSchoolAlreadyRegisteredOrNot(req.body.campus_code))
        return Util.getBadRequest('School already created', res);
      this.logger.log('school not created');
      const city = await this.cityService.checkCityExistOrNot(req.body.city_id);
      if (!city) return Util.getBadRequest('City Not Found', res);
      this.logger.log('city found');
      const schoolAdmin =
        await this.schoolAdminService.checkSchoolAdminExistOrNot(
          req.body.school_admin_id,
        );
      if (!schoolAdmin)
        return Util.getBadRequest('School Admin Not Found', res);
      this.logger.log('School Admin found');
      if (schoolAdmin.registered)
        return Util.getBadRequest(
          `School Admin Already Registered With ${schoolAdmin.school.name}`,
          res,
        );
      this.logger.log('School Admin Not Registered With Any School');
      const address = await this.addressService.createAndSave(
        req.body,
        city,
        session,
      );
      this.logger.log('School Address Created Successfully');
      const school = await this.createAndSave(
        req.body,
        address,
        schoolAdmin,
        city,
        session,
      );

      this.logger.log('School Created Successfully');
      this.logger.log(
        `Registering School Admin ${schoolAdmin.name} with School ${school.name}`,
      );
      await this.schoolAdminService.addSchool(
        schoolAdmin._id,
        req.body,
        session,
        school,
      );
      this.logger.log(
        `School Admin ${schoolAdmin.name} Registered Successfully with School ${school.name}`,
      );
      await session.commitTransaction();
      return Util.getSimpleOkRequest('School Created Successfully', res);
    } catch (ex) {
      this.logger.log('Error While Creating School ' + ex);
      await session.abortTransaction();
      return Util.getBadRequest(ex.message, res);
    } finally {
      session.endSession();
    }
  }

  async save(schoolObj, session) {
    this.logger.log('creating new School');
    const school = new this.SchoolModel(schoolObj);
    this.logger.log('saving School...');
    return await school.save({ session });
  }

  async createAndSave(reqBody, address, schoolAdmin, city, session) {
    return await this.save(
      {
        _id: new mongoose.Types.ObjectId(),
        name: reqBody.name,
        description: reqBody.description,
        type: reqBody.type,
        campus_code: reqBody.campus_code,
        branch_name: reqBody.branch_name,
        email: reqBody.email,
        phone_number: reqBody.phone_number,
        address: {
          _id: new mongoose.Types.ObjectId(),
          address_details: reqBody.address_details,
          area_name: reqBody.area_name,
          city: city.name,
        },
        address_id: address._id,
        school_admin_name: schoolAdmin.name,
        school_admin_id: schoolAdmin._id,
      },
      session,
    );
  }

  async checkSchoolAlreadyRegisteredOrNot(campus_code) {
    this.logger.log('checking if school already registered or not?');
    return await this.SchoolModel.findOne({ campus_code: campus_code });
  }

  async setSchoolAndSave(school, schoolObj, session) {
    await school.set(schoolObj);
    this.logger.log('updating School');
    await school.save({ session });
  }

  async updateDirectly(id, reqBody, city, session) {
    return await this.SchoolModel.findByIdAndUpdate(
      id,
      {
        $set: {
          name: reqBody.name,
          description: reqBody.description,
          type: reqBody.type,
          campus_code: reqBody.campus_code,
          branch_name: reqBody.branch_name,
          email: reqBody.email,
          phone_number: reqBody.phone_number,
          'address.address_details': reqBody.address_details,
          'address.area_name': reqBody.area_name,
          'address.city': city.name,
        },
      },
      { session, new: true, runValidators: true },
    );
  }

  async updateAndSaveSchool(school, reqBody, city, session) {
    return await this.setSchoolAndSave(
      school,
      {
        name: reqBody.name,
        description: reqBody.description,
        type: reqBody.type,
        campus_code: reqBody.campus_code,
        branch_name: reqBody.branch_name,
        email: reqBody.email,
        phone_number: reqBody.phone_number,
        'address.address_details': reqBody.address_details,
        'address.area_name': reqBody.area_name,
        'address.city': city.name,
      },
      session,
    );
  }
  //////////////////////////////////////////////////////////////////
  // this.logger.log = Debug('app:services:school');

  create(createSchoolDto: CreateSchoolDto) {
    return 'This action adds a new school';
  }

  findAll() {
    return `This action returns all school`;
  }

  findOne(id: number) {
    return `This action returns a #${id} school`;
  }

  update(id: number, updateSchoolDto: UpdateSchoolDto) {
    return `This action updates a #${id} school`;
  }

  remove(id: number) {
    return `This action removes a #${id} school`;
  }

  // async checkSchoolExistOrNot(
  //   school_id: mongoose.Types.ObjectId,
  // ): Promise<SchoolDocument> {
  //   this.logger.log('checking if school exist or not');
  //   return await this.schoolModel.findOne({ _id: school_id });
  // }
}
