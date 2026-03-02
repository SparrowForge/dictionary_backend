import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';

import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UpdatePasswordDto } from 'src/users/dto/update-password.dto';
import { BaseResponseDto } from 'src/common/dto/base-response.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  async create(createUserDto: CreateUserDto) {
    // Hash the password before saving
    const existingUser = await this.findByEmailOrUserName(createUserDto.email);
    console.log(existingUser);
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }
    // const existingUserByUserName = await this.findByEmailOrUserName(createUserDto.name);
    // if (existingUserByUserName) {
    //   throw new BadRequestException('Username already exists');
    // }
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Create user DTO with hashed password
    const userWithHashedPassword = {
      ...createUserDto,
      password: hashedPassword,
    };

    const user = this.userRepository.create(userWithHashedPassword);
    return this.userRepository.save(user);
  }

  async findAll(
    paginationDto: PaginationDto,
    filters?: Partial<FilterUserDto>,
  ): Promise<PaginatedResponseDto<User>> {
    const { page = 1, limit = 1000000000000 } = paginationDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.file', 'file')
      .leftJoinAndSelect('user.class', 'class')
      .skip(skip)
      .take(limit)
      .orderBy('user.name', 'DESC');

    // Apply filter if phone no avl
    if (filters?.phone_no) {
      queryBuilder.andWhere('user.phone_no = :phone_no', {
        phone_no: filters.phone_no,
      });
    }

    // Apply status filter if provided
    if (filters?.status) {
      queryBuilder.andWhere('user.status = :status', {
        status: filters.status,
      });
    }

    // Apply role filter if provided
    if (filters?.role) {
      queryBuilder.andWhere('user.role = :role', {
        role: filters.role,
      });
    }

    // Apply email filter if provided
    if (filters?.email) {
      queryBuilder.andWhere('user.email = :email', {
        email: filters.email,
      });
    }

    // Apply name filter if provided
    if (filters?.name) {
      queryBuilder.andWhere('user.name ILIKE :name', {
        name: filters.name,
      });
    }
    if (filters?.class_id) {
      queryBuilder.andWhere('user.class_id = :class_id', {
        class_id: filters.class_id,
      });
    }
    if (filters?.section) {
      queryBuilder.andWhere('(user.section ILIKE :section)',
        { section: `%${filters.section}%` },
      );
    }

    const [items, total] = await queryBuilder.getManyAndCount();

    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    // items.forEach(item => {
    //   item.country: { id: item.country_id, name: item?.countries?.name }
    // });

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      },
    };
  }

  findOne(id: string) {
    return this.userRepository.findOne({
      where: { id },
      relations: ['file', 'class'],
      withDeleted: false, // Only get non-deleted users
    });
  }

  findByEmailOrUserName(email: string) {
    return this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
  }

  findByIdWithPassword(id: string) {
    return this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.id = :id', { id })
      .getOne();
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, updateUserDto);
  }

  remove(id: string) {
    return this.userRepository.softDelete(id);
  }

  // Method to permanently delete a user (for admin purposes)
  permanentRemove(id: string) {
    return this.userRepository.delete(id);
  }

  // Method to restore a soft-deleted user
  restore(id: string) {
    return this.userRepository.restore(id);
  }

  getRoles(userId: string) {
    return this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'role'],
    });
  }

  async updatePassword(id: string, newPassword: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepository.update(id, { password: hashedPassword });
  }

  async updatePasswordNew(userId: string, updatePasswordDto: UpdatePasswordDto) {
    const { previousPassword, newPassword } = updatePasswordDto;

    const user = await this.findByIdWithPassword(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    console.log(user);
    const isPreviousPasswordValid = await bcrypt.compare(
      previousPassword,
      user.password,
    );
    if (!isPreviousPasswordValid) {
      throw new UnauthorizedException('Previous password is incorrect');
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      throw new BadRequestException(
        'New password must be different from previous password',
      );
    }

    await this.updatePassword(userId, newPassword);
    return new BaseResponseDto(null, 'Password updated successfully');
  }
}
