import { Test, TestingModule } from '@nestjs/testing';
import { DestacadoService } from './destacado.service';

describe('DestacadoService', () => {
  let service: DestacadoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DestacadoService],
    }).compile();

    service = module.get<DestacadoService>(DestacadoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
