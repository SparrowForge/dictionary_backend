import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';
import { WordMedia } from './entities/word-media.entity';
import { CreateWordMediaDto } from './dto/create-word-media.dto';
import { FilterWordMediaDto } from './dto/filter-word-media.dto';
import { UpdateWordMediaDto } from './dto/update-word-media.dto';

@Injectable()
export class WordMediaService {
    constructor(
        @InjectRepository(WordMedia)
        private WordMediaRepository: Repository<WordMedia>,
    ) { }

    async create(createWordMediaDto: CreateWordMediaDto) {

        const WordMedia = this.WordMediaRepository.create(createWordMediaDto);
        return this.WordMediaRepository.save(WordMedia);
    }

    async findAll(
        paginationDto: PaginationDto,
        filters?: Partial<FilterWordMediaDto>,
    ): Promise<PaginatedResponseDto<WordMedia>> {
        const { page = 1, limit = 1000000000000 } = paginationDto;
        const skip = (page - 1) * limit;

        const queryBuilder = this.WordMediaRepository
            .createQueryBuilder('WordMedia')
            .leftJoinAndSelect('WordMedia.word', 'word')
            .leftJoinAndSelect('WordMedia.audio', 'audio')
            .leftJoinAndSelect('WordMedia.image', 'image')
            .leftJoinAndSelect('WordMedia.created_by_user', 'created_by_user')
            .leftJoinAndSelect('WordMedia.updated_by_user', 'updated_by_user')
            .skip(skip)
            .take(limit)
            .orderBy('word.english_word', 'ASC')
            .where('WordMedia.deleted_at IS NULL');

        // Apply status filter if provided
        if (filters?.word_id) {
            queryBuilder.andWhere('WordMedia.word_id = :word_id', {
                word_id: filters.word_id,
            });
        }
        // if (filters?.sentence) {
        //     queryBuilder.andWhere('WordMedia.sentence ILike :sentence', {
        //         sentence: `%${filters.sentence}%`
        //     });
        // }

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
        return this.WordMediaRepository.findOne({
            where: { id },
            relations: ['word', 'audio', 'image', 'created_by_user', 'updated_by_user'],
            withDeleted: false,
        });
    }

    update(id: string, updateWordMediaDto: UpdateWordMediaDto) {
        return this.WordMediaRepository.update(id, updateWordMediaDto);
    }

    remove(id: string) {
        return this.WordMediaRepository.softDelete(id);
    }

    permanentRemove(id: string) {
        return this.WordMediaRepository.delete(id);
    }

    restore(id: string) {
        return this.WordMediaRepository.restore(id);
    }


}


