import { IsOptional, IsString, IsInt, IsDateString, IsEnum, MinLength, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { TripStatus } from '@prisma/client';

export class UpdateTripDto {
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(30)
  vehicleNumber?: string;

  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(100)
  origin?: string;

  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(100)
  destination?: string;

  @IsDateString()
  @IsOptional()
  scheduledStart?: string;

  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  @IsString()
  @IsOptional()
  notes?: string;

  @IsInt()
  @IsOptional()
  driverId?: number;

  @IsEnum(TripStatus)
  @IsOptional()
  status?: TripStatus;
}
