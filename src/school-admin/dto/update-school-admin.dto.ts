import { PartialType } from '@nestjs/swagger';
import { CreateSchoolAdminDto } from './create-school-admin.dto';

export class UpdateSchoolAdminDto extends PartialType(CreateSchoolAdminDto) {}
