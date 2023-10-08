import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let usersController: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: number) =>
        Promise.resolve({
          id,
          email: 'test@jest.com',
          password: 'test',
        } as User),
      find: (email) =>
        Promise.resolve([{ id: 1, email, password: 'test' } as User]),
    };
    fakeAuthService = {
      // signup: () => {},
      signin: (email) =>
        Promise.resolve({ id: 1, email, password: 'test' } as User),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  it('findAllUsers returns a list of users with given email', async () => {
    const users = await usersController.findAllUsers('test@jest.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('test@jest.com');
  });

  it('findUser returns a single user with the given id', async () => {
    const user = await usersController.findUser('1');
    expect(user).toBeDefined();
  });

  it('findUser throws an error if user with given id does not exist', async () => {
    fakeUsersService.findOne = () => null;
    const findUserPromise = usersController.findUser('1');

    expect(findUserPromise).rejects.toThrow(NotFoundException);
  });

  it('stores the users id to the session when signin', async () => {
    const session = {};
    await usersController.signin(
      {
        email: 'test@jest.com',
        password: 'test1',
      },
      session,
    );

    expect(session).toHaveProperty('userId');
  });
});
