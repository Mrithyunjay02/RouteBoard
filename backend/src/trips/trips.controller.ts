import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { TripsService } from './trips.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';

@Controller('trips')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() createTripDto: CreateTripDto) {
    return this.tripsService.create(createTripDto);
  }

  @Get()
  findAll(@Request() req: any, @Query('driverId') driverId?: string) {
    const parsedDriverId = driverId ? parseInt(driverId, 10) : undefined;
    return this.tripsService.findAll(req.user, parsedDriverId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.tripsService.findOne(+id, req.user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTripDto: UpdateTripDto, @Request() req: any) {
    return this.tripsService.update(+id, updateTripDto, req.user);
  }

}
