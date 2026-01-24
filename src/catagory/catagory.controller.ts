import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CatagoryService } from './catagory.service';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BaseResponseDto } from 'src/common/dto/base-response.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type AuthUser from 'src/auth/dto/auth-user';
import { Catagory } from './entities/catagory.entity';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesEnum } from 'src/common/enums/role.enum';
import { CreateCatagoryDto } from './dto/create-catagory.dto';
import { FilterCatagoryDto } from './dto/filter-catagory.dto';
import { UpdateCatagoryDto } from './dto/update-catagory.dto';

@ApiTags('Catagory')
@ApiBearerAuth()
@Roles(RolesEnum.ADMIN)
@Controller('api/v1/catagory')
export class CatagoryController {
    constructor(private readonly catagoryService: CatagoryService) { }

    @Post()
    @ApiOperation({
        summary: 'Create a new catagory', description: 'Creates a new catagory with the provided information. Password will be hashed before saving. Requires authentication.',
    })
    @ApiResponse({ status: 201, description: 'Catagory created successfully', type: BaseResponseDto<Catagory>, })
    @ApiResponse({ status: 400, description: 'Bad request - validation error', })
    @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required', })
    async create(@CurrentUser() user: AuthUser, @Body() createCatagoryDto: CreateCatagoryDto) {
        createCatagoryDto.created_by = user.userId;
        const catagory = await this.catagoryService.create(createCatagoryDto);
        return new BaseResponseDto(catagory, 'Catagory created successfully');
    }

    @Get()
    @ApiOperation({ summary: 'Get all catagory with pagination and filters', description: 'Retrieves a paginated list of all active catagory with optional filtering by role, department, and search terms. Requires authentication.', })
    @ApiResponse({
        status: 200, description: 'Returns paginated list of catagory', type: BaseResponseDto<PaginatedResponseDto<Catagory>>,
        schema: {
            example: {
                success: true,
                message: 'Catagory retrieved successfully',
                data: {
                    items: [] as Catagory[],
                    meta: {
                        total: 1,
                        page: 1,
                        limit: 10,
                        totalPages: 1,
                        hasNextPage: false,
                        hasPreviousPage: false,
                    },
                },
                timestamp: '2024-03-14T12:00:00.000Z',
            },
        },
    })
    @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required', })
    async findAll(@Query() filters: FilterCatagoryDto) {
        const { page, limit, ...catagoryFilters } = filters;
        const pagination = { page, limit };
        const catagory = await this.catagoryService.findAll(pagination, catagoryFilters);
        return new BaseResponseDto(catagory, 'Catagory retrieved successfully');
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a catagory by id', description: 'Retrieves a specific catagory by their ID. Only returns active catagory (soft-deleted catagory are excluded). Requires authentication.', })
    @ApiParam({ name: 'id', description: 'Catagory ID (uuid)', example: '45e16f14-b27f-4d20-99df-c1d5535ff9e3', type: 'string', })
    @ApiResponse({ status: 200, description: 'Catagory retrieved successfully', type: BaseResponseDto<Catagory>, })
    @ApiResponse({ status: 404, description: 'Catagory not found', })
    @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required', })
    async findOne(@Param('id') id: string) {
        const catagory = await this.catagoryService.findOne(id);
        return new BaseResponseDto(catagory, 'Catagory retrieved successfully');
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a catagory by id', description: 'Updates an existing catagory with the provided information. Only active catagory can be updated. Requires authentication.', })
    @ApiParam({ name: 'id', description: 'Catagory ID (uuid)', example: '45e16f14-b27f-4d20-99df-c1d5535ff9e3', type: 'number', })
    @ApiResponse({ status: 200, description: 'Catagory updated successfully', type: BaseResponseDto<Catagory>, })
    @ApiResponse({ status: 404, description: 'Catagory not found', })
    @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required', })
    async update(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body() updateCatagoryDto: UpdateCatagoryDto,) {
        updateCatagoryDto.updated_by = user.userId;
        const catagory = await this.catagoryService.update(id, updateCatagoryDto);
        return new BaseResponseDto(catagory, 'Catagory updated successfully');
    }

    @Delete(':id')
    @ApiOperation({
        summary: 'Soft delete a catagory by id',
        description: 'Soft deletes a catagory by setting the deletedAt timestamp. The catagory will not appear in regular queries but can be restored. Requires authentication.',
    })
    @ApiParam({ name: 'id', description: 'Catagory ID (uuid)', example: 1, type: 'number', })
    @ApiResponse({ status: 200, description: 'Catagory soft deleted successfully', type: BaseResponseDto<null>, })
    @ApiResponse({ status: 404, description: 'Catagory not found', })
    @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required', })
    async remove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
        await this.catagoryService.remove(id);
        return new BaseResponseDto(null, 'Catagory soft deleted successfully');
    }

    @Delete(':id/permanent')
    @ApiOperation({ summary: 'Permanently delete a catagory by id', description: 'Permanently deletes a catagory from the database. This action cannot be undone. Requires authentication.', })
    @ApiParam({ name: 'id', description: 'Catagory ID (uuid)', example: 1, type: 'number', })
    @ApiResponse({ status: 200, description: 'Catagory permanently deleted successfully', type: BaseResponseDto<null>, })
    @ApiResponse({ status: 404, description: 'Catagory not found', })
    @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required', })
    async permanentRemove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
        await this.catagoryService.permanentRemove(id);
        return new BaseResponseDto(null, 'Catagory permanently deleted successfully');
    }

    @Post(':id/restore')
    @ApiOperation({ summary: 'Restore a soft-deleted catagory', description: 'Restores a soft-deleted catagory.', })
    @ApiParam({ name: 'id', description: 'Catagory ID (uuid)', example: 1, type: 'number', })
    @ApiResponse({ status: 200, description: 'Catagory restored successfully', type: BaseResponseDto<null>, })
    @ApiResponse({ status: 404, description: 'Catagory not found', })
    @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required', })
    async restore(@CurrentUser() user: AuthUser, @Param('id') id: string) {
        await this.catagoryService.restore(id);
        return new BaseResponseDto(null, 'Catagory restored successfully');
    }
}


