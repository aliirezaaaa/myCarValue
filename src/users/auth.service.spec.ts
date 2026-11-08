import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    // Create a fake copy of the users service
    // We use Partial<UsersService> to ensure that the methods have correct type signiture
    // We just define userService methods that used in authService, not all userService methods
    const users: User[] = [];
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 9999),
          email,
          password,
        } as User;
        users.push(user);
        console.log(user);

        return Promise.resolve(user);
      },
    };

    // Create new DI container for testing
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: fakeUsersService },
      ],
    }).compile();

    // Reach into the DI container and get a copy of authservice
    // It cause DI container to create a new instance of
    // authservice with all of its dependencies already initialized
    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.signup('test@test.com', 'test');

    expect(user.password).not.toEqual('test');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is already in use', async () => {
    await service.signup('test@test.com', 'test');
    await expect(service.signup('test@test.com', 'test')).rejects.toThrow(
      'email already in use',
    );
  });

  it('throws an error if signin is called wiht an unused email', async () => {
    await expect(service.signin('test@test.com', 'test')).rejects.toThrow(
      'user not found!',
    );
  });

  it('throws an error if an invalid password is provided', async () => {
    await service.signup('test@test.com', 'password1');

    await expect(service.signin('test@test.com', 'password')).rejects.toThrow(
      'Wrong Credentials',
    );
  });

  it('returns a user if password is correct', async () => {
    await service.signup('test@test.com', 'mypassword');

    const user = await service.signin('test@test.com', 'mypassword');

    expect(user).toBeDefined();
  });
});
