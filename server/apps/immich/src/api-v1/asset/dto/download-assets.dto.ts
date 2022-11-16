import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class DownloadAssetsDto {
  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  name = '';

  @ApiProperty({
    isArray: true,
    type: String,
    title: 'Array of asset IDs to download',
  })
  @IsNotEmpty({ each: true })
  @IsString({ each: true })
  assetIds!: string[];

  @IsOptional()
  @IsPositive()
  @IsNumber()
  skip?: number;
}
