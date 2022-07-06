import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { JwtStrategy } from './Strategy/jwt.strategy';
import { AuthController } from './auth.controller';

@Module({
  providers: [AuthService, JwtStrategy],
  imports: [
    JwtModule.register({
      secret: 'mySecureKey',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  exports: [JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
