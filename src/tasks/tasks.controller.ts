import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { Task, User } from '@prisma/client';
import { TasksService } from './tasks.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    constructor(private tasksService: TasksService) {}

    @Get()
    async getTasks(
        @Query() filterDto: GetTasksFilterDto,
        @GetUser() user: User): Promise<Task[]> {
        return this.tasksService.getTasks(filterDto, user)
    }

    @Get('/:taskId')
    async getTaskById(
        @Param('taskId') taskId: string,
        @GetUser() user: User): Promise<Task> {
        return this.tasksService.getTaskById(taskId, user);
    }
    

    @Delete('/:taskId')
    async deleteTaskById(
        @Param('taskId') taskId: string,
        @GetUser() user: User): Promise<object> {
        const count = await this.tasksService.deleteTaskById(taskId, user);
        console.log(count);
        return {
            message: `Deleted ${count} task`
        }
    }

    @Post()
    async createTask(
        @Body() createTaskDto: CreateTaskDto,
        @GetUser() user: User): Promise<Task> {
        return this.tasksService.createTask(createTaskDto, user);
    }

    @Patch('/:taskId/status')
    async updateTaskStatus(
        @Param('taskId') taskId: string,
        @Body() updateTaskStatusDto: UpdateTaskStatusDto,
        @GetUser() user: User
    ): Promise<Task> {
        const { status } = updateTaskStatusDto;
        return this.tasksService.updateTaskStatus(taskId, status, user);
    }
}
