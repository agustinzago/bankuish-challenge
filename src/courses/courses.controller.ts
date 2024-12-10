import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { SortCoursesDto } from './dto/sort-courses.dto';
import { UserGuard } from '../user/user.guard';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @UseGuards(UserGuard)
  async createCourse(@Body() dto: CreateCourseDto) {
    return this.coursesService.createCourse(dto);
  }

  @Get('/sort')
  @UseGuards(UserGuard)
  async sortCourses(@Body() dto: SortCoursesDto) {
    return this.coursesService.sortCourses(dto);
  }
}
