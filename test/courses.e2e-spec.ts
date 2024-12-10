import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

const VALID_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkVTNmTkFPRDdTWHNnTGJGeDFWUVZ1ZlEwZXExIiwiZW1haWwiOiJhZG1pbjIzMzIzQHRlc3QuY29tIiwiaWF0IjoxNzMzODU0MDYxLCJleHAiOjE3MzM5NDA0NjF9.5TFO6mxBdSQm-mLrhrC9hVM3EN8ZJcZbmGHzN1Em9xQ';

describe('CoursesController (e2e)', () => {
  let app;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('/GET courses/sort', () => {
    it('should return sorted courses based on prerequisites', async () => {
      const response = await request(app.getHttpServer())
        .get('/courses/sort')
        .set('Authorization', `Bearer ${VALID_TOKEN}`)
        .send({
          userId: 'vK1CdJZx5AX4pd86TjdVmJ3uoBH3',
          courses: [
            {
              desiredCourse: 'PortfolioConstruction',
              requiredCourse: 'PortfolioTheories',
            },
            {
              desiredCourse: 'InvestmentManagement',
              requiredCourse: 'Investment',
            },
            { desiredCourse: 'Investment', requiredCourse: 'Finance' },
            {
              desiredCourse: 'PortfolioTheories',
              requiredCourse: 'Investment',
            },
            {
              desiredCourse: 'InvestmentStyle',
              requiredCourse: 'InvestmentManagement',
            },
          ],
        })
        .expect(200);

      expect(response.body.sortedCourses).toEqual([
        { course: 'Finance', order: 0 },
        { course: 'Investment', order: 1 },
        { course: 'InvestmentManagement', order: 2 },
        { course: 'PortfolioTheories', order: 3 },
        { course: 'InvestmentStyle', order: 4 },
        { course: 'PortfolioConstruction', order: 5 },
      ]);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
