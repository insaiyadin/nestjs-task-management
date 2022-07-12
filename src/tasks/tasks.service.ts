import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

import { PrismaService } from '../prisma.service';
import { Task, TaskStatus, User } from '@prisma/client'


@Injectable()
export class TasksService {
    constructor(private prisma: PrismaService) {}
    
    async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
        const { status, search } = filterDto;

        let filterConditions;

        if (search) {
            filterConditions = { OR:
                [
                    {
                        status: status ? status : undefined,
                        title: {
                            contains: search,
                            mode: 'insensitive'
                        },
                        userId: user.id
                    }, 
                    {
                        status: status ? status : undefined,
                        description: {
                            contains: search,
                            mode: 'insensitive'
                        },
                        userId: user.id
                    }
                ]
            }
        } else if (status) {
            filterConditions = {
                status: status,
                userId: user.id
            }
        } else {
            filterConditions = {
                userId: user.id
            }
        }

        let tasks = await this.prisma.task.findMany({
            where: filterConditions
        })

        return tasks;
    }

    async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        const { title, description } = createTaskDto;

        const newTask: Task = await this.prisma.task.create({
            data: {
                title: title,
                description: description,
                status: TaskStatus.OPEN,
                userId: user.id
            }
        })

        return newTask;
    }

    async getTaskById(id: string, user: User): Promise<Task> {
        const found = await this.prisma.task.findFirst({
            where: {
                id: id,
                userId: user.id
            }
        });
        if (!found) {
            throw new NotFoundException();
        }

        return found;
    }

    async deleteTaskById(id: string, user: User): Promise<Task> {
        const task = await this.getTaskById(id, user);
        const deleted = await this.prisma.task.delete({
            where: {
                id: id,
            }
        })

        return deleted;
    }

    async updateTaskStatus(id: string, status: TaskStatus, user: User): Promise<Task> {
        const task = await this.getTaskById(id, user);

        try {
            const updatedTask = await this.prisma.task.update({
                where: {
                    id: id
                }, data: {
                    status: status
                }
            })
            return updatedTask;
        } catch (err) {
            throw new NotFoundException()
        }
    }
}
