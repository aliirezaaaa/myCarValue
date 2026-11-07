import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';

it('can create an instance of auth service', async () => {
  // Create a fake copy of the users service
  // We use Partial<UsersService> to ensure that the methods have correct type signiture
  // We just define userService methods that used in authService, not all userService methods
  const fakeUsersService: Partial<UsersService> = {
    find: () => Promise.resolve([]),
    create: (email: string, password: string) =>
      Promise.resolve({ id: 1, email, password } as User),
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
  const service = module.get(AuthService);

  expect(service).toBeDefined();
});
