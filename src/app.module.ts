import { Module } from '@nestjs/common';
import { AuthPatientsModule } from './modules/auth/auth-patients/auth.module';
import { PatientsModule } from './modules/patients/patients.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configuration } from './config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';
import {
  CookieResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import { join } from 'path';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { DentistsModule } from './modules/dentists/dentists.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { ClinicsModule } from './modules/clinics/clinics.module';
import { StaffModule } from './modules/staff/staff.module';
import { AuthStaffModule } from './modules/auth/auth-staff/auth-staff.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          port: configService.get('DB_PORT'),
          host: configService.get('DB_HOST'),
          database: configService.get('DB_NAME'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          synchronize: true,
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          autoLoadEntities: true,
        };
      },
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      global: true,
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get<string>('JWT_KEY'),
        };
      },
      inject: [ConfigService],
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get('SMTP_HOST'),
          auth: {
            user: configService.get('SMTP_USER'),
            pass: configService.get('SMTP_PASSWORD'),
          },
        },
      }),
      inject: [ConfigService],
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'uz',
      loaderOptions: {
        path: join(process.cwd(), 'src', '/i18n/'),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang', 'l'] },
        new HeaderResolver(['x-custom-lang']),
        new CookieResolver(['lang']),
      ],
    }),
    AuthPatientsModule,
    PatientsModule,
    DentistsModule,
    AppointmentsModule,
    ClinicsModule,
    StaffModule,
    AuthStaffModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {}
