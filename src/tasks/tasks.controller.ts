import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  BadRequestException,
  Request,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { TasksService } from './tasks.service'
import { Task } from './task.entity'
import { AuthGuard } from '@nestjs/passport'
import { FastifyRequest } from 'fastify'

export type UserRequest = FastifyRequest & {
  user: any
}

@UseGuards(AuthGuard('jwt'))
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  async findAll(@Request() req: UserRequest): Promise<Task[]> {
    return this.tasksService.findAll({ where: {userId: req.user.userId} })
  }

  @Post()
  async create(@Body() task: Task, @Request() req:UserRequest): Promise<Task> {
    if (!task.title || !task.category || !task.description || !task.dueDate)
      throw new BadRequestException('You must provide the task data')
    task = { ...task, userId: req.user.userId }
    return this.tasksService.create(task)
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() task: Task, @Request() req: UserRequest): Promise<Task> {
    const taskWithId: Promise<Task> = this.tasksService.find({id})
    if(! await taskWithId) throw new HttpException("Task Not found", HttpStatus.NOT_FOUND)
    
    if ((await taskWithId).userId !== req.user.userId)
      throw new HttpException('Forbidden Task', HttpStatus.FORBIDDEN)
    if (
      !task.title &&
      !task.category &&
      !task.description &&
      !task.dueDate &&
      task.completed !== true &&
      task.completed !== false
    )
      throw new BadRequestException('No thing to Update!')

    return this.tasksService.update(id, task)
  }

  @Delete(':id')
  async delete(
    @Param('id') id: number,
    @Request() req: UserRequest,
  ): Promise<{ success: Boolean; message: string }> {
    // { userId: req.user.userId }
    const taskWithId: Promise<Task> = this.tasksService.find({id})
    
    if(!await taskWithId) throw new HttpException("Task Not found", HttpStatus.NOT_FOUND)
    if ((await taskWithId).userId !== req.user.userId)
      throw new HttpException('Forbidden Task', HttpStatus.FORBIDDEN)

    const deleated: number = await this.tasksService.delete(id).then((res) => res)
    if (deleated === 0) return { success: false, message: "couldn't delete this task" }
    return { success: true, message: 'task Deleted' }
  }
}
