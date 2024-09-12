import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByUsername(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { username }});
  }
  async findUserName(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { username }, select: ['username']});
  }

  async createUser(user: User): Promise<User> {
    return this.userRepository.save(user);
  }
}
