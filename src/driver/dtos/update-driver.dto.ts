import { PartialType } from '@nestjs/swagger';
import { CreateDriverDto } from './create-driver.dto';

export class UpdateTeacherDto extends PartialType(CreateDriverDto) {}
