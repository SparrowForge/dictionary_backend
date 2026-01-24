import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';
import { Words } from './entities/words.entity';
import { CreateWordsDto } from './dto/create-words.dto';
import { FilterWordsDto } from './dto/filter-words.dto';
import { UpdateWordsDto } from './dto/update-words.dto';
import { WordStatusEnum } from 'src/common/enums/word-status.enum';

@Injectable()
export class WordsService {
    constructor(
        @InjectRepository(Words)
        private WordsRepository: Repository<Words>,
    ) { }

    async create(createWordsDto: CreateWordsDto) {

        const Words = this.WordsRepository.create(createWordsDto);
        return this.WordsRepository.save(Words);
    }

    async findAll(
        paginationDto: PaginationDto,
        filters?: Partial<FilterWordsDto>,
    ): Promise<PaginatedResponseDto<Words>> {
        const { page = 1, limit = 1000000000000 } = paginationDto;
        const skip = (page - 1) * limit;

        const queryBuilder = this.WordsRepository
            .createQueryBuilder('words')
            .leftJoinAndSelect('words.approved_by_user', 'user')
            .leftJoinAndSelect('words.created_by_user', 'created_by_user')
            .leftJoinAndSelect('words.updated_by_user', 'updated_by_user')
            .leftJoinAndSelect('words.classes', 'classes')
            .skip(skip)
            .take(limit)
            .orderBy('user.name', 'ASC')
            .where('words.deleted_at IS NULL');

        // Apply status filter if provided
        if (filters?.english_word) {
            queryBuilder.andWhere('words.english_word ILIKE :english_word', {
                english_word: `%${filters.english_word}%`,
            });
        }
        if (filters?.bangla_word) {
            queryBuilder.andWhere('words.bangla_word ILIKE :bangla_word', {
                bangla_word: `%${filters.bangla_word}%`,
            });
        }
        if (filters?.part_of_speech) {
            queryBuilder.andWhere('words.part_of_speech ILIKE :part_of_speech', {
                part_of_speech: `%${filters.part_of_speech}%`,
            });
        }
        if (filters?.description) {
            queryBuilder.andWhere('words.description ILIKE :description', {
                description: `%${filters.description}%`,
            });
        }
        if (filters?.status) {
            queryBuilder.andWhere('words.status = :status', {
                status: filters.status,
            });
        }
        if (filters?.approved_by_user_id) {
            queryBuilder.andWhere('words.approved_by_user_id = :approved_by_user_id', {
                approved_by_user_id: filters.approved_by_user_id,
            });
        }
        if (filters?.class_id) {
            queryBuilder.andWhere('words.class_id = :class_id', {
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
        return this.WordsRepository.findOne({
            where: { id },
            relations: ['approved_by_user', 'created_by_user', 'updated_by_user', 'classes'],
            withDeleted: false, // Only get non-deleted Wordss
        });
    }

    findByEmailOrWordsName(email: string) {
        return this.WordsRepository
            .createQueryBuilder('Words')
            .addSelect('Words.password')
            .where('Words.email = :email', { email })
            // .andWhere('Words.deletedAt IS NULL') // Only get non-deleted Wordss
            .getOne();
    }

    update(id: string, updateWordsDto: UpdateWordsDto) {
        return this.WordsRepository.update(id, updateWordsDto);
    }

    updateApprovalStatus(id: string, status: WordStatusEnum, approved_by_user_id: string,) {
        return this.WordsRepository.update(id, {
            status,
            approved_by_user_id,
            approved_at: new Date(),
        });
    }


    remove(id: string) {
        return this.WordsRepository.softDelete(id);
    }

    // Method to permanently delete a Words (for admin purposes)
    permanentRemove(id: string) {
        return this.WordsRepository.delete(id);
    }

    // Method to restore a soft-deleted Words
    restore(id: string) {
        return this.WordsRepository.restore(id);
    }


}


