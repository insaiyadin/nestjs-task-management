import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

import { PrismaService } from '../prisma.service';
import { Task, TaskStatus } from '@prisma/client'


@Injectable()
export class TasksService {
    constructor(private prisma: PrismaService) {}
    
    async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
        const { status, search } = filterDto;
        
        let filterConditions;

        if (search) {
            filterConditions = { OR:
                [
                    {
                        status: status ? status : undefined,
                        title: {
                            contains: search
                        }
                    }, 
                    {
                        status: status ? status : undefined,
                        description: {
                            contains: search
                        }
                    }
                ]
            }
        } else if (status) {
            filterConditions = {
                status: status
            }
        }

        let tasks = await this.prisma.task.findMany({
            where: filterConditions
        })

        return tasks;
    }

    async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
        const { title, description } = createTaskDto;

        const newTask: Task = await this.prisma.task.create({
            data: {
                title: title,
                description: description,
                status: TaskStatus.OPEN
            }
        })

        return newTask;
    }

    async getTaskById(id: string): Promise<Task> {
        const found = await this.prisma.task.findUnique({
            where: {
                id: id
            }
        });
        if (!found) {
            throw new NotFoundException();
        }

        return found;
    }

    async deleteTaskById(id: string): Promise<Task> {
        try {
            return await this.prisma.task.delete({
                where: {
                    id: id
                }
            })
        } catch(err) {
            throw new NotFoundException();
        }
    }

    async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
        try {
            const updateTask = await this.prisma.task.update({
                where: {
                    id: id
                }, data: {
                    status: status
                }
            })
            return updateTask;
        } catch (err) {
            throw new NotFoundException()
        }
        
    }
}
