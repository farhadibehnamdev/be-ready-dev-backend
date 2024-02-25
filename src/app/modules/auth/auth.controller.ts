import { Body, Controller, Get, Post, Query, Res, Req } from '@nestjs/common';

import { AuthUser } from '@shared/decorators/auth-user.decorator';
import { AllowAnonymous } from '@shared/decorators/public.decorator';
import { Roles } from '@shared/decorators/roles.decorator';
import { RoleTypeEnum } from '@shared/enums/role-type.enum';
import { JwtPayload } from '@shared/interfaces/jwt-payload.interface';

import { AuthService } from './auth.service';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { Request, Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Authentication')
@Roles(RoleTypeEnum.All)
export class AuthController {
  constructor(private authService: AuthService) {}
  @Get('test')
  @AllowAnonymous()
  async test() {
    return { status: 'ok' };
  }
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'User successfully logged in.' })
  @ApiBody({ type: LoginDto })
  @Post('login')
  @AllowAnonymous()
  async login(@Res() res: Response, @Body() loginDto: LoginDto) {
    return this.authService.login(res, loginDto);
  }

  @Post('register')
  @AllowAnonymous()
  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({ status: 201, description: 'User successfully registered.' })
  @ApiBody({ type: RegisterDto })
  async register(@Body() registerUserDto: RegisterDto) {
    return this.authService.register(registerUserDto);
  }

  @Get('logout')
  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ status: 200, description: 'User successfully logged out.' })
  async logout(@Req() req: Request, @Res() res: Response) {
    return this.authService.logout(req, res);
  }

  // @ApiOperation({ summary: 'Generate authentication tokens' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Authentication tokens generated successfully.',
  // })
  @Get('generate/tokens')
  @AllowAnonymous()
  async generateTokens(@Req() req: Request, @Res() res: Response) {
    console.log('res :: ', res);
    return this.authService.generateTokens(req, res);
  }

  @Post('forgot-password')
  @AllowAnonymous()
  @ApiOperation({ summary: 'Request password reset' })
  @ApiResponse({
    status: 200,
    description: 'Password reset request sent successfully.',
  })
  @ApiBody({ type: ForgotPasswordDto })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  @AllowAnonymous()
  @ApiOperation({ summary: 'Reset user password' })
  @ApiResponse({
    status: 200,
    description: 'User password reset successfully.',
  })
  @ApiBody({ type: ResetPasswordDto })
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
    @Query('token') token: string,
  ) {
    return this.authService.resetPassword(resetPasswordDto, token);
  }

  @Get('verify-email')
  @AllowAnonymous()
  @ApiOperation({ summary: 'Verify user email' })
  @ApiResponse({
    status: 200,
    description: 'User email verified successfully.',
  })
  async verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  @Get('user-role')
  @ApiOperation({ summary: 'Get user role' })
  @ApiResponse({ status: 200, description: 'Returns the user role.' })
  async userRole(@Req() req: Request, @Res() res: Response) {
    return this.authService.userRole(req, res);
  }

  @Get('profile')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'Returns the user profile.' })
  async profile(@Req() req: Request, @Res() res: Response) {
    return this.authService.profile(req, res);
  }

  @Post('send-verification-email')
  @ApiOperation({ summary: 'Send email verification link' })
  @ApiResponse({
    status: 200,
    description: 'Verification email sent successfully.',
  })
  async sendVerificationEmail(@AuthUser() user: JwtPayload) {
    return this.authService.sendVerificationEmail(user);
  }
}
