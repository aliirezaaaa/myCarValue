import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeAuthService: Partial<AuthService>;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    fakeAuthService = {
      // signup: () => {},
      signin: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password } as User);
      },
    };

    fakeUsersService = {
      findOne: (id: number) => {
        return Promise.resolve({
          id,
          email: 'test@test.com',
          password: 'test',
        } as User);
      },
      find: (email: string) => {
        return Promise.resolve([{ id: 1, email, password: 'test' } as User]);
      },
      // remove: () => {},
      // update: () => {},
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: AuthService, useValue: fakeAuthService },
        { provide: UsersService, useValue: fakeUsersService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers should return a list users with the given email', async () => {
    const users = await controller.findAllUsers('test@test.com');

    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('test@test.com');
  });

  it('findUser should return a user with the given id', async () => {
    const user = await controller.findUser('1');

    expect(user).toBeDefined();
    expect(user.id).toEqual(1);
  });

  it('throws an error if user with given id is not found', async () => {
    fakeUsersService.findOne = async (id: number) => null;

    await expect(controller.findUser('2')).rejects.toThrow('User not found!');
  });

  it('signin should update session object and returns user', async () => {
    // assign -10 to check if it updates to 1 or not
    const session = { userId: -10 };
    const user = await controller.signin(
      { email: 'test@test.com', password: 'test' },
      session,
    );

    expect(session.userId).toEqual(1);
    expect(user.id).toEqual(1);
  });
});
