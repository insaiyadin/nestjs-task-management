import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { Task } from '@prisma/client';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
    constructor(private tasksService: TasksService) {}

    @Get()
    async getTasks(@Query() filterDto: GetTasksFilterDto): Promise<Task[]> {
        return this.tasksService.getTasks(filterDto)
    }

    @Get('/:taskId')
    async getTaskById(@Param('taskId') taskId: string): Promise<Task> {
        return this.tasksService.getTaskById(taskId);
    }
    

    @Delete('/:taskId')
    async deleteTaskById(@Param('taskId') taskId: string): Promise<object> {
        const deleted = this.tasksService.deleteTaskById(taskId);
        return {
            message: 'Deleted'
        }
    }

    @Post()
    async createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
        return this.tasksService.createTask(createTaskDto);
    }

    @Patch('/:taskId/status')
    async updateTaskStatus(
        @Param('taskId') taskId: string,
        @Body() updateTaskStatusDto: UpdateTaskStatusDto
    ): Promise<Task> {
        const { status } = updateTaskStatusDto;
        return this.tasksService.updateTaskStatus(taskId, status);
    }
}
