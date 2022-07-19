import { Test, TestingModule } from '@nestjs/testing';
import { EndpointController } from './endpoint.controller';
import { EndpointService } from './endpoint.service';

describe('EndpointController', () => {
  let controller: EndpointController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EndpointController],
      providers: [EndpointService],
    }).compile();

    controller = module.get<EndpointController>(EndpointController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
