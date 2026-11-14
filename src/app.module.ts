import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { User } from './users/user.entity';
import { Report } from './reports/report.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
const cookieSession = require('cookie-session');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'better-sqlite3',
          database: config.get<string>('DB_NAME'),
          entities: [User, Report],
          synchronize: true,
        };
      },
    }),
    // TypeOrmModule.forRoot({
    //   type: 'better-sqlite3',
    //   database: 'db.sqlite',
    //   entities: [User, Report],
    //   synchronize: true,
    // }),
    UsersModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // This is how we setup a Global Pipe from inside AppModule
    // every single requests that comes into this application, will run through this class
    { provide: APP_PIPE, useValue: new ValidationPipe({ whitelist: true }) },
  ],
})
export class AppModule {
  // This configure function is going to be called automatically whenever our application
  // starts lisetening for incomming trafic.
  // So inside of it we can setup some middleware that will run on every single incomming requests.
  configure(consumer: MiddlewareConsumer) {
    // Global middleware
    consumer
      .apply(
        cookieSession({
          keys: ['abcddcba'], //use for encrypting cookie data
        }),
      )
      // '*' means use this middleware on every single incomming request that flows into entire application
      // that means it's essentially a global middleware
      .forRoutes('*');
  }
}
