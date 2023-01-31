import { AssetEntity, ExifEntity, SmartInfoEntity, UserEntity, APIKeyEntity, InfraModule } from '@app/infra';
import { StorageModule } from '@app/storage';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommunicationModule } from '../../immich/src/api-v1/communication/communication.module';
import { MicroservicesService } from './microservices.service';
import { AssetUploadedProcessor } from './processors/asset-uploaded.processor';
import { GenerateChecksumProcessor } from './processors/generate-checksum.processor';
import { MachineLearningProcessor } from './processors/machine-learning.processor';
import { MetadataExtractionProcessor } from './processors/metadata-extraction.processor';
import { StorageMigrationProcessor } from './processors/storage-migration.processor';
import { ThumbnailGeneratorProcessor } from './processors/thumbnail.processor';
import { UserDeletionProcessor } from './processors/user-deletion.processor';
import { VideoTranscodeProcessor } from './processors/video-transcode.processor';
import { BackgroundTaskProcessor } from './processors/background-task.processor';

@Module({
  imports: [
    InfraModule,
    TypeOrmModule.forFeature([UserEntity, ExifEntity, AssetEntity, SmartInfoEntity, APIKeyEntity]),
    StorageModule,
    CommunicationModule,
  ],
  controllers: [],
  providers: [
    MicroservicesService,
    AssetUploadedProcessor,
    ThumbnailGeneratorProcessor,
    MetadataExtractionProcessor,
    VideoTranscodeProcessor,
    GenerateChecksumProcessor,
    MachineLearningProcessor,
    UserDeletionProcessor,
    StorageMigrationProcessor,
    BackgroundTaskProcessor,
  ],
})
export class MicroservicesModule {}
