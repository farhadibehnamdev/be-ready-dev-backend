import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import { Types } from 'mongoose';

import { ITokenDocument } from '@modules/token/interfaces/token.interface';
import { TokenRepository } from '@modules/token/repositories/token.repository';
import { IUserDocument } from '@modules/user/interfaces/user.interface';
import { UserRepository } from '@modules/user/repositories/user.repository';
import {
  HttpException,
  HttpStatus,
  Injectable,
  Req,
  Res,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DebuggerService } from '@shared/debugger/debugger.service';
import { TokenTypes } from '@shared/enums/token-type.enum';
import { JwtPayload } from '@shared/interfaces/jwt-payload.interface';
import { MessagesMapping } from '@shared/messages-mapping';
import { MailService } from '@shared/services/mail.service';

import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { LoginDto } from './dtos/login.dto';
import { LogoutDto } from './dtos/logout.dto';
import { RegisterDto } from './dtos/register.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { TokenDto } from './dtos/token.dto';
import { Request, Response } from 'express';
interface UserPayload {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isEmailVerified: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface RequestWithUser extends Request {
  sub: UserPayload;
  iat: number;
  exp: number;
  type: string;
}
@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenRepository: TokenRepository,
    private readonly debuggerService: DebuggerService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
  ) {}

  private async refreshTokenExistance(user: IUserDocument): Promise<void> {
    await this.tokenRepository.deleteOne({
      user: user.id,
      type: TokenTypes.REFRESH,
    });
  }

  private async userExistance(email: string): Promise<void> {
    const user = await this.userRepository.findOne({
      email,
    });

    if (user) {
      throw new HttpException(MessagesMapping['#1'], HttpStatus.BAD_REQUEST);
    }
  }

  private generateToken(
    user: IUserDocument,
    expires: moment.Moment,
    type: TokenTypes,
    secret: string,
  ): string {
    const userData = JSON.parse(JSON.stringify(user));
    const payload = {
      sub: {
        ...userData,
        password: undefined,
      },
      iat: moment().unix(),
      exp: expires.unix(),
      type,
    };

    return jwt.sign(payload, secret);
  }

  private async saveToken(
    token: string,
    userId: Types.ObjectId,
    expires: moment.Moment,
    type: TokenTypes,
  ): Promise<ITokenDocument> {
    const tokenDoc = await this.tokenRepository.create({
      token,
      user: userId,
      expires: expires.toDate(),
      type,
    });

    return tokenDoc;
  }

  private async generateAuthTokens(user: IUserDocument) {
    const accessTokenExpires = moment().add(
      this.configService.get('auth.jwt.accessToken.expirationTime'),
      'minute',
    );
    const accessTokenSecret = this.configService.get<string>(
      'auth.jwt.accessToken.secretKey',
    );

    const accessToken = this.generateToken(
      user,
      accessTokenExpires,
      TokenTypes.ACCESS,
      accessTokenSecret,
    );

    const refreshTokenExpires = moment().add(
      this.configService.get('auth.jwt.refreshToken.expirationTime'),
      'days',
    );
    const refreshTokenSecret = this.configService.get<string>(
      'auth.jwt.refreshToken.secretKey',
    );

    const refreshToken = this.generateToken(
      user,
      refreshTokenExpires,
      TokenTypes.REFRESH,
      refreshTokenSecret,
    );

    await this.saveToken(
      refreshToken,
      user.id,
      refreshTokenExpires,
      TokenTypes.REFRESH,
    );

    return {
      access: {
        token: accessToken,
        expires: accessTokenExpires,
      },
      refresh: {
        token: refreshToken,
        expires: refreshTokenExpires,
      },
    };
  }

  private async verifyToken(token: string, type: string) {
    const refreshTokenSecret = this.configService.get<string>(
      'auth.jwt.refreshToken.secretKey',
    );
    const accessTokenSecret = this.configService.get<string>(
      'auth.jwt.accessToken.secretKey',
    );

    const verifyEmailTokenSecret = this.configService.get<string>(
      'auth.jwt.verifyEmailToken.secretKey',
    );

    const verifyResetPasswordTokenSecret = this.configService.get<string>(
      'auth.jwt.resetPasswordToken.secretKey',
    );
    let payload;

    if (type === TokenTypes.REFRESH) {
      payload = jwt.verify(token, refreshTokenSecret);
    } else if (type === TokenTypes.VERIFY_EMAIL) {
      payload = jwt.verify(token, verifyEmailTokenSecret);
    } else if (type === TokenTypes.ACCESS) {
      payload = jwt.verify(token, accessTokenSecret);
    } else if (type === TokenTypes.RESET_PASSWORD) {
      payload = jwt.verify(token, verifyResetPasswordTokenSecret);
    }
    const tokenDoc = await this.tokenRepository.findOne({
      token,
      type,
      user: payload.sub._id,
    });
    console.log('token doc ::', tokenDoc);

    if (!tokenDoc) {
      throw new HttpException(MessagesMapping['#2'], HttpStatus.NOT_FOUND);
    }
    return tokenDoc;
  }

  private async generateResetPasswordToken(email: string): Promise<string> {
    const user = await this.userRepository.findOne({ email });

    if (!user) {
      throw new HttpException(MessagesMapping['#1'], HttpStatus.BAD_REQUEST);
    }

    const expires = moment().add(
      this.configService.get('auth.jwt.forgotPasswordToken.expirationTime'),
      'hours',
    );
    const secret = this.configService.get<string>(
      'auth.jwt.forgotPasswordToken.secretKey',
    );

    const resetPasswordToken = this.generateToken(
      user,
      expires,
      TokenTypes.RESET_PASSWORD,
      secret,
    );

    await this.saveToken(
      resetPasswordToken,
      user.id,
      expires,
      TokenTypes.RESET_PASSWORD,
    );

    return resetPasswordToken;
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<void> {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );

    if (!isPasswordMatching) {
      throw new HttpException(MessagesMapping['#3'], HttpStatus.UNAUTHORIZED);
    }
  }

  private async getAuthenticatedUser(
    email: string,
    plainTextPassword: string,
  ): Promise<IUserDocument> {
    const user = await this.userRepository.findOne({
      email,
      isDeleted: false,
    });

    if (!user) {
      throw new HttpException(MessagesMapping['#9'], HttpStatus.NOT_FOUND);
    }

    await this.verifyPassword(plainTextPassword, user.password);

    user.password = undefined;

    return user;
  }

  private async generateVerifyEmailToken(user: IUserDocument): Promise<string> {
    const expires = moment().add(
      this.configService.get('auth.jwt.verifyEmailToken.expirationTime'),
      'hours',
    );
    const secret = this.configService.get<string>(
      'auth.jwt.verifyEmailToken.secretKey',
    );

    const verifyEmailToken = this.generateToken(
      user,
      expires,
      TokenTypes.VERIFY_EMAIL,
      secret,
    );

    await this.saveToken(
      verifyEmailToken,
      user.id,
      expires,
      TokenTypes.VERIFY_EMAIL,
    );

    return verifyEmailToken;
  }

  public async sendVerificationEmail(payload: JwtPayload) {
    try {
      const user = await this.userRepository.findById(payload.sub);

      if (user.isEmailVerified) {
        throw new HttpException(MessagesMapping['#4'], HttpStatus.BAD_REQUEST);
      }

      const verifyEmailToken = await this.generateVerifyEmailToken(user);

      await this.mailService.sendVerifyEmail(user.email, verifyEmailToken);

      return {
        token: verifyEmailToken,
        message: MessagesMapping['#5'],
      };
    } catch (error) {
      throw new HttpException(
        MessagesMapping['#27'],
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async verifyEmail(token: string) {
    try {
      const tokenDoc = await this.verifyToken(token, TokenTypes.VERIFY_EMAIL);
      const user = await this.userRepository.findById(tokenDoc.user._id);
      user.isEmailVerified = true;

      await user.save();

      await tokenDoc.deleteOne();
      return {
        message: MessagesMapping['#6'],
      };
    } catch (error) {
      throw new HttpException(
        MessagesMapping['#29'],
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async resetPassword(
    resetPasswordDto: ResetPasswordDto,
    token: string,
  ) {
    const { password, passwordConfirmation } = resetPasswordDto;

    if (password !== passwordConfirmation) {
      throw new HttpException(MessagesMapping['#7'], HttpStatus.UNAUTHORIZED);
    }

    const tokenDoc = await this.verifyToken(token, TokenTypes.RESET_PASSWORD);
    const user = await this.userRepository.findById(tokenDoc.user._id);

    user.password = password;

    await user.save();

    await this.mailService.sendAfterResetPasswordEmail(user.email);

    await this.tokenRepository.deleteOne({
      token,
      type: TokenTypes.RESET_PASSWORD,
    });

    return {
      message: MessagesMapping['#8'],
    };
  }

  public async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<any> {
    const user = await this.userRepository.findOne({
      email: forgotPasswordDto.email,
    });

    if (!user) {
      throw new HttpException(MessagesMapping['#9'], HttpStatus.NOT_FOUND);
    }

    const resetPasswordToken = await this.generateResetPasswordToken(
      forgotPasswordDto.email,
    );

    await this.mailService.sendResetPasswordEmail(
      user.email,
      resetPasswordToken,
    );

    return {
      token: resetPasswordToken,
    };
  }

  // public async login(loginDto: LoginDto) {
  //   const user = await this.getAuthenticatedUser(
  //     loginDto.email,
  //     loginDto.password,
  //   );

  //   await this.refreshTokenExistance(user);

  //   const tokens = await this.generateAuthTokens(user);

  //   return {
  //     type: 'success',
  //     statusCode: 200,
  //     message: MessagesMapping['#10'],
  //     user,
  //     tokens,
  //   };
  // }

  // public async generateTokens(tokenDto: TokenDto) {
  //   const token = await this.verifyToken(
  //     tokenDto.refreshToken,
  //     TokenTypes.REFRESH,
  //   );

  //   const user = await this.userRepository.findById(token.user._id);

  //   if (!user) {
  //     throw new HttpException(MessagesMapping['#9'], HttpStatus.NOT_FOUND);
  //   }

  //   await this.refreshTokenExistance(user);

  //   const tokens = await this.generateAuthTokens(user);

  //   return tokens;
  // }
  public async generateTokens(req: Request, res: Response) {
    console.log('req :: ', req);
    const refreshToken = req.cookies['refresh_token'];

    console.log('refreshToken :: ', refreshToken);
    const token = await this.verifyToken(refreshToken, TokenTypes.REFRESH);

    const user = await this.userRepository.findById(token.user._id);

    if (!user) {
      throw new HttpException(MessagesMapping['#9'], HttpStatus.NOT_FOUND);
    }

    await this.refreshTokenExistance(user);

    const tokens = await this.generateAuthTokens(user);

    res.cookie('access_token', tokens.access.token, { httpOnly: true });
    res.cookie('refresh_token', tokens.refresh.token, { httpOnly: true });

    return res.send(tokens);
  }

  // public async logout(logoutDto: LogoutDto) {
  //   const refreshToken = await this.tokenRepository.findOne({
  //     token: logoutDto.refreshToken,
  //     type: TokenTypes.REFRESH,
  //   });

  //   if (!refreshToken) {
  //     throw new HttpException(MessagesMapping['#11'], HttpStatus.NOT_FOUND);
  //   }

  //   await this.tokenRepository.deleteOne({
  //     token: logoutDto.refreshToken,
  //     type: TokenTypes.REFRESH,
  //   });
  //   return {
  //     type: 'Success',
  //     statusCode: 200,
  //     message: MessagesMapping['#12'],
  //   };
  // }

  public async login(res: Response, loginDto: LoginDto) {
    const user = await this.getAuthenticatedUser(
      loginDto.email,
      loginDto.password,
    );
    if (user.isEmailVerified) {
      await this.refreshTokenExistance(user);

      const tokens = await this.generateAuthTokens(user);

      // Set the access token as a HttpOnly cookie on the response
      res.cookie('access_token', tokens.access.token, {
        httpOnly: true,
        // secure: true,

        // Add additional cookie options here as needed, such as 'secure' and 'sameSite'
      });

      res.cookie('refresh_token', tokens.refresh.token, {
        httpOnly: true,
        // secure: true,
        // Add additional cookie options here as needed, such as 'secure' and 'sameSite'
      });

      return res.send({
        type: 'success',
        statusCode: 200,

        message: MessagesMapping['#10'],
        user,
        tokens,
      });
    } else {
      throw new HttpException(MessagesMapping['#28'], HttpStatus.UNAUTHORIZED);
    }
  }

  public async userRole(req: Request, res: Response) {
    const refreshToken = req.cookies['refresh_token'];
    const accessToken =
      req.headers.authorization || req.cookies['access_token'];
    // const token = await this.verifyToken(accessToken, TokenTypes.ACCESS);
    const user = req['user'] as RequestWithUser;
    const role = user.sub.role;
    if (!user) {
      throw new HttpException(MessagesMapping['#9'], HttpStatus.NOT_FOUND);
    }
    // Set the access token as a HttpOnly cookie on the response
    res.cookie('access_token', accessToken, {
      httpOnly: true,

      // Add additional cookie options here as needed, such as 'secure' and 'sameSite'
    });

    return res.send({
      type: 'success',
      statusCode: 200,
      message: MessagesMapping['#10'],
      role,
    });
  }
  public async profile(req: Request, res: Response) {
    const refreshToken = req.cookies['refresh_token'];
    const accessToken =
      req.headers.authorization || req.cookies['access_token'];
    // const token = await this.verifyToken(accessToken, TokenTypes.ACCESS);
    const user = req['userProfile'] as UserPayload;

    if (!user) {
      throw new HttpException(MessagesMapping['#9'], HttpStatus.NOT_FOUND);
    }
    // Set the access token as a HttpOnly cookie on the response
    res.cookie('access_token', accessToken, {
      httpOnly: true,

      // Add additional cookie options here as needed, such as 'secure' and 'sameSite'
    });

    return res.send({
      type: 'success',
      statusCode: 200,
      message: MessagesMapping['#10'],
      user,
    });
  }

  public async logout(req: Request, res: Response) {
    const refToken = req.cookies['refresh_token'];
    const refreshToken = await this.tokenRepository.findOne({
      token: refToken,
      type: TokenTypes.REFRESH,
    });

    if (!refreshToken) {
      throw new HttpException(MessagesMapping['#11'], HttpStatus.NOT_FOUND);
    }

    await this.tokenRepository.deleteOne({
      token: refToken,
      type: TokenTypes.REFRESH,
    });

    // Clear the cookies
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');

    return res.send({
      type: 'Success',
      statusCode: 200,
      message: MessagesMapping['#12'],
    });
  }

  public async register(registrationData: RegisterDto) {
    await this.userExistance(registrationData.email);

    const createdUser = await this.userRepository.create({
      ...registrationData,
    });

    createdUser.password = undefined;

    const payload = {
      sub: createdUser,
    };
    const data = await this.sendVerificationEmail(payload);
    return {
      type: 'success',
      statusCode: 200,
      message: MessagesMapping['#13'],
      emailVerificationToken: data.token,
    };
  }
}
