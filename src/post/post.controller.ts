import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { PermissionGuard } from 'src/Guard/permission.guard';
import { Request, Response } from 'express';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

@ApiTags('Post')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Get('/')
  getAllPostsForAdmin(@Req() req: Request, @Res() res: Response) {
    return this.postService.getAllPostsForAdmin(req, res);
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Get('/get/all/for/school/admin')
  getAllPostsForSchoolAdmin(@Req() req: Request, @Res() res: Response) {
    this.postService.getAllPostsForSchoolAdmin(req, res);
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Get('/get/all/for/parent')
  getAllPostsForParent(@Req() req: Request, @Res() res: Response) {
    return this.postService.getAllPostsForParent(req, res);
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Get('/get/all/for/teacher')
  getAllPostsForTeacher(@Req() req: Request, @Res() res: Response) {
    return this.postService.getAllPostsForTeacher(req, res);
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Post('/')
  createPostByAdmin(
    @Body() createPostDto: CreatePostDto,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    return this.postService.createPostByAdmin(req, res);
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Post('/by/school/admin')
  createPostBySchoolAdmin(
    @Body() createPostDto: CreatePostDto,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    return this.postService.createPostByAdmin(req, res);
  }

  @Post('/comment')
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  postComment(
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    this.postService.postComment(createCommentDto, req, res);
  }
}
