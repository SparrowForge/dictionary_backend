import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';
import { Students } from './entities/students.entity';
import { CreateStudentsDto } from './dto/create-students.dto';
import { FilterStudentsDto } from './dto/filter-students.dto';
import { UpdateStudentsDto } from './dto/update-students.dto';

@Injectable()
export class StudentsService {
    constructor(
        @InjectRepository(Students)
        private StudentsRepository: Repository<Students>,
    ) { }

    async create(createStudentsDto: CreateStudentsDto) {

        const Students = this.StudentsRepository.create(createStudentsDto);
        return this.StudentsRepository.save(Students);
    }

    async findAll(
        paginationDto: PaginationDto,
        filters?: Partial<FilterStudentsDto>,
    ): Promise<PaginatedResponseDto<Students>> {
        const { page = 1, limit = 1000000000000 } = paginationDto;
        const skip = (page - 1) * limit;

        const queryBuilder = this.StudentsRepository
            .createQueryBuilder('Students')
            .leftJoinAndSelect('Students.user', 'user')
            .leftJoinAndSelect('Students.class', 'class')
            .leftJoinAndSelect('Students.file', 'file')
            .leftJoinAndSelect('Students.created_by_user', 'created_by_user')
            .leftJoinAndSelect('Students.updated_by_user', 'updated_by_user')
            .skip(skip)
            .take(limit)
            .orderBy('user.name', 'ASC')
            .where('Students.deleted_at IS NULL');

        // Apply status filter if provided
        if (filters?.name) {
            queryBuilder.andWhere('user.name ILIKE :name', {
                name: `%${filters.name}%`,
            });
        }
        if (filters?.user_id) {
            queryBuilder.andWhere('Students.user_id = :user_id', {
                user_id: filters.user_id,
            });
        }
        if (filters?.student_id) {
            queryBuilder.andWhere('Students.student_id = :student_id', {
                student_id: filters.student_id,
            });
        }
        if (filters?.class_id) {
            queryBuilder.andWhere('Students.class_id = :class_id', {
                class_id: filters.class_id,
            });
        }
        if (filters?.class_name) {
            queryBuilder.andWhere('class.name ILIKE :class_name', {
                class_name: `%${filters.class_name}%`,
            });
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
        return this.StudentsRepository.findOne({
            where: { id },
            relations: ['user', 'class', 'file', 'created_by_user', 'updated_by_user'],
            withDeleted: false, // Only get non-deleted Studentss
        });
    }

    findByEmailOrStudentsName(email: string) {
        return this.StudentsRepository
            .createQueryBuilder('Students')
            .addSelect('Students.password')
            .where('Students.email = :email', { email })
            // .andWhere('Students.deletedAt IS NULL') // Only get non-deleted Studentss
            .getOne();
    }

    update(id: string, updateStudentsDto: UpdateStudentsDto) {
        return this.StudentsRepository.update(id, updateStudentsDto);
    }

    remove(id: string) {
        return this.StudentsRepository.softDelete(id);
    }

    // Method to permanently delete a Students (for admin purposes)
    permanentRemove(id: string) {
        return this.StudentsRepository.delete(id);
    }

    // Method to restore a soft-deleted Students
    restore(id: string) {
        return this.StudentsRepository.restore(id);
    }


}


