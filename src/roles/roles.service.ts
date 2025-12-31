import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { FilterRoleDto } from './dto/filter-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    // Check if role name already exists
    const existingRole = await this.roleRepository.findOne({
      where: {
        name: createRoleDto.name,
      },
      withDeleted: false,
    });

    if (existingRole) {
      throw new BadRequestException(
        `Role with name '${createRoleDto.name}' already exists`,
      );
    }

    const role = this.roleRepository.create(createRoleDto);
    return this.roleRepository.save(role);
  }

  async findAllActiveRoles(): Promise<Role[]> {
    const queryBuilder = this.roleRepository
      .createQueryBuilder('role')
      .where('role.deletedAt IS NULL');

    const [items, total] = await queryBuilder
      .orderBy('role.createdAt', 'DESC')
      .getManyAndCount();

    return items;
  }

  async findAll(
    paginationDto: PaginationDto,
    filters?: Partial<FilterRoleDto>,
  ): Promise<PaginatedResponseDto<Role>> {
    const { page = 1, limit = 1000000000000 } = paginationDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.roleRepository
      .createQueryBuilder('role')
      .where('role.deletedAt IS NULL');

    // Apply status filter if provided
    if (filters?.status) {
      queryBuilder.andWhere('role.status = :status', {
        status: filters.status,
      });
    }

    // Apply name filter if provided
    if (filters?.name) {
      queryBuilder.andWhere('role.name ILIKE :name', {
        name: `%${filters.name}%`,
      });
    }

    // Apply search filter if provided
    if (filters?.search) {
      queryBuilder.andWhere('role.name ILIKE :search', {
        search: `%${filters.search}%`,
      });
    }

    const [items, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy('role.createdAt', 'DESC')
      .getManyAndCount();

    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

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

  async findOne(id: number) {
    const role = await this.roleRepository.findOne({
      where: { id },
      withDeleted: false, // Only get non-deleted roles
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    return role;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const role = await this.findOne(id);

    // If name is being updated, check for duplicates
    if (updateRoleDto.name && updateRoleDto.name !== role.name) {
      const existingRole = await this.roleRepository.findOne({
        where: {
          name: updateRoleDto.name,
          id: { $ne: id } as any, // Exclude current role
        },
        withDeleted: false,
      });

      if (existingRole) {
        throw new BadRequestException(
          `Role with name '${updateRoleDto.name}' already exists`,
        );
      }
    }

    await this.roleRepository.update(id, updateRoleDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const role = await this.findOne(id);
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    return this.roleRepository.softDelete(id);
  }

  // Method to permanently delete a role (for admin purposes)
  async permanentRemove(id: number) {
    const role = await this.findOne(id);
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    return this.roleRepository.delete(id);
  }

  // Method to restore a soft-deleted role
  async restore(id: number) {
    const role = await this.roleRepository.findOne({
      where: { id },
      withDeleted: true, // Include soft-deleted roles
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    if (!role.deletedAt) {
      throw new BadRequestException(`Role with ID ${id} is not deleted`);
    }

    return this.roleRepository.restore(id);
  }

  // Method to find soft-deleted roles
  async findDeleted() {
    return this.roleRepository
      .createQueryBuilder('role')
      .withDeleted()
      .where('role.deletedAt IS NULL')
      .getMany();
  }
}
