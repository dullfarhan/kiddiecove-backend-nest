import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { PermissionService } from 'src/permission/permission.service';

@Module({
  imports: [PermissionService],
  controllers: [RolesController],
  providers: [RolesService],
})
export class RolesModule {}
