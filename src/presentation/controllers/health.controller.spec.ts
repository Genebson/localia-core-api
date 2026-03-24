import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller.js';

describe('HealthController (unit)', () => {
  let controller: HealthController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  describe('/health (GET)', () => {
    it('should return JSON:API formatted health response', () => {
      const result = controller.check();

      expect(result.data).toBeDefined();
      expect(result.data.type).toBe('health');
      expect(result.data.id).toBe('1');
      expect(result.data.attributes.status).toBe('ok');
      expect(result.data.attributes.timestamp).toBeDefined();
      expect(new Date(result.data.attributes.timestamp)).toBeInstanceOf(Date);
    });
  });
});
