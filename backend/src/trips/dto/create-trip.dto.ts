import { IsNotEmpty, IsString, IsInt, IsOptional, IsDateString, IsEnum, MinLength, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { TripStatus } from '@prisma/client';

export class CreateTripDto {
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(30)
  vehicleNumber!: string;

  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  origin!: string;

  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  destination!: string;

  @IsDateString()
  @IsNotEmpty()
  scheduledStart!: string;

  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
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
