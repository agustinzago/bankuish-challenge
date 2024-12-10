import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

const VALID_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkVTNmTkFPRDdTWHNnTGJGeDFWUVZ1ZlEwZXExIiwiZW1haWwiOiJhZG1pbjIzMzIzQHRlc3QuY29tIiwiaWF0IjoxNzMzODU0MDYxLCJleHAiOjE3MzM5NDA0NjF9.5TFO6mxBdSQm-mLrhrC9hVM3EN8ZJcZbmGHzN1Em9xQ';

describe('UserController (e2e)', () => {
  let app;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('/POST user/signup', () => {
    it('should create a user', async () => {
      const createUserDto = {
        email: 'emailtest123@test.com',
        password: 'P@ssword1!',
        firstName: 'Agustin',
        lastName: 'Zago',
      };

      const response = await request(app.getHttpServer())
        .post('/user/signup')
        .send(createUserDto)
        .expect(201);

      console.log(response.body);

      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.email).toBe(createUserDto.email);
      expect(response.body.user.firstName).toBe(createUserDto.firstName);
      expect(response.body.user.lastName).toBe(createUserDto.lastName);
      expect(response.body.token).toBeDefined();
    });
  });

  describe('/POST user/login', () => {
    it('should login the user', async () => {
      const loginUserDto = {
        email: 'emailtest123@test.com',
        password: 'P@ssword1!',
      };

      const response = await request(app.getHttpServer())
        .post('/user/login')
        .set('Authorization', `Bearer ${VALID_TOKEN}`)
        .send(loginUserDto)
        .expect(200);

      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.email).toBe(loginUserDto.email);
      expect(response.body.token).toBeDefined();
    });

    it('should throw an error if credentials are incorrect', async () => {
      const loginUserDto = {
        email: 'wrong@example.com',
        password: 'wrongpassword',
      };

      const response = await request(app.getHttpServer())
        .post('/user/login')
        .send(loginUserDto)
        .expect(400);

      expect(response.body.message).toBe('Incorrect credentials');
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
