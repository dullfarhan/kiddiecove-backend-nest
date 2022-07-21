import { Test, TestingModule } from '@nestjs/testing';
import { SchoolAdminController } from './school-admin.controller';
import { SchoolAdminService } from './school-admin.service';

describe('SchoolAdminController', () => {
  let controller: SchoolAdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SchoolAdminController],
      providers: [SchoolAdminService],
    }).compile();

    controller = module.get<SchoolAdminController>(SchoolAdminController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
