import { IsOptional, IsString, IsInt, IsDateString, IsEnum } from 'class-validator';
import { TripStatus } from '@prisma/client';

export class UpdateTripDto {
  @IsString()
  @IsOptional()
  vehicleNumber?: string;

  @IsString()
  @IsOptional()
  origin?: string;

  @IsString()
  @IsOptional()
  destination?: string;

  @IsDateString()
  @IsOptional()
  scheduledStart?: string;

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
