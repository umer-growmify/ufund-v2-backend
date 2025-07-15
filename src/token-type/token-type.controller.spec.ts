import { Test, TestingModule } from '@nestjs/testing';
import { TokenTypeController } from './token-type.controller';
import { TokenTypeService } from './token-type.service';

describe('TokenTypeController', () => {
  let controller: TokenTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TokenTypeController],
      providers: [TokenTypeService],
    }).compile();

    controller = module.get<TokenTypeController>(TokenTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
