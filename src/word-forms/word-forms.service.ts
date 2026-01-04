import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';
import { WordForms } from './entities/word-forms.entity';
import { CreateWordFormsDto } from './dto/create-word-forms.dto';
import { FilterWordFormsDto } from './dto/filter-word-forms.dto';
import { UpdateWordFormsDto } from './dto/update-word-forms.dto';

@Injectable()
export class WordFormsService {
    constructor(
        @InjectRepository(WordForms)
        private WordFormsRepository: Repository<WordForms>,
    ) { }

    async create(createWordFormsDto: CreateWordFormsDto) {

        const WordForms = this.WordFormsRepository.create(createWordFormsDto);
        return this.WordFormsRepository.save(WordForms);
    }

    async findAll(
        paginationDto: PaginationDto,
        filters?: Partial<FilterWordFormsDto>,
    ): Promise<PaginatedResponseDto<WordForms>> {
        const { page = 1, limit = 1000000000000 } = paginationDto;
        const skip = (page - 1) * limit;

        const queryBuilder = this.WordFormsRepository
            .createQueryBuilder('WordForms')
            .leftJoinAndSelect('WordForms.word', 'word')
            .leftJoinAndSelect('WordForms.created_by_user', 'created_by_user')
            .leftJoinAndSelect('WordForms.updated_by_user', 'updated_by_user')
            .skip(skip)
            .take(limit)
            .orderBy('word.english_word', 'ASC')
            .where('WordForms.deleted_at IS NULL');

        // Apply status filter if provided
        if (filters?.word_id) {
            queryBuilder.andWhere('WordForms.word_id = :word_id', {
                word_id: filters.word_id,
            });
        }
        if (filters?.form_type) {
            queryBuilder.andWhere('WordForms.form ILike :form_type', {
                form_type: `%${filters.form_type}%`
            });
        }
        if (filters?.form_value) {
            queryBuilder.andWhere('WordForms.form ILike :form_value', {
                form_value: `%${filters.form_value}%`
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
        return this.WordFormsRepository.findOne({
            where: { id },
            relations: ['word', 'created_by_user', 'updated_by_user'],
            withDeleted: false,
        });
    }

    update(id: string, updateWordFormsDto: UpdateWordFormsDto) {
        return this.WordFormsRepository.update(id, updateWordFormsDto);
    }

    remove(id: string) {
        return this.WordFormsRepository.softDelete(id);
    }

    permanentRemove(id: string) {
        return this.WordFormsRepository.delete(id);
    }

    restore(id: string) {
        return this.WordFormsRepository.restore(id);
    }


}


