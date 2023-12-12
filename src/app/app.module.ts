import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import winston from 'winston';

import { AuthModule } from '@modules/auth/auth.module';
import { CategoryModule } from '@modules/category/category.module';
import { FavoriteModule } from '@modules/favorite/favorite.module';
import { ImageModule } from '@modules/image/image.module';
import { TagModule } from '@modules/tag/tag.module';
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
import { AudioModule } from '@modules/audio/audio.module';
import { HostModule } from '@modules/host/host.module';
import { EpisodeModule } from '@modules/episode/episode.module';
import { ListeningSessionModule } from '@modules/listeningSession/listeningSession.module';
import { GoalModule } from '@modules/goal/goal.module';

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
          useNewUrlParser: true,
          useUnifiedTopology: true,
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
    CategoryModule,
    AudioModule,
    HostModule,
    EpisodeModule,
    TagModule,
    FavoriteModule,
    ListeningSessionModule,
    GoalModule,
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
