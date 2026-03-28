import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';
import { WordSynonyms } from './entities/word-synonyms.entity';
import { CreateWordSynonymsDto } from './dto/create-word-synonyms.dto';
import { FilterWordSynonymsDto } from './dto/filter-word-synonyms.dto';
import { UpdateWordSynonymsDto } from './dto/update-word-synonyms.dto';

@Injectable()
export class WordSynonymsService {
    constructor(
        @InjectRepository(WordSynonyms)
        private WordSynonymsRepository: Repository<WordSynonyms>,
    ) { }

    async create(createWordSynonymsDto: CreateWordSynonymsDto) {
        //delete this word previous data
        await this.WordSynonymsRepository.delete({ word_id: createWordSynonymsDto.word_id });
        console.log(createWordSynonymsDto);

        const entity = createWordSynonymsDto.synonym.map(item => {
            return {
                word_id: createWordSynonymsDto.word_id,
                synonym: item,
                created_by: createWordSynonymsDto.created_by
            }
        })
        console.log(entity);
        const WordSynonyms = this.WordSynonymsRepository.create(entity);
        return this.WordSynonymsRepository.save(WordSynonyms);
    }

    async findAll(
        paginationDto: PaginationDto,
        filters?: Partial<FilterWordSynonymsDto>,
    ): Promise<PaginatedResponseDto<WordSynonyms>> {
        const { page = 1, limit = 1000000000000 } = paginationDto;
        const skip = (page - 1) * limit;

        const queryBuilder = this.WordSynonymsRepository
            .createQueryBuilder('WordSynonyms')
            .leftJoinAndSelect('WordSynonyms.word', 'word')
            .leftJoinAndSelect('WordSynonyms.created_by_user', 'created_by_user')
            .leftJoinAndSelect('WordSynonyms.updated_by_user', 'updated_by_user')
            .skip(skip)
            .take(limit)
            .orderBy('WordSynonyms.synonym', 'ASC')
            .where('WordSynonyms.deleted_at IS NULL');

        // Apply status filter if provided
        if (filters?.word_id) {
            queryBuilder.andWhere('WordSynonyms.word_id = :word_id', {
                word_id: filters.word_id,
            });
        }
        if (filters?.synonym) {
            queryBuilder.andWhere('WordSynonyms.synonym ILike :synonym', {
                synonym: `%${filters.synonym}%`
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
        return this.WordSynonymsRepository.findOne({
            where: { id },
            relations: ['word', 'created_by_user', 'updated_by_user'],
            withDeleted: false,
        });
    }

    async update(id: string, createWordSynonymsDto: UpdateWordSynonymsDto) {
        // return this.WordSynonymsRepository.update(id, updateWordSynonymsDto);
        //delete this word previous data
        await this.WordSynonymsRepository.delete({ word_id: createWordSynonymsDto.word_id });
        console.log(createWordSynonymsDto);

        const entity = createWordSynonymsDto.synonym.map(item => {
            return {
                word_id: createWordSynonymsDto.word_id,
                synonym: item,
                created_by: createWordSynonymsDto.created_by
            }
        })
        console.log(entity);
        const WordSynonyms = this.WordSynonymsRepository.create(entity);
        return this.WordSynonymsRepository.save(WordSynonyms);
    }

    remove(id: string) {
        return this.WordSynonymsRepository.softDelete(id);
    }

    // Method to permanently delete a WordSynonyms (for admin purposes)
    permanentRemove(id: string) {
        return this.WordSynonymsRepository.delete(id);
    }

    // Method to restore a soft-deleted WordSynonyms
    restore(id: string) {
        return this.WordSynonymsRepository.restore(id);
    }


}


