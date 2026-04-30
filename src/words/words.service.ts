/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-base-to-string */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';
import { Words } from './entities/words.entity';
import { CreateWordsDto } from './dto/create-words.dto';
import { FilterWordsDto } from './dto/filter-words.dto';
import { UpdateWordsDto } from './dto/update-words.dto';
import { WordStatusEnum } from 'src/common/enums/word-status.enum';
import { Classes } from 'src/classes/entities/classes.entity';
import { WordUploadTemplateDto } from './dto/word-upload-template.dto';
import * as XLSX from 'xlsx';
import { UploadedWordFile } from './dto/UploadedWordFile.type';
import { WordDetails } from './entities/word-details.entity';
import { WordView } from './entities/word-view.entity';


@Injectable()
export class WordsService {
    constructor(
        @InjectRepository(Words)
        private WordsRepository: Repository<Words>,
        @InjectRepository(Classes)
        private ClassesRepository: Repository<Classes>,
        @InjectRepository(WordDetails)
        private WordDetailsRepository: Repository<WordDetails>,
        @InjectRepository(WordView)
        private WordViewRepository: Repository<WordView>,
    ) { }

    async create(createWordsDto: CreateWordsDto) {
        await this.ensureEnglishWordIsUnique(createWordsDto.english_word);

        const { class_ids, ...wordData } = createWordsDto;
        const word = this.WordsRepository.create(wordData);
        const savedWord = await this.WordsRepository.save(word);

        if (class_ids?.length) {
            const wordDetails = this.buildWordDetails(
                savedWord.id,
                class_ids,
                createWordsDto.created_by,
            );
            await this.WordDetailsRepository.save(wordDetails);
        }

        return this.findOne(savedWord.id);
    }

    async uploadWords(file: UploadedWordFile, createdBy: string) {
        if (!file?.buffer?.length) {
            throw new BadRequestException('Excel file is required');
        }

        const workbook = XLSX.read(file.buffer, { type: 'buffer' });
        const firstSheetName = workbook.SheetNames[0];

        if (!firstSheetName) {
            throw new BadRequestException('Uploaded Excel file does not contain any sheet');
        }

        const worksheet = workbook.Sheets[firstSheetName];
        const rows = XLSX.utils.sheet_to_json<WordUploadTemplateDto>(worksheet, {
            defval: '',
            raw: false,
        });

        if (!rows.length) {
            throw new BadRequestException('Uploaded Excel file does not contain any data row');
        }

        const expectedHeaders: (keyof WordUploadTemplateDto)[] = [
            'english_word',
            'bangla_word',
            'part_of_speech',
            'description',
            'class',
            'english_meaning',
        ];

        const worksheetHeaders = this.getWorksheetHeaders(worksheet);
        const missingHeaders = expectedHeaders.filter((header) => !worksheetHeaders.includes(header));

        if (missingHeaders.length) {
            throw new BadRequestException(
                `Missing required Excel columns: ${missingHeaders.join(', ')}`,
            );
        }

        const trimmedRows = rows.map((row) => ({
            english_word: String(row.english_word ?? '').trim(),
            bangla_word: String(row.bangla_word ?? '').trim(),
            part_of_speech: String(row.part_of_speech ?? '').trim(),
            description: String(row.description ?? '').trim(),
            class: String(row.class ?? '').trim(),
            english_meaning: String(row.english_meaning ?? '').trim(),
            classNames: this.parseClassNames(row.class),
        }));

        const validationErrors: string[] = [];

        trimmedRows.forEach((row, index) => {
            const rowNumber = index + 2;

            if (!row.english_word) {
                validationErrors.push(`Row ${rowNumber}: english_word is required`);
            }
        });

        if (validationErrors.length) {
            throw new BadRequestException(validationErrors);
        }

        const englishWords = [...new Set(trimmedRows.map((row) => row.english_word.toLowerCase()))];
        const existingWords = englishWords.length
            ? await this.WordsRepository
                .createQueryBuilder('words')
                .where('LOWER(words.english_word) IN (:...englishWords)', { englishWords })
                .withDeleted()
                .getMany()
            : [];
        const existingWordMap = new Map(existingWords.map((word) => [word.english_word.toLowerCase(), word]));
        const skippedExistingWords = trimmedRows.flatMap((row, index) => (
            existingWordMap.has(row.english_word.toLowerCase())
                ? [{
                    row: index + 2,
                    english_word: row.english_word,
                }]
                : []
        ));
        const rowsToUpload = trimmedRows.filter(
            (row) => !existingWordMap.has(row.english_word.toLowerCase()),
        );
        const seenEnglishWords = new Set<string>();
        const classNames = new Set<string>();

        rowsToUpload.forEach((row) => {
            const rowNumber = trimmedRows.indexOf(row) + 2;

            if (!row.bangla_word) {
                validationErrors.push(`Row ${rowNumber}: bangla_word is required`);
            }

            if (!row.english_meaning) {
                validationErrors.push(`Row ${rowNumber}: english_meaning is required`);
            }

            if (!row.class) {
                validationErrors.push(`Row ${rowNumber}: class is required`);
            }

            if (row.class && !row.classNames.length) {
                validationErrors.push(`Row ${rowNumber}: class must contain at least one valid class name`);
            }

            const normalizedEnglishWord = row.english_word.toLowerCase();
            if (normalizedEnglishWord) {
                if (seenEnglishWords.has(normalizedEnglishWord)) {
                    validationErrors.push(`Row ${rowNumber}: duplicate english_word "${row.english_word}" found in file`);
                }
                seenEnglishWords.add(normalizedEnglishWord);
            }

            if (row.classNames.length) {
                row.classNames.forEach((className) => {
                    classNames.add(className.toLowerCase());
                });
            }
        });

        if (validationErrors.length) {
            throw new BadRequestException(validationErrors);
        }

        const classes = classNames.size
            ? await this.ClassesRepository
                .createQueryBuilder('classes')
                .where('LOWER(classes.name) IN (:...names)', { names: [...classNames] })
                .andWhere('classes.deleted_at IS NULL')
                .getMany()
            : [];

        const classMap = new Map(classes.map((item) => [item.name.toLowerCase(), item]));

        rowsToUpload.forEach((row) => {
            const rowNumber = trimmedRows.indexOf(row) + 2;
            const missingClassNames = row.classNames.filter(
                (className) => !classMap.has(className.toLowerCase()),
            );

            if (missingClassNames.length) {
                validationErrors.push(
                    `Row ${rowNumber}: class "${missingClassNames.join(', ')}" was not found`,
                );
            }
        });

        if (validationErrors.length) {
            throw new BadRequestException(validationErrors);
        }

        const wordsToCreate = rowsToUpload.map((row) => {
            const wordPayload: Partial<Words> = {
                english_word: row.english_word,
                bangla_word: row.bangla_word,
                part_of_speech: row.part_of_speech || undefined,
                description: row.description || undefined,
                english_meaning: row.english_meaning,
                status: WordStatusEnum.APPROVED,
                created_by: createdBy,
            };

            return this.WordsRepository.create(wordPayload);
        });

        const savedWords = await this.WordsRepository.save(wordsToCreate);
        const wordDetailsToCreate = savedWords.flatMap((word, index) => {
            const row = rowsToUpload[index];
            const uniqueClassNames = [...new Set(row.classNames.map((className) => className.toLowerCase()))];

            return uniqueClassNames.map((className) => this.WordDetailsRepository.create({
                word_id: word.id,
                class_id: classMap.get(className)!.id,
                created_by: createdBy,
            }));
        });

        if (wordDetailsToCreate.length) {
            await this.WordDetailsRepository.save(wordDetailsToCreate);
        }

        const uploadedWords = savedWords.length
            ? await this.WordsRepository.find({
                where: savedWords.map((word) => ({ id: word.id })),
                relations: ['word_details', 'word_details.class'],
                order: { english_word: 'ASC' },
            })
            : [];

        return {
            total_uploaded: uploadedWords.length,
            total_skipped_existing: skippedExistingWords.length,
            skipped_existing_words: skippedExistingWords,
            words: uploadedWords,
        };
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
            .leftJoinAndSelect('words.word_details', 'word_details', 'word_details.deleted_at IS NULL')
            .leftJoinAndSelect('word_details.class', 'classes')
            .skip(skip)
            .take(limit);

        if (filters?.is_most_viewed) {
            queryBuilder
                .orderBy('words.view_count', 'DESC')
                .addOrderBy('words.english_word', 'ASC');
        } else {
            queryBuilder
                .orderBy('words.english_word', 'ASC');
        }

        queryBuilder
            .where('words.deleted_at IS NULL')
            .distinct(true);


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
            queryBuilder.andWhere('word_details.class_id = :class_id', {
                class_id: filters.class_id,
            });
        }
        if (filters?.class_name) {
            queryBuilder.andWhere('classes.name ILIKE :class_name', {
                class_name: `%${filters.class_name}%`,
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

    async findOne(id: string, viewerUserId?: string) {
        const word = await this.WordsRepository.findOne({
            where: { id },
            relations: ['approved_by_user', 'created_by_user', 'updated_by_user', 'word_details', 'word_details.class'],
            withDeleted: false, // Only get non-deleted Wordss
        });

        if (word && viewerUserId) {
            const existingView = await this.WordViewRepository.findOne({
                where: {
                    user_id: viewerUserId,
                    word_id: word.id,
                },
            });

            if (!existingView) {
                await this.WordViewRepository.save(
                    this.WordViewRepository.create({
                        user_id: viewerUserId,
                        word_id: word.id,
                    }),
                );

                await this.WordsRepository.increment(
                    { id: word.id },
                    'view_count',
                    1,
                );

                word.view_count = (word.view_count ?? 0) + 1;
            }
        }

        return word;
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
        return this.updateWordWithDetails(id, updateWordsDto);
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
    async permanentRemove(id: string) {
        await this.WordViewRepository.delete({ word_id: id });
        await this.WordDetailsRepository.delete({ word_id: id });
        return this.WordsRepository.delete(id);
    }

    // Method to restore a soft-deleted Words
    restore(id: string) {
        return this.WordsRepository.restore(id);
    }

    private async updateWordWithDetails(id: string, updateWordsDto: UpdateWordsDto) {
        await this.ensureEnglishWordIsUnique(updateWordsDto.english_word, id);

        const { class_ids, ...wordData } = updateWordsDto;
        await this.WordsRepository.update(id, wordData);

        if (class_ids !== undefined) {
            await this.WordDetailsRepository.softDelete({ word_id: id });
            await this.WordDetailsRepository.save(
                this.buildWordDetails(
                    id,
                    class_ids,
                    updateWordsDto.updated_by,
                    updateWordsDto.updated_by,
                ),
            );
        }

        return this.findOne(id);
    }

    private async ensureEnglishWordIsUnique(englishWord: string, excludeWordId?: string) {
        const normalizedEnglishWord = englishWord.trim().toLowerCase();

        const existingWord = await this.WordsRepository
            .createQueryBuilder('words')
            .withDeleted()
            .where('LOWER(words.english_word) = :englishWord', { englishWord: normalizedEnglishWord })
            .getOne();

        if (existingWord && existingWord.id !== excludeWordId) {
            throw new BadRequestException(`english_word "${englishWord}" already exists`);
        }
    }

    private buildWordDetails(
        wordId: string,
        classIds: string[],
        createdBy?: string,
        updatedBy?: string,
    ): WordDetails[] {
        const uniqueClassIds = [...new Set(classIds)];

        return uniqueClassIds.map((class_id) => this.WordDetailsRepository.create({
            word_id: wordId,
            class_id,
            created_by: createdBy,
            updated_by: updatedBy,
        }));
    }

    private getWorksheetHeaders(worksheet: XLSX.WorkSheet): string[] {
        const range = XLSX.utils.decode_range(worksheet['!ref'] ?? 'A1:A1');
        const headers: string[] = [];

        for (let col = range.s.c; col <= range.e.c; col++) {
            const cellAddress = XLSX.utils.encode_cell({ r: range.s.r, c: col });
            const cell = worksheet[cellAddress];
            headers.push(String(cell?.v ?? '').trim());
        }

        return headers;
    }

    private parseClassNames(value: unknown): string[] {
        return String(value ?? '')
            .split(',')
            .map((className) => className.trim())
            .filter(Boolean);
    }


}
