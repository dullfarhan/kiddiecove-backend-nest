import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { EndpointService } from 'src/endpoint/endpoint.service';
import { PermissionSchema, Permissions } from 'src/Schemas';
import { MongooseModule } from '@nestjs/mongoose';
import { EndpointModule } from 'src/endpoint/endpoint.module';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Permissions.name, schema: PermissionSchema },
    ]),
    EndpointModule,
  ],
  controllers: [PermissionController],
  providers: [PermissionService],
  exports: [PermissionService],
})
export class PermissionModule {}
