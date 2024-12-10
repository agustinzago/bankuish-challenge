import { Test, TestingModule } from '@nestjs/testing';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { PrismaService } from '../prisma/prisma.service';
import { UserGuard } from '../user/user.guard';
import { ConfigService } from '@nestjs/config';

const mockUserGuard = {
  canActivate: jest.fn().mockReturnValue(true),
};

describe('CoursesController', () => {
  let controller: CoursesController;
  let service: CoursesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoursesController],
      providers: [CoursesService, PrismaService, ConfigService],
    })
      .overrideGuard(UserGuard)
      .useValue(mockUserGuard)
      .compile();

    controller = module.get<CoursesController>(CoursesController);
    service = module.get<CoursesService>(CoursesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createCourse', () => {
    it('should create a course', async () => {
      const courseData = { title: 'Finance', description: 'Finance basics' };

      jest.spyOn(service, 'createCourse').mockResolvedValue({
        ...courseData,
        id: 'some-id',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await controller.createCourse(courseData);
      expect(result.title).toBe(courseData.title);
      expect(result.description).toBe(courseData.description);
    });
  });

  describe('sortCourses', () => {
    it('should return sorted courses', async () => {
      const courses = [
        {
          desiredCourse: 'PortfolioConstruction',
          requiredCourse: 'PortfolioTheories',
        },
        { desiredCourse: 'InvestmentManagement', requiredCourse: 'Investment' },
        { desiredCourse: 'Investment', requiredCourse: 'Finance' },
        { desiredCourse: 'PortfolioTheories', requiredCourse: 'Investment' },
        {
          desiredCourse: 'InvestmentStyle',
          requiredCourse: 'InvestmentManagement',
        },
      ];

      const sortedCourses = [
        { course: 'Finance', order: 0 },
        { course: 'Investment', order: 1 },
        { course: 'InvestmentManagement', order: 2 },
        { course: 'PortfolioTheories', order: 3 },
        { course: 'InvestmentStyle', order: 4 },
        { course: 'PortfolioConstruction', order: 5 },
      ];

      const result = await controller.sortCourses({
        userId: 'some-id',
        courses,
      });
      expect(result.sortedCourses).toEqual(sortedCourses);
    });
  });
});
