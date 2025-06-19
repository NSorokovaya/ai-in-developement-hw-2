import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { address, company, ...userData } = createUserDto;

    // Check if user with email already exists
    const existingUser = await this.findByEmail(userData.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    return this.prisma.user.create({
      data: {
        email: userData.email,
        password: userData.password,
        username: userData.username,
        name: userData.name,
        address: address
          ? {
              create: {
                ...address,
                geo: {
                  create: address.geo,
                },
              },
            }
          : undefined,
        company: company
          ? {
              create: company,
            }
          : undefined,
      },
      include: {
        address: {
          include: {
            geo: true,
          },
        },
        company: true,
        posts: true,
        comments: true,
      },
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      include: {
        address: {
          include: {
            geo: true,
          },
        },
        company: true,
        posts: true,
        comments: true,
      },
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        address: {
          include: {
            geo: true,
          },
        },
        company: true,
        posts: true,
        comments: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        address: {
          include: {
            geo: true,
          },
        },
        company: true,
      },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const { address, company, ...userData } = updateUserDto;

    try {
      return await this.prisma.user.update({
        where: { id },
        data: {
          ...userData,
          address: address
            ? {
                upsert: {
                  create: {
                    ...address,
                    geo: {
                      create: address.geo,
                    },
                  },
                  update: {
                    ...address,
                    geo: {
                      upsert: {
                        create: address.geo,
                        update: address.geo,
                      },
                    },
                  },
                },
              }
            : undefined,
          company: company
            ? {
                upsert: {
                  create: company,
                  update: company,
                },
              }
            : undefined,
        },
        include: {
          address: {
            include: {
              geo: true,
            },
          },
          company: true,
        },
      });
    } catch {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.user.delete({
        where: { id },
        include: {
          address: {
            include: {
              geo: true,
            },
          },
          company: true,
        },
      });
    } catch {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}
