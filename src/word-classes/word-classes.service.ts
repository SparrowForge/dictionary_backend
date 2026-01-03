import { Injectable } from '@nestjs/common';
import { WordClasses } from './entities/word-classes.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateWordClassesDto } from './dto/create-word-classes.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { FilterWordClassesDto } from './dto/filter-word-classes.dto';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';
import { UpdateWordClassesDto } from './dto/update-word-classes.dto';

@Injectable()
export class WordClassesService {
    constructor(
        @InjectRepository(WordClasses)
        private ClassesRepository: Repository<WordClasses>,
    ) { }

    async create(createClassesDto: CreateWordClassesDto) {

        const Classes = this.ClassesRepository.create(createClassesDto);
        return this.ClassesRepository.save(Classes);
    }

    async findAll(
        paginationDto: PaginationDto,
        filters?: Partial<FilterWordClassesDto>,
    ): Promise<PaginatedResponseDto<WordClasses>> {
        const { page = 1, limit = 1000000000000 } = paginationDto;
        const skip = (page - 1) * limit;

        const queryBuilder = this.ClassesRepository
            .createQueryBuilder('Classes')
            .leftJoinAndSelect('Classes.created_by_user', 'created_by_user')
            .leftJoinAndSelect('Classes.updated_by_user', 'updated_by_user')
            .skip(skip)
            .take(limit)
            .orderBy('Classes.name', 'ASC')
            .where('Classes.deleted_at IS NULL');

        // Apply status filter if provided
        if (filters?.word_id) {
            queryBuilder.andWhere('Classes.word_id = :word_id', {
                word_id: filters.word_id,
            });
        }
        if (filters?.class_id) {
            queryBuilder.andWhere('Classes.class_id = :class_id', {
                class_id: filters.class_id,
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
        return this.ClassesRepository.findOne({
            where: { id },
            relations: ['created_by_user', 'updated_by_user'],
            withDeleted: false, // Only get non-deleted Classess
        });
    }

    findByEmailOrClassesName(email: string) {
        return this.ClassesRepository
            .createQueryBuilder('Classes')
            .addSelect('Classes.password')
            .where('Classes.email = :email', { email })
            // .andWhere('Classes.deletedAt IS NULL') // Only get non-deleted Classess
            .getOne();
    }

    update(id: string, updateClassesDto: UpdateWordClassesDto) {
        return this.ClassesRepository.update(id, updateClassesDto);
    }

    remove(id: string) {
        return this.ClassesRepository.softDelete(id);
    }

    // Method to permanently delete a Classes (for admin purposes)
    permanentRemove(id: string) {
        return this.ClassesRepository.delete(id);
    }

    // Method to restore a soft-deleted Classes
    restore(id: string) {
        return this.ClassesRepository.restore(id);
    }


}


