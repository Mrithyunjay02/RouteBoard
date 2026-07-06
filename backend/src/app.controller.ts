import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getRoot() {
    return {
      "name": "RouteBoard API",
      "status": "Running",
      "version": "1.0.0",
      "message": "Backend deployed successfully.",
      "frontend": "https://frontend-three-snowy-32.vercel.app"
    };
  }
}
