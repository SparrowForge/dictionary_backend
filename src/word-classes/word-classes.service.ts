import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';
import { WordClasses } from './entities/word-classes.entity';
import { CreateWordClassesDto } from './dto/create-word-classes.dto';
import { FilterWordClassesDto } from './dto/filter-word-classes.dto';
import { UpdateWordClassesDto } from './dto/update-word-classes.dto';

@Injectable()
export class WordClassesService {
    constructor(
        @InjectRepository(WordClasses)
        private WordClassesRepository: Repository<WordClasses>,
    ) { }

    async create(createWordClassesDto: CreateWordClassesDto) {

        const WordClasses = this.WordClassesRepository.create(createWordClassesDto);
        return this.WordClassesRepository.save(WordClasses);
    }

    async findAll(
        paginationDto: PaginationDto,
        filters?: Partial<FilterWordClassesDto>,
    ): Promise<PaginatedResponseDto<WordClasses>> {
        const { page = 1, limit = 1000000000000 } = paginationDto;
        const skip = (page - 1) * limit;

        const queryBuilder = this.WordClassesRepository
            .createQueryBuilder('WordClasses')
            .leftJoinAndSelect('WordClasses.word', 'word')
            .leftJoinAndSelect('WordClasses.class', 'class')
            .leftJoinAndSelect('WordClasses.created_by_user', 'created_by_user')
            .leftJoinAndSelect('WordClasses.updated_by_user', 'updated_by_user')
            .skip(skip)
            .take(limit)
            .orderBy('word.english_word', 'ASC')
            .where('WordClasses.deleted_at IS NULL');

        // Apply status filter if provided
        if (filters?.word_id) {
            queryBuilder.andWhere('WordClasses.word_id = :word_id', {
                word_id: filters.word_id,
            });
        }
        if (filters?.class_id) {
            queryBuilder.andWhere('WordClasses.class_id = :class_id', {
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
        return this.WordClassesRepository.findOne({
            where: { id },
            relations: ['word', 'class', 'created_by_user', 'updated_by_user'],
            withDeleted: false,
        });
    }

    update(id: string, updateWordClassesDto: UpdateWordClassesDto) {
        return this.WordClassesRepository.update(id, updateWordClassesDto);
    }

    remove(id: string) {
        return this.WordClassesRepository.softDelete(id);
    }

    // Method to permanently delete a WordClasses (for admin purposes)
    permanentRemove(id: string) {
        return this.WordClassesRepository.delete(id);
    }

    // Method to restore a soft-deleted WordClasses
    restore(id: string) {
        return this.WordClassesRepository.restore(id);
    }


}


