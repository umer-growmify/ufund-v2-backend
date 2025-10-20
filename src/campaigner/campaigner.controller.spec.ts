import { Test, TestingModule } from '@nestjs/testing';
import { CampaignerController } from './campaigner.controller';
import { CampaignerService } from './campaigner.service';

describe('CampaignerController', () => {
  let controller: CampaignerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CampaignerController],
      providers: [CampaignerService],
    }).compile();

    controller = module.get<CampaignerController>(CampaignerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
