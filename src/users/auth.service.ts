import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { promisify } from 'util';
import { scrypt as _scrypt, randomBytes } from 'crypto';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    // See if email is in use
    const users = await this.usersService.find(email);
    if (users.length) throw new BadRequestException('email already in use');

    // Hash the users password
    // - generate a salt
    const salt = randomBytes(8).toString('hex');

    // - hash the salt and the password together
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    // - join the hashed result and the salt together
    const resultedPassword = salt + '.' + hash.toString('hex');

    // Create new user and save it
    const user = await this.usersService.create(email, resultedPassword);

    // Return the user
    return user;
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email);
    if (!user) throw new NotFoundException('user not found!');
    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    if (hash.toString('hex') !== storedHash) {
      throw new BadRequestException('Wrong Credentials');
    }
    return user;
  }
}
