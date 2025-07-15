import { Test, TestingModule } from '@nestjs/testing';
import { TokenTypeService } from './token-type.service';

describe('TokenTypeService', () => {
  let service: TokenTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TokenTypeService],
    }).compile();

    service = module.get<TokenTypeService>(TokenTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
