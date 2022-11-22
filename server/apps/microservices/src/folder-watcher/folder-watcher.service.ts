import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import chokidar from 'chokidar';
@Injectable()
export class FolderWatcherService {
  private log = new Logger(FolderWatcherService.name);

  constructor(private configService: ConfigService) {
    this.setup();
  }

  private async setup() {
    const watchLocation = this.configService.get('WATCH_LOCATION');
    if (watchLocation) {
      this.log.debug(
        `FolderWatcherService starting, watching file in location ${this.configService.get('WATCH_LOCATION')}`,
      );
      chokidar
        .watch(
          '/usr/src/app/watch/**/*.{jpeg,JPEG,png,PNG,jpg,JPG,heic,HEIC,heif,HEIF,mov,MOV,webp,WEBP,mp4,MP4,mov,MOV}',
          {
            ignored: /(^|[\/\\])\../,
            persistent: true,
            alwaysStat: true,
            awaitWriteFinish: true,
          },
        )
        .on('all', (event, path) => {
          this.log.debug(`Event ${event} triggered on path ${path}`);
        });
    }
  }
}
