"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TripsController = void 0;
const common_1 = require("@nestjs/common");
const trips_service_1 = require("./trips.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
const create_trip_dto_1 = require("./dto/create-trip.dto");
const update_trip_dto_1 = require("./dto/update-trip.dto");
let TripsController = class TripsController {
    tripsService;
    constructor(tripsService) {
        this.tripsService = tripsService;
    }
    create(createTripDto) {
        return this.tripsService.create(createTripDto);
    }
    findAll(req, driverId) {
        const parsedDriverId = driverId ? parseInt(driverId, 10) : undefined;
        return this.tripsService.findAll(req.user, parsedDriverId);
    }
    findOne(id, req) {
        return this.tripsService.findOne(+id, req.user);
    }
    update(id, updateTripDto, req) {
        return this.tripsService.update(+id, updateTripDto, req.user);
    }
};
exports.TripsController = TripsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_trip_dto_1.CreateTripDto]),
    __metadata("design:returntype", void 0)
], TripsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('driverId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], TripsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TripsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_trip_dto_1.UpdateTripDto, Object]),
    __metadata("design:returntype", void 0)
], TripsController.prototype, "update", null);
exports.TripsController = TripsController = __decorate([
    (0, common_1.Controller)('trips'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [trips_service_1.TripsService])
], TripsController);
//# sourceMappingURL=trips.controller.js.map