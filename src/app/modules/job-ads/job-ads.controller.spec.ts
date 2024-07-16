import { Test, TestingModule } from '@nestjs/testing';
import { JobAdsController } from './job-ads.controller';
import { JobAdsService } from './job-ads.service';

describe('JobAdsController', () => {
	let controller: JobAdsController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [JobAdsController],
			providers: [JobAdsService],
		}).compile();

		controller = module.get<JobAdsController>(JobAdsController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
