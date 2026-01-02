import { Injectable } from '@nestjs/common';
import { Teacher } from './entities/teacher.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { FilterTeacherDto } from './dto/filter-teacher.dto';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';

@Injectable()
export class TeacherService {
    constructor(
        @InjectRepository(Teacher)
        private TeacherRepository: Repository<Teacher>,
    ) { }

    async create(createTeacherDto: CreateTeacherDto) {

        const Teacher = this.TeacherRepository.create(createTeacherDto);
        return this.TeacherRepository.save(Teacher);
    }

    async findAll(
        paginationDto: PaginationDto,
        filters?: Partial<FilterTeacherDto>,
    ): Promise<PaginatedResponseDto<Teacher>> {
        const { page = 1, limit = 1000000000000 } = paginationDto;
        const skip = (page - 1) * limit;

        const queryBuilder = this.TeacherRepository
            .createQueryBuilder('Teacher')
            .leftJoinAndSelect('Teacher.user', 'user')
            .skip(skip)
            .take(limit)
            .orderBy('user.name', 'ASC')
            .where('Teacher.deleted_at IS NULL');

        // Apply filter if phone no avl
        if (filters?.user_id) {
            queryBuilder.andWhere('Teacher.user_id = :user_id', {
                user_id: filters.user_id,
            });
        }

        // Apply status filter if provided
        if (filters?.name) {
            queryBuilder.andWhere('user.name = :name', {
                name: filters.name,
            });
        }

        // Apply search filter if provided
        if (filters?.designation) {
            queryBuilder.andWhere(
                '(eacher.designation ILIKE :designation', {
                designation: `%${filters.designation}%`
            },
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
        return this.TeacherRepository.findOne({
            where: { id },
            withDeleted: false, // Only get non-deleted Teachers
        });
    }

    findByEmailOrTeacherName(email: string) {
        return this.TeacherRepository
            .createQueryBuilder('Teacher')
            .addSelect('Teacher.password')
            .where('Teacher.email = :email', { email })
            // .andWhere('Teacher.deletedAt IS NULL') // Only get non-deleted Teachers
            .getOne();
    }

    update(id: string, updateTeacherDto: UpdateTeacherDto) {
        return this.TeacherRepository.update(id, updateTeacherDto);
    }

    remove(id: string) {
        return this.TeacherRepository.softDelete(id);
    }

    // Method to permanently delete a Teacher (for admin purposes)
    permanentRemove(id: string) {
        return this.TeacherRepository.delete(id);
    }

    // Method to restore a soft-deleted Teacher
    restore(id: string) {
        return this.TeacherRepository.restore(id);
    }


}

