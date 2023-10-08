import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];
    fakeUsersService = {
      find: (email) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email, password) => {
        const user = {
          id: Math.floor(Math.random() * 99999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('exists', () => {
    expect(authService).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const user = await authService.signup('test@jest.com', 'jest');
    expect(user.password).not.toEqual('jest');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    await authService.signup('test@jest.com', 'jest');

    const signUpPromise = authService.signup('test@jest.com', 'jest');

    await expect(signUpPromise).rejects.toThrow(BadRequestException);
  });

  it('throws if signin is called with an unused email', async () => {
    const signInPromise = authService.signin('test@jest.com', 'jest');

    await expect(signInPromise).rejects.toThrow(NotFoundException);
  });

  it('throws if an invalid password is provided', async () => {
    await authService.signup('test@jest.com', 'jest');

    const signInPromise = authService.signin('test@jest.com', 'test');
    expect(signInPromise).rejects.toThrow(BadRequestException);
  });

  it('returns a user if correct password is provided', async () => {
    await authService.signup('test@jest.com', 'jest');

    const user = await authService.signin('test@jest.com', 'jest');
    expect(user).toBeDefined();
  });
});
