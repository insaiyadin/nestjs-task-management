import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) {}

    async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        const { username, password } = authCredentialsDto;
        
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(password, salt);

        console.log('salt', salt);
        console.log('password', hashedPassword);

        try {
            const newUser = await this.prisma.user.create({
                data: {
                    username: username,
                    password: hashedPassword
                }
            })
        } catch (err) {
            if (err.code === 'P2002') {
                throw new ConflictException('This user already exists');
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    async loginUser(authCredentials: AuthCredentialsDto): Promise<string> {
        const { username, password } = authCredentials;
        const user = await this.prisma.user.findUnique({
            where: {
                username: username
            }
        })

        if (user && await bcrypt.compare(password, user.password)) {
            return 'success'
        } else {
            throw new UnauthorizedException()
        }

    }

}
