import { IsNotEmpty, IsString, IsInt, IsOptional, IsDateString, IsEnum } from 'class-validator';
import { TripStatus } from '@prisma/client';

export class CreateTripDto {
  @IsString()
  @IsNotEmpty()
  vehicleNumber!: string;

  @IsString()
  @IsNotEmpty()
  origin!: string;

  @IsString()
  @IsNotEmpty()
  destination!: string;

  @IsDateString()
  @IsNotEmpty()
  scheduledStart!: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsInt()
  @IsNotEmpty()
  driverId!: number;

  @IsEnum(TripStatus)
  @IsOptional()
  status?: TripStatus;
}
