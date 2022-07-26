import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Request, Response } from 'express';
import mongoose, { Model } from 'mongoose';
import { AdminService } from 'src/admin/admin.service';
import { PostDocumnet, User, UserDocument } from 'src/Schemas';
import { SchoolAdminService } from 'src/school-admin/school-admin.service';
import { SchoolService } from 'src/school/school.service';
import { TeacherService } from 'src/teacher/teacher.service';
import Constant from 'src/utils/enums/Constant.enum';
import { PostType } from 'src/utils/enums/PostType';
import { UserType } from 'src/utils/enums/UserType.enum';
import { Post } from 'src/Schemas';
import Util from 'src/utils/util';
import { CreateCommentDto } from './dto/create-comment.dto';
import CurrentUser from 'src/currentuser/currentuser.service';

@Injectable()
export class PostService {
  private readonly logger: Logger = new Logger(PostService.name);

  pageNumber = 1;
  pageSize = 20;

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Post.name) private readonly postModel: Model<PostDocumnet>,
    private readonly schoolService: SchoolService,
    @InjectConnection() private readonly connection: mongoose.Connection,
    private readonly currentUser: CurrentUser,
  ) {}

  async getAllPostsForAdmin(req, res) {
    this.logger.log('getting Posts list for admin');
    this.getAllPosts(res, {});
  }

  async getAllPostsForSchoolAdmin(req: Request, res: Response) {
    this.logger.log('getting Posts list for school admin');
    const response = await this.currentUser.getCurrentUser(
      req,
      UserType.SCHOOL_ADMIN,
      this.userModel,
    );
    if (response.status === Constant.FAIL)
      return Util.getBadRequest(response.message, res);
    this.logger.log('Current School Admin User Found');
    const schoolAdmin: any = response.data;
    this.getAllPosts(res, {
      $and: [{ type: PostType.UNICAST }, { school_id: schoolAdmin.school_id }],
    });
  }

  getAllPosts(res: Response, filter: Object) {
    this.logger.log('getting Posts list');
    this.postModel
      .find(filter)
      .skip((this.pageNumber - 1) * this.pageSize)
      .limit(this.pageSize)
      .sort({ created_at: -1 })
      .then((result) => {
        this.logger.log(result);
        return Util.getOkRequest(
          result,
          'Posts Listing Fetched Successfully',
          res,
        );
      })
      .catch((ex) => {
        this.logger.log(ex);
        return Util.getBadRequest(ex.message, res);
      });
  }

  async getAllPostsForParent(req: Request, res: Response) {
    this.logger.log('getting Posts list for parent');
    const response = await this.currentUser.getCurrentUser(
      req,
      UserType.PARENT,
      this.userModel,
    );
    if (response.status === Constant.FAIL)
      return Util.getBadRequest(response.message, res);
    this.logger.log('Current Parent User Found');
    const parent: any = response.data;
    var schoolIds = [];
    for (var school of parent.schools) {
      this.logger.log('hello' + school);
      schoolIds.push(school.school_id);
    }
    console.log('this is' + schoolIds);
    this.getAllPosts(res, {
      $or: [{ type: PostType.BROADCAST }, { school_id: schoolIds }],
    });
  }

  async getAllPostsForTeacher(req, res) {
    this.logger.log('getting Posts list for teacher');
    const response = await this.currentUser.getCurrentUser(
      req,
      UserType.TEACHER,
      this.userModel,
    );
    if (response.status === Constant.FAIL)
      return Util.getBadRequest(response.message, res);
    this.logger.log('Current Teacher User Found');
    const teacher: any = response.data;
    this.getAllPosts(res, {
      $and: [{ type: PostType.UNICAST }, { school_id: teacher.school_id }],
    });
  }

  async createPostByAdmin(req, res) {
    this.logger.log('creating Post for admin');
    const response = await this.currentUser.getCurrentUser(
      req,
      req.url.includes('school') ? UserType.SCHOOL_ADMIN : UserType.ADMIN,
      this.userModel,
    );
    if (response.status === Constant.FAIL)
      return Util.getBadRequest(response.message, res);
    this.logger.log('Current Admin User Found');
    const currentUser: any = response.data;
    this.createPost(
      req,
      res,
      currentUser,
      req.url.includes('school') ? UserType.SCHOOL_ADMIN : UserType.ADMIN,
      req.url.includes('school')
        ? currentUser.school_id
        : req.body.school_id
        ? req.body.school_id
        : null,
    );
  }

  async createPost(req, res, currentUser, userType, schoolId) {
    //Joi validation checking
    console.log('this is school id' + schoolId);
    const session = await this.connection.startSession();
    try {
      session.startTransaction();
      const school = await this.schoolService.checkSchoolExistOrNot(schoolId);
      const post = await this.createAndSave(
        req.body,
        school,
        currentUser,
        userType,
        session,
      );
      await session.commitTransaction();
      this.logger.log('Post Created Successfully');
      return Util.getOkRequest(post._id, 'Post Created Successfully', res);
    } catch (ex) {
      this.logger.log('Error While Creating Post ' + ex);
      await session.abortTransaction();
      return Util.getBadRequest(ex.message, res);
    } finally {
      session.endSession();
    }
  }

  async createAndSave(reqBody, school, currentUser, userType, session) {
    console.log(currentUser.name);
    var post = {
      _id: new mongoose.Types.ObjectId(),
      name: currentUser.name,
      user_id: currentUser.user_id,
      image: reqBody.image,
      content: reqBody.content,
      date: reqBody.date,
      time: reqBody.time,
      icon: reqBody.icon,
      type: school ? PostType.UNICAST : PostType.BROADCAST,
      user_type: userType,
      avatar:
        reqBody.avatar !== undefined
          ? reqBody.avatar
          : 'https://i.ibb.co/hcV96cm/pp-boy.png',
    };
    Object.assign(
      post,
      school && { school_id: school._id, school_name: school.name },
    );
    return await this.save(post, session);
  }

  async save(postObj, session) {
    this.logger.log('creating new Post');
    const post = new this.postModel(postObj);
    this.logger.log('saving Post...');
    return await post.save({ session });
  }

  async postComment(createCommentDto: CreateCommentDto, req, res) {
    this.logger.log('creating Comment');
    const response = await this.currentUser.getCurrentUserDetails(
      req,
      this.userModel,
    );
    if (response.status === Constant.FAIL)
      return Util.getBadRequest(response.message, res);
    this.logger.log('Current User Found');
    const currentUser = response.data;
    this.createComment(createCommentDto, req, res, currentUser);
  }

  async createComment(
    createCommentDto: CreateCommentDto,
    req,
    res,
    currentUser,
  ) {
    const session = await this.connection.startSession();
    this.logger.log('req body is valid');
    try {
      session.startTransaction();
      const post = await this.checkPostExistOrNot(req.query.postId);
      if (!post) return Util.getBadRequest('Post Not Found', res);
      const new_post: any = await this.saveComment(
        createCommentDto,
        currentUser,
        post,
        session,
      );
      await session.commitTransaction();
      this.logger.log('Comment Posted Successfully');
      return Util.getOkRequest(
        new_post.comments,
        'Comment Posted Successfully',
        res,
      );
    } catch (ex) {
      this.logger.log('Error While Posting Comment ' + ex);
      await session.abortTransaction();
      return Util.getBadRequest(ex.message, res);
    } finally {
      session.endSession();
    }
  }

  async checkPostExistOrNot(post_id) {
    this.logger.log('checking if post already exist or not?');
    return await this.postModel.findOne({ _id: post_id });
  }

  async saveComment(
    createCommentDto: CreateCommentDto,
    currentUser: Model<User>,
    post,
    session,
  ) {
    const newComment: comments = {
      comment: {
        _id: new mongoose.Types.ObjectId(),
        from: currentUser.name,
        avatar: createCommentDto.avatar,
        date: createCommentDto.date,
        message: createCommentDto.message,
      },
    };

    return await this.postModel.findByIdAndUpdate(
      post._id,
      {
        $push: {
          newComment,
        },
        $set: {
          updated_at: Date.now(),
        },
      },
      { session, new: true, runValidators: true },
    );
  }
}

class comment {
  _id: mongoose.Types.ObjectId;
  from: string;
  avatar: string;
  date: string;
  message: string;
}

class comments {
  comment: comment;
}
