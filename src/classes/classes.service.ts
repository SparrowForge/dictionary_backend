import { BadRequestException, Injectable } from '@nestjs/common';
import { Classes } from './entities/classes.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateClassesDto } from './dto/create-classes.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { FilterClassesDto } from './dto/filter-classes.dto';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';
import { UpdateClassesDto } from './dto/update-classes.dto';

@Injectable()
export class ClassesService {
    constructor(
        @InjectRepository(Classes)
        private ClassesRepository: Repository<Classes>,
    ) { }

    async create(createClassesDto: CreateClassesDto) {
        await this.ensureClassesNameIsUnique(createClassesDto.name);

        const Classes = this.ClassesRepository.create(createClassesDto);
        return this.ClassesRepository.save(Classes);
    }

    async findAll(
        paginationDto: PaginationDto,
        filters?: Partial<FilterClassesDto>,
    ): Promise<PaginatedResponseDto<Classes>> {
        const { page = 1, limit = 1000000000000 } = paginationDto;
        const skip = (page - 1) * limit;

        const queryBuilder = this.ClassesRepository
            .createQueryBuilder('Classes')
            .leftJoinAndSelect('Classes.created_by_user', 'created_by_user')
            .leftJoinAndSelect('Classes.updated_by_user', 'updated_by_user')
            .leftJoinAndSelect('Classes.catagory', 'catagory')
            .skip(skip)
            .take(limit)
            .orderBy('Classes.name', 'ASC')
            .where('Classes.deleted_at IS NULL');

        // Apply status filter if provided
        if (filters?.name) {
            queryBuilder.andWhere('user.name = :name', {
                name: filters.name,
            });
        }

        if (filters?.status) {
            queryBuilder.andWhere('user.status = :status', {
                status: filters.status,
            });
        }
        if (filters?.catagory_id) {
            queryBuilder.andWhere('Classes.catagory_id = :catagory_id', {
                catagory_id: filters.catagory_id,
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
            relations: ['created_by_user', 'updated_by_user', 'catagory'],
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

    async update(id: string, updateClassesDto: UpdateClassesDto) {
        await this.ensureClassesNameIsUnique(updateClassesDto.name, id);
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

    private async ensureClassesNameIsUnique(name: string, excludeClassesId?: string) {
        const normalizedName = name.trim().toLowerCase();

        const existingClasses = await this.ClassesRepository
            .createQueryBuilder('classes')
            .withDeleted()
            .where('LOWER(classes.name) = :name', { name: normalizedName })
            .getOne();

        if (existingClasses && existingClasses.id !== excludeClassesId) {
            throw new BadRequestException(`Class name "${name}" already exists`);
        }
    }


}


