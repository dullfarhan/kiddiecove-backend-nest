import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { PermissionModule } from 'src/permission/permission.module';
import { EndpointModule } from 'src/endpoint/endpoint.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from 'src/Schemas';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
    PermissionModule,
    EndpointModule,
  ],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}
