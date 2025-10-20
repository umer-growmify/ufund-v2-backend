import { Test, TestingModule } from '@nestjs/testing';
import { CampaignerService } from './campaigner.service';

describe('CampaignerService', () => {
  let service: CampaignerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CampaignerService],
    }).compile();

    service = module.get<CampaignerService>(CampaignerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
