import { Test, TestingModule } from '@nestjs/testing';
import { ChatAuthController } from './chatAuth.controller';
import { ChatAuthService } from './chatAuth.service';

describe('AuthController', () => {
  let controller: ChatAuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatAuthController],
      providers: [ChatAuthService],
    }).compile();

    controller = module.get<ChatAuthController>(ChatAuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
