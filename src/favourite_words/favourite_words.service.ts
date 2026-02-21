import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';
import { FavouriteWords } from './entities/favourite_words.entity';
import { CreateFavouriteWordsDto } from './dto/create-favourite_words.dto';
import { FilterFavouriteWordsDto } from './dto/filter-favourite_words.dto';
import { UpdateFavouriteWordsDto } from './dto/update-favourite_words.dto';

@Injectable()
export class FavouriteWordsService {
    constructor(
        @InjectRepository(FavouriteWords)
        private FavouriteWordsRepository: Repository<FavouriteWords>,
    ) { }

    async create(createFavouriteWordsDto: CreateFavouriteWordsDto) {

        const existingFavouriteWords = await this.FavouriteWordsRepository.findOne({
            where: { student_id: createFavouriteWordsDto.student_id, word_id: createFavouriteWordsDto.word_id },
            withDeleted: true
        });

        if (existingFavouriteWords) {
            //if exist then delete
            await this.FavouriteWordsRepository.delete(existingFavouriteWords.id);
        }

        const FavouriteWords = this.FavouriteWordsRepository.create(createFavouriteWordsDto);
        return this.FavouriteWordsRepository.save(FavouriteWords);
    }

    async findAll(
        paginationDto: PaginationDto,
        filters?: Partial<FilterFavouriteWordsDto>,
    ): Promise<PaginatedResponseDto<FavouriteWords>> {
        const { page = 1, limit = 1000000000000 } = paginationDto;
        const skip = (page - 1) * limit;

        const queryBuilder = this.FavouriteWordsRepository
            .createQueryBuilder('FavouriteWords')
            .leftJoinAndSelect('FavouriteWords.student', 'student')
            .leftJoinAndSelect('FavouriteWords.word', 'word')
            .leftJoinAndSelect('FavouriteWords.created_by_user', 'created_by_user')
            .leftJoinAndSelect('FavouriteWords.updated_by_user', 'updated_by_user')
            .skip(skip)
            .take(limit)
            .orderBy('word.english_word', 'ASC')
            .where('FavouriteWords.deleted_at IS NULL');

        // Apply status filter if provided
        if (filters?.student_id) {
            queryBuilder.andWhere('FavouriteWords.student_id = :student_id', {
                student_id: filters.student_id,
            });
        }
        if (filters?.word_id) {
            queryBuilder.andWhere('FavouriteWords.word_id = :word_id', {
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
        return this.FavouriteWordsRepository.findOne({
            where: { id },
            relations: ['word', 'student', 'created_by_user', 'updated_by_user'],
            withDeleted: false,
        });
    }

    update(id: string, updateFavouriteWordsDto: UpdateFavouriteWordsDto) {
        return this.FavouriteWordsRepository.update(id, updateFavouriteWordsDto);
    }

    remove(id: string) {
        return this.FavouriteWordsRepository.softDelete(id);
    }

    // Method to permanently delete a FavouriteWords (for admin purposes)
    permanentRemove(id: string) {
        return this.FavouriteWordsRepository.delete(id);
    }

    // Method to restore a soft-deleted FavouriteWords
    restore(id: string) {
        return this.FavouriteWordsRepository.restore(id);
    }


}


