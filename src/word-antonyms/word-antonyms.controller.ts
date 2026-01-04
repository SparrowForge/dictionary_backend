import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BaseResponseDto } from 'src/common/dto/base-response.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type AuthUser from 'src/auth/dto/auth-user';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesEnum } from 'src/common/enums/role.enum';
import { WordAntonyms } from './entities/word-antonyms.entity';
import { CreateWordAntonymsDto } from './dto/create-word-antonyms.dto';
import { WordAntonymsService } from './word-antonyms.service';
import { FilterWordAntonymsDto } from './dto/filter-word-antonyms.dto';
import { UpdateWordAntonymsDto } from './dto/update-word-antonyms.dto';

@ApiTags('WordAntonyms')
@ApiBearerAuth()
@Roles(RolesEnum.ADMIN)
@Controller('api/v1/word-antonyms')
export class WordAntonymsController {
    constructor(private readonly WordAntonymsService: WordAntonymsService) { }

    @Post()
    @ApiOperation({
        summary: 'Create a new WordAntonyms', description: 'Creates a new WordAntonyms with the provided information. Password will be hashed before saving. Requires authentication.',
    })
    @ApiResponse({ status: 201, description: 'WordAntonyms created successfully', type: BaseResponseDto<WordAntonyms>, })
    @ApiResponse({ status: 400, description: 'Bad request - validation error', })
    @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required', })
    async create(@CurrentUser() user: AuthUser, @Body() createWordAntonymsDto: CreateWordAntonymsDto) {
        createWordAntonymsDto.created_by = user.userId;
        const entity = await this.WordAntonymsService.create(createWordAntonymsDto);
        return new BaseResponseDto(entity, 'WordAntonyms created successfully');
    }

    @Get()
    @ApiOperation({ summary: 'Get all WordAntonyms with pagination and filters', description: 'Retrieves a paginated list of all active WordAntonyms with optional filtering by role, department, and search terms. Requires authentication.', })
    @ApiResponse({
        status: 200, description: 'Returns paginated list of WordAntonyms', type: BaseResponseDto<PaginatedResponseDto<WordAntonyms>>,
        schema: {
            example: {
                success: true,
                message: 'WordAntonyms retrieved successfully',
                data: {
                    items: [] as WordAntonyms[],
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
    async findAll(@Query() filters: FilterWordAntonymsDto) {
        const { page, limit, ...WordAntonymsFilters } = filters;
        const pagination = { page, limit };
        const WordAntonyms = await this.WordAntonymsService.findAll(pagination, WordAntonymsFilters);
        return new BaseResponseDto(WordAntonyms, 'WordAntonyms retrieved successfully');
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a WordAntonyms by id', description: 'Retrieves a specific WordAntonyms by their ID. Only returns active WordAntonyms (soft-deleted WordAntonyms are excluded). Requires authentication.', })
    @ApiParam({ name: 'id', description: 'WordAntonyms ID (uuid)', example: '45e16f14-b27f-4d20-99df-c1d5535ff9e3', type: 'string', })
    @ApiResponse({ status: 200, description: 'WordAntonyms retrieved successfully', type: BaseResponseDto<WordAntonyms>, })
    @ApiResponse({ status: 404, description: 'WordAntonyms not found', })
    @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required', })
    async findOne(@Param('id') id: string) {
        const WordAntonyms = await this.WordAntonymsService.findOne(id);
        return new BaseResponseDto(WordAntonyms, 'WordAntonyms retrieved successfully');
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a WordAntonyms by id', description: 'Updates an existing WordAntonyms with the provided information. Only active WordAntonyms can be updated. Requires authentication.', })
    @ApiParam({ name: 'id', description: 'WordAntonyms ID (uuid)', example: '45e16f14-b27f-4d20-99df-c1d5535ff9e3', type: 'number', })
    @ApiResponse({ status: 200, description: 'WordAntonyms updated successfully', type: BaseResponseDto<WordAntonyms>, })
    @ApiResponse({ status: 404, description: 'WordAntonyms not found', })
    @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required', })
    async update(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body() updateWordAntonymsDto: UpdateWordAntonymsDto,) {
        updateWordAntonymsDto.updated_by = user.userId;
        const WordAntonyms = await this.WordAntonymsService.update(id, updateWordAntonymsDto);
        return new BaseResponseDto(WordAntonyms, 'WordAntonyms updated successfully');
    }

    @Delete(':id')
    @ApiOperation({
        summary: 'Soft delete a WordAntonyms by id',
        description: 'Soft deletes a WordAntonyms by setting the deletedAt timestamp. The WordAntonyms will not appear in regular queries but can be restored. Requires authentication.',
    })
    @ApiParam({ name: 'id', description: 'WordAntonyms ID (uuid)', example: 1, type: 'number', })
    @ApiResponse({ status: 200, description: 'WordAntonyms soft deleted successfully', type: BaseResponseDto<null>, })
    @ApiResponse({ status: 404, description: 'WordAntonyms not found', })
    @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required', })
    async remove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
        await this.WordAntonymsService.remove(id);
        return new BaseResponseDto(null, 'WordAntonyms soft deleted successfully');
    }

    @Delete(':id/permanent')
    @ApiOperation({ summary: 'Permanently delete a WordAntonyms by id', description: 'Permanently deletes a WordAntonyms from the database. This action cannot be undone. Requires authentication.', })
    @ApiParam({ name: 'id', description: 'WordAntonyms ID (uuid)', example: 1, type: 'number', })
    @ApiResponse({ status: 200, description: 'WordAntonyms permanently deleted successfully', type: BaseResponseDto<null>, })
    @ApiResponse({ status: 404, description: 'WordAntonyms not found', })
    @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required', })
    async permanentRemove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
        await this.WordAntonymsService.permanentRemove(id);
        return new BaseResponseDto(null, 'WordAntonyms permanently deleted successfully');
    }

    @Post(':id/restore')
    @ApiOperation({ summary: 'Restore a soft-deleted WordAntonyms', description: 'Restores a soft-deleted WordAntonyms.', })
    @ApiParam({ name: 'id', description: 'WordAntonyms ID (uuid)', example: 1, type: 'number', })
    @ApiResponse({ status: 200, description: 'WordAntonyms restored successfully', type: BaseResponseDto<null>, })
    @ApiResponse({ status: 404, description: 'WordAntonyms not found', })
    @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required', })
    async restore(@CurrentUser() user: AuthUser, @Param('id') id: string) {
        await this.WordAntonymsService.restore(id);
        return new BaseResponseDto(null, 'WordAntonyms restored successfully');
    }
}


