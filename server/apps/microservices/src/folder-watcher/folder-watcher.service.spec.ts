import { Test, TestingModule } from '@nestjs/testing';
import { FolderWatcherService } from './folder-watcher.service';

describe('FolderWatcherService', () => {
  let service: FolderWatcherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FolderWatcherService],
    }).compile();

    service = module.get<FolderWatcherService>(FolderWatcherService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
