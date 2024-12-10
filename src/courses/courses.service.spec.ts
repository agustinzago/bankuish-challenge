import { Test, TestingModule } from '@nestjs/testing';
import { CoursesService } from './courses.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

const mockConfigService = {
  get: jest.fn().mockReturnValue('mock-value'),
};

const mockPrismaService = {
  course: {
    create: jest.fn(),
    findUnique: jest.fn(),
  },
  prerequisite: {
    create: jest.fn(),
  },
};

describe('CoursesService', () => {
  let service: CoursesService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoursesService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<CoursesService>(CoursesService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('createCourse', () => {
    it('should create a course', async () => {
      const courseData = {
        title: 'Finance',
        description: 'Fundamentals of finance',
      };

      jest.spyOn(prismaService.course, 'create').mockResolvedValue({
        ...courseData,
        id: 'some-id',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.createCourse(courseData);
      expect(result.title).toBe(courseData.title);
      expect(result.description).toBe(courseData.description);
    });
  });

  describe('sortCourses', () => {
    it('should return courses sorted by prerequisites', async () => {
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

      const result = await service.sortCourses({ userId: 'some-id', courses });
      expect(result.sortedCourses).toEqual(sortedCourses);
    });
  });
});
