import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import winston from 'winston';

import { AuthModule } from '@modules/auth/auth.module';
import { ImageModule } from '@modules/image/image.module';
import { UserModule } from '@modules/user/user.module';
import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import Configs from '@shared/config';
import { DebuggerModule } from '@shared/debugger/debugger.module';
import { HttpExceptionFilter } from '@shared/filters/http-exception.filter';
import { MongoDriverErrorFilter } from '@shared/filters/mongo-driver-error.filter';
import { MongooseErrorFilter } from '@shared/filters/mongoose-error.filter';
import { JwtAuthGuard } from '@shared/guards/auth.guard';
import { RolesGuard } from '@shared/guards/roles.guard';
import { LoggerModule } from '@shared/logger/logger.module';
import { LoggerMiddleware } from '@shared/middlewares/http-logger.middleware';
import { TokenModule } from '@modules/token/token.module';
import { CardModule } from '@modules/card/card.module';
import { DeckModule } from '@modules/deck/deck.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: Configs,
      ignoreEnvFile: false,
      isGlobal: true,
      cache: true,
      envFilePath: ['.env'],
      expandVariables: true,
    }),
    WinstonModule.forRootAsync({
      imports: [DebuggerModule],
      useFactory: (logger: winston.LoggerOptions) => {
        return {
          transports: [
            new winston.transports.Console({
              level: logger.level,
              format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.prettyPrint(),
                nestWinstonModuleUtilities.format.nestLike(),
              ),
            }),
          ],
        };
      },
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          uri: config.get<string>('DATABASE_URL'),
          connectionFactory: (connection) => {
            connection.plugin(require('mongoose-paginate-v2'));
            connection.plugin(require('mongoose-autopopulate'));
            Logger.debug(
              `App connected to mongodb on ${config.get<string>(
                'DATABASE_URL',
              )}`,
              'MONGODB',
            );
            return connection;
          },
        };
      },
    }),

    AuthModule,
    UserModule,
    ImageModule,
    LoggerModule,
    TokenModule,
    CardModule,
    DeckModule,
  ],
  providers: [
    ConfigService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: MongoDriverErrorFilter,
    },
    {
      provide: APP_FILTER,
      useClass: MongooseErrorFilter,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
