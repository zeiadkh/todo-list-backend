import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Task } from './task.entity'

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async findAll(): Promise<Task[]> {
    return this.taskRepository.find()
  }

  async create(task: Task): Promise<Task> {
    return this.taskRepository.save(task)
  }

  async update(id: any, task: Task): Promise<Task> {
    await this.taskRepository.update(id, task)
    return this.taskRepository.findOneBy({ id: id })
  }

  async delete(id: number): Promise<any> {
    return await this.taskRepository
      .delete(id)
      .then((res) => res.affected)
      .catch((err) => err)
  }
}
