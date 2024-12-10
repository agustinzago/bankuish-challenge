import { IsArray, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class CourseDependency {
  @IsString()
  desiredCourse: string;

  @IsString()
  requiredCourse: string;
}

export class SortCoursesDto {
  @IsString()
  userId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CourseDependency)
  courses: CourseDependency[];
}
