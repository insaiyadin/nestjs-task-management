import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';

@Module({
    imports: [
        TasksModule,
        AuthModule,
    ],
})
export class AppModule {
    constructor() {}
}
