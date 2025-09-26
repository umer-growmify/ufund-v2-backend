import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Profile')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('all-campaigners')
  @ApiOperation({
    summary: 'It will ',
  })
  @ApiResponse({
    status: 200,
    description: 'Profile created and updated successfully',
  })
  async getAllCampaigners() {}
}
