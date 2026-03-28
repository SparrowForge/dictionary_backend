import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';
import { WordSentences } from './entities/word-sentences.entity';
import { CreateWordSentencesDto } from './dto/create-word-sentences.dto';
import { FilterWordSentencesDto } from './dto/filter-word-sentences.dto';
import { UpdateWordSentencesDto } from './dto/update-word-sentences.dto';

@Injectable()
export class WordSentencesService {
    constructor(
        @InjectRepository(WordSentences)
        private WordSentencesRepository: Repository<WordSentences>,
    ) { }

    async create(createWordSentencesDto: CreateWordSentencesDto) {

        const WordSentences = this.WordSentencesRepository.create(createWordSentencesDto);
        return this.WordSentencesRepository.save(WordSentences);
    }

    async findAll(
        paginationDto: PaginationDto,
        filters?: Partial<FilterWordSentencesDto>,
    ): Promise<PaginatedResponseDto<WordSentences>> {
        const { page = 1, limit = 1000000000000 } = paginationDto;
        const skip = (page - 1) * limit;

        const queryBuilder = this.WordSentencesRepository
            .createQueryBuilder('WordSentences')
            .leftJoinAndSelect('WordSentences.word', 'word')
            .leftJoinAndSelect('WordSentences.created_by_user', 'created_by_user')
            .leftJoinAndSelect('WordSentences.updated_by_user', 'updated_by_user')
            .skip(skip)
            .take(limit)
            .orderBy('WordSentences.sentence', 'ASC')
            .where('WordSentences.deleted_at IS NULL');

        // Apply status filter if provided
        if (filters?.word_id) {
            queryBuilder.andWhere('WordSentences.word_id = :word_id', {
                word_id: filters.word_id,
            });
        }
        if (filters?.sentence) {
            queryBuilder.andWhere('WordSentences.sentence ILike :sentence', {
                sentence: `%${filters.sentence}%`
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
        return this.WordSentencesRepository.findOne({
            where: { id },
            relations: ['word', 'created_by_user', 'updated_by_user'],
            withDeleted: false,
        });
    }

    update(id: string, updateWordSentencesDto: UpdateWordSentencesDto) {
        return this.WordSentencesRepository.update(id, updateWordSentencesDto);
    }

    remove(id: string) {
        return this.WordSentencesRepository.softDelete(id);
    }

    permanentRemove(id: string) {
        return this.WordSentencesRepository.delete(id);
    }

    restore(id: string) {
        return this.WordSentencesRepository.restore(id);
    }


}


