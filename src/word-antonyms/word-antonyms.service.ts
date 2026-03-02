/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';
import { WordAntonyms } from './entities/word-antonyms.entity';
import { CreateWordAntonymsDto } from './dto/create-word-antonyms.dto';
import { FilterWordAntonymsDto } from './dto/filter-word-antonyms.dto';
import { UpdateWordAntonymsDto } from './dto/update-word-antonyms.dto';

@Injectable()
export class WordAntonymsService {
    constructor(
        @InjectRepository(WordAntonyms)
        private WordAntonymsRepository: Repository<WordAntonyms>,
    ) { }

    async create(updateWordAntonymsDto: CreateWordAntonymsDto) {

        // const WordAntonyms = this.WordAntonymsRepository.create(createWordAntonymsDto);
        // return this.WordAntonymsRepository.save(WordAntonyms);

        //delete this word previous data
        await this.WordAntonymsRepository.delete({ word_id: updateWordAntonymsDto.word_id });
        console.log(updateWordAntonymsDto);

        const entity = updateWordAntonymsDto.antonym.map(item => {
            return {
                word_id: updateWordAntonymsDto.word_id,
                antonym: item,
                created_by: updateWordAntonymsDto.created_by
            }
        })
        console.log(entity);
        const WordSynonyms = this.WordAntonymsRepository.create(entity);
        return this.WordAntonymsRepository.save(WordSynonyms);
    }

    async findAll(
        paginationDto: PaginationDto,
        filters?: Partial<FilterWordAntonymsDto>,
    ): Promise<PaginatedResponseDto<WordAntonyms>> {
        const { page = 1, limit = 1000000000000 } = paginationDto;
        const skip = (page - 1) * limit;

        const queryBuilder = this.WordAntonymsRepository
            .createQueryBuilder('WordAntonyms')
            .leftJoinAndSelect('WordAntonyms.word', 'word')
            .leftJoinAndSelect('WordAntonyms.created_by_user', 'created_by_user')
            .leftJoinAndSelect('WordAntonyms.updated_by_user', 'updated_by_user')
            .skip(skip)
            .take(limit)
            .orderBy('word.english_word', 'ASC')
            .where('WordAntonyms.deleted_at IS NULL');

        // Apply status filter if provided
        if (filters?.word_id) {
            queryBuilder.andWhere('WordAntonyms.word_id = :word_id', {
                word_id: filters.word_id,
            });
        }
        if (filters?.antonym) {
            queryBuilder.andWhere('WordAntonyms.antonym ILike :antonym', {
                antonym: `%${filters.antonym}%`
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
        return this.WordAntonymsRepository.findOne({
            where: { id },
            relations: ['word', 'created_by_user', 'updated_by_user'],
            withDeleted: false,
        });
    }

    async update(id: string, updateWordAntonymsDto: UpdateWordAntonymsDto) {
        // return this.WordAntonymsRepository.update(id, updateWordAntonymsDto);

        //delete this word previous data
        await this.WordAntonymsRepository.delete({ word_id: updateWordAntonymsDto.word_id });
        console.log(updateWordAntonymsDto);

        const entity = updateWordAntonymsDto.antonym.map(item => {
            return {
                word_id: updateWordAntonymsDto.word_id,
                antonym: item,
                created_by: updateWordAntonymsDto.created_by
            }
        })
        console.log(entity);
        const WordSynonyms = this.WordAntonymsRepository.create(entity);
        return this.WordAntonymsRepository.save(WordSynonyms);
    }

    remove(id: string) {
        return this.WordAntonymsRepository.softDelete(id);
    }

    // Method to permanently delete a WordAntonyms (for admin purposes)
    permanentRemove(id: string) {
        return this.WordAntonymsRepository.delete(id);
    }

    // Method to restore a soft-deleted WordAntonyms
    restore(id: string) {
        return this.WordAntonymsRepository.restore(id);
    }


}


