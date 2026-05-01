import { Test, TestingModule } from '@nestjs/testing';
import { DestacadoController } from './destacado.controller';

describe('DestacadoController', () => {
  let controller: DestacadoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DestacadoController],
    }).compile();

    controller = module.get<DestacadoController>(DestacadoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
