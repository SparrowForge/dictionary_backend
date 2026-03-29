import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCatagoryDto } from './dto/create-catagory.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { FilterCatagoryDto } from './dto/filter-catagory.dto';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';
import { UpdateCatagoryDto } from './dto/update-catagory.dto';
import { Catagory } from './entities/catagory.entity';

@Injectable()
export class CatagoryService {
    constructor(
        @InjectRepository(Catagory)
        private CatagoryRepository: Repository<Catagory>,
    ) { }

    async create(createCatagoryDto: CreateCatagoryDto) {
        await this.ensureCatagoryNameIsUnique(createCatagoryDto.name);

        const Catagory = this.CatagoryRepository.create(createCatagoryDto);
        return this.CatagoryRepository.save(Catagory);
    }

    async findAll(
        paginationDto: PaginationDto,
        filters?: Partial<FilterCatagoryDto>,
    ): Promise<PaginatedResponseDto<Catagory>> {
        const { page = 1, limit = 1000000000000 } = paginationDto;
        const skip = (page - 1) * limit;

        const queryBuilder = this.CatagoryRepository
            .createQueryBuilder('Catagory')
            .leftJoinAndSelect('Catagory.created_by_user', 'created_by_user')
            .leftJoinAndSelect('Catagory.updated_by_user', 'updated_by_user')
            .skip(skip)
            .take(limit)
            .orderBy('Catagory.name', 'ASC')
            .where('Catagory.deleted_at IS NULL');

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
        return this.CatagoryRepository.findOne({
            where: { id },
            relations: ['created_by_user', 'updated_by_user'],
            withDeleted: false, // Only get non-deleted Catagorys
        });
    }

    findByEmailOrCatagoryName(email: string) {
        return this.CatagoryRepository
            .createQueryBuilder('Catagory')
            .addSelect('Catagory.password')
            .where('Catagory.email = :email', { email })
            // .andWhere('Catagory.deletedAt IS NULL') // Only get non-deleted Catagorys
            .getOne();
    }

    async update(id: string, updateCatagoryDto: UpdateCatagoryDto) {
        await this.ensureCatagoryNameIsUnique(updateCatagoryDto.name, id);
        return this.CatagoryRepository.update(id, updateCatagoryDto);
    }

    remove(id: string) {
        return this.CatagoryRepository.softDelete(id);
    }

    // Method to permanently delete a Catagory (for admin purposes)
    permanentRemove(id: string) {
        return this.CatagoryRepository.delete(id);
    }

    // Method to restore a soft-deleted Catagory
    restore(id: string) {
        return this.CatagoryRepository.restore(id);
    }

    private async ensureCatagoryNameIsUnique(name: string, excludeCatagoryId?: string) {
        const normalizedName = name.trim().toLowerCase();

        const existingCatagory = await this.CatagoryRepository
            .createQueryBuilder('catagory')
            .withDeleted()
            .where('LOWER(catagory.name) = :name', { name: normalizedName })
            .getOne();

        if (existingCatagory && existingCatagory.id !== excludeCatagoryId) {
            throw new BadRequestException(`Catagory name "${name}" already exists`);
        }
    }


}


