import { StreamableFile } from '@nestjs/common';
import { Response } from 'express';
import {
  IMMICH_ARCHIVE_COMPLETE,
  IMMICH_ARCHIVE_FILE_COUNT,
  IMMICH_CONTENT_LENGTH_HINT,
} from '../constants/download.constant';
import { DownloadArchive } from '../modules/download/download.service';

export function sendArchive(res: Response, archive: DownloadArchive): StreamableFile {
  const { stream, fileName, fileSize, fileCount, complete } = archive;
  res.attachment(fileName);
  res.setHeader(IMMICH_CONTENT_LENGTH_HINT, fileSize);
  res.setHeader(IMMICH_ARCHIVE_FILE_COUNT, fileCount);
  res.setHeader(IMMICH_ARCHIVE_COMPLETE, `${complete}`);
  return stream;
}
