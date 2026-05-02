import { Test, TestingModule } from '@nestjs/testing';
import { BlogArticuloService } from './blog-articulo.service';

describe('BlogArticuloService', () => {
  let service: BlogArticuloService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlogArticuloService],
    }).compile();

    service = module.get<BlogArticuloService>(BlogArticuloService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
