import { Test, TestingModule } from '@nestjs/testing';
import { BlogArticuloController } from './blog-articulo.controller';

describe('BlogArticuloController', () => {
  let controller: BlogArticuloController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlogArticuloController],
    }).compile();

    controller = module.get<BlogArticuloController>(BlogArticuloController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
