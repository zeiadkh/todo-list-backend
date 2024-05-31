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
} from '@nestjs/common'
import { TasksService } from './tasks.service'
import { Task } from './task.entity'
import { AuthGuard } from '@nestjs/passport'

@UseGuards(AuthGuard('jwt'))
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  async findAll(): Promise<Task[]> {
    return this.tasksService.findAll()
  }

  @Post()
  async create(@Body() task: Task): Promise<Task> {
    console.log(task)
    if (!task.title || !task.category || !task.description || !task.dueDate)
      throw new BadRequestException('You must provide the task data')
    return this.tasksService.create(task)
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() task: Task): Promise<Task> {
    if (!task.title && !task.category && !task.description && !task.dueDate)
      throw new BadRequestException('No thing to Update!')

    return this.tasksService.update(id, task)
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<{ success: Boolean; message: string }> {
    const deleated: number = await this.tasksService.delete(id).then((res) => res)
    if (deleated === 0) return { success: false, message: "couldn't delete this task" }
    return { success: true, message: 'task Deleted' }
  }
}
