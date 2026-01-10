import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';
import { StudentActivity } from './entities/student-activity.entity';
import { CreateStudentActivityDto } from './dto/create-student-activity.dto';
import { FilterStudentActivityDto } from './dto/filter-student-activity.dto';
import { UpdateStudentActivityDto } from './dto/update-student-activity.dto';

@Injectable()
export class StudentActivityService {
    constructor(
        @InjectRepository(StudentActivity)
        private StudentActivityRepository: Repository<StudentActivity>,
    ) { }

    async create(createStudentActivityDto: CreateStudentActivityDto) {

        const StudentActivity = this.StudentActivityRepository.create(createStudentActivityDto);
        return this.StudentActivityRepository.save(StudentActivity);
    }

    async findAll(
        paginationDto: PaginationDto,
        filters?: Partial<FilterStudentActivityDto>,
    ): Promise<PaginatedResponseDto<StudentActivity>> {
        const { page = 1, limit = 1000000000000 } = paginationDto;
        const skip = (page - 1) * limit;

        const queryBuilder = this.StudentActivityRepository
            .createQueryBuilder('StudentActivity')
            .leftJoinAndSelect('StudentActivity.student', 'student')
            .leftJoinAndSelect('StudentActivity.word', 'word')
            .leftJoinAndSelect('StudentActivity.created_by_user', 'created_by_user')
            .leftJoinAndSelect('StudentActivity.updated_by_user', 'updated_by_user')
            .skip(skip)
            .take(limit)
            .orderBy('word.english_word', 'ASC')
            .where('StudentActivity.deleted_at IS NULL');

        // Apply status filter if provided
        if (filters?.student_id) {
            queryBuilder.andWhere('StudentActivity.student_id = :student_id', {
                student_id: filters.student_id,
            });
        }
        if (filters?.word_id) {
            queryBuilder.andWhere('StudentActivity.word_id = :word_id', {
                word_id: filters.word_id,
            });
        }


        const [items, total] = await queryBuilder.getManyAndCount();

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

    findOne(id: string) {
        return this.StudentActivityRepository.findOne({
            where: { id },
            relations: ['word', 'student', 'created_by_user', 'updated_by_user'],
            withDeleted: false,
        });
    }

    update(id: string, updateStudentActivityDto: UpdateStudentActivityDto) {
        return this.StudentActivityRepository.update(id, updateStudentActivityDto);
    }

    remove(id: string) {
        return this.StudentActivityRepository.softDelete(id);
    }

    // Method to permanently delete a StudentActivity (for admin purposes)
    permanentRemove(id: string) {
        return this.StudentActivityRepository.delete(id);
    }

    // Method to restore a soft-deleted StudentActivity
    restore(id: string) {
        return this.StudentActivityRepository.restore(id);
    }


}


