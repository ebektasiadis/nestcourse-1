import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scryptSync } from 'crypto';

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async signup(email: string, password: string) {
    const users = await this.userService.find(email);

    if (users.length) {
      throw new BadRequestException('email already in use');
    }

    const salt = randomBytes(8).toString('hex');
    const hash = scryptSync(password, salt, 32).toString('hex');

    const result = `${salt}.${hash}`;

    return this.userService.create(email, result);
  }

  async signin(email: string, password: string) {
    const [user] = await this.userService.find(email);
    if (!user) {
      throw new NotFoundException('user not found');
    }

    const [storedSalt, _] = user.password.split('.');
    const hash = scryptSync(password, storedSalt, 32).toString('hex');

    const isPasswordCorrect = `${storedSalt}.${hash}` === user.password;
    if (!isPasswordCorrect) {
      throw new BadRequestException('bad password');
    }

    return user;
  }
}
