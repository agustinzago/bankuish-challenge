import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { SortCoursesDto } from './dto/sort-courses.dto';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async createCourse(dto: CreateCourseDto) {
    const { title, description, prerequisites } = dto;

    const course = await this.prisma.course.create({
      data: {
        title,
        description,
      },
    });

    if (prerequisites?.length) {
      await Promise.all(
        prerequisites.map((prerequisiteId) =>
          this.prisma.prerequisite.create({
            data: {
              courseId: course.id,
              prerequisiteId,
            },
          }),
        ),
      );
    }

    return course;
  }

  async sortCourses(dto: SortCoursesDto) {
    const { courses } = dto;

    const graph: Record<string, string[]> = {};
    const inDegree: Record<string, number> = {};
    const courseTitles = new Set<string>();

    courses.forEach(({ desiredCourse, requiredCourse }) => {
      if (!graph[requiredCourse]) graph[requiredCourse] = [];
      graph[requiredCourse].push(desiredCourse);

      if (!inDegree[desiredCourse]) inDegree[desiredCourse] = 0;
      if (!inDegree[requiredCourse]) inDegree[requiredCourse] = 0;

      inDegree[desiredCourse] += 1;

      courseTitles.add(desiredCourse);
      courseTitles.add(requiredCourse);
    });

    const queue = Array.from(courseTitles).filter(
      (course) => inDegree[course] === 0,
    );
    const sortedCourses: string[] = [];

    while (queue.length > 0) {
      const course = queue.shift();
      sortedCourses.push(course);

      (graph[course] || []).forEach((nextCourse) => {
        inDegree[nextCourse] -= 1;
        if (inDegree[nextCourse] === 0) {
          queue.push(nextCourse);
        }
      });
    }

    if (sortedCourses.length !== courseTitles.size) {
      throw new BadRequestException('Cyclic dependency detected');
    }

    const orderedCourses = sortedCourses.map((course, index) => ({
      course,
      order: index,
    }));

    return { sortedCourses: orderedCourses };
  }
}
