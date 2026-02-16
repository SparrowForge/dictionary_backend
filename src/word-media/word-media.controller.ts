import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BaseResponseDto } from 'src/common/dto/base-response.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type AuthUser from 'src/auth/dto/auth-user';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesEnum } from 'src/common/enums/role.enum';
import { WordMedia } from './entities/word-media.entity';
import { CreateWordMediaDto } from './dto/create-word-media.dto';
import { WordMediaService } from './word-media.service';
import { FilterWordMediaDto } from './dto/filter-word-media.dto';
import { UpdateWordMediaDto } from './dto/update-word-media.dto';

@ApiTags('Word Media')
@ApiBearerAuth()
@Roles(RolesEnum.ADMIN, RolesEnum.TEACHER)
@Controller('api/v1/word-media')
export class WordMediaController {
    constructor(private readonly WordMediaService: WordMediaService) { }

    @Post()
    @ApiOperation({
        summary: 'Create a new WordMedia', description: 'Creates a new WordMedia with the provided information. Password will be hashed before saving. Requires authentication.',
    })
    @ApiResponse({ status: 201, description: 'WordMedia created successfully', type: BaseResponseDto<WordMedia>, })
    @ApiResponse({ status: 400, description: 'Bad request - validation error', })
    @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required', })
    async create(@CurrentUser() user: AuthUser, @Body() createWordMediaDto: CreateWordMediaDto) {
        createWordMediaDto.created_by = user.userId;
        const entity = await this.WordMediaService.create(createWordMediaDto);
        return new BaseResponseDto(entity, 'WordMedia created successfully');
    }

    @Get()
    @Roles(RolesEnum.ADMIN, RolesEnum.TEACHER, RolesEnum.STUDENT)
    @ApiOperation({ summary: 'Get all WordMedia with pagination and filters', description: 'Retrieves a paginated list of all active WordMedia with optional filtering by role, department, and search terms. Requires authentication.', })
    @ApiResponse({
        status: 200, description: 'Returns paginated list of WordMedia', type: BaseResponseDto<PaginatedResponseDto<WordMedia>>,
        schema: {
            example: {
                success: true,
                message: 'WordMedia retrieved successfully',
                data: {
                    items: [] as WordMedia[],
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
    async findAll(@Query() filters: FilterWordMediaDto) {
        const { page, limit, ...WordMediaFilters } = filters;
        const pagination = { page, limit };
        const WordMedia = await this.WordMediaService.findAll(pagination, WordMediaFilters);
        return new BaseResponseDto(WordMedia, 'WordMedia retrieved successfully');
    }

    @Get(':id')
    @Roles(RolesEnum.ADMIN, RolesEnum.TEACHER, RolesEnum.STUDENT)
    @ApiOperation({ summary: 'Get a WordMedia by id', description: 'Retrieves a specific WordMedia by their ID. Only returns active WordMedia (soft-deleted WordMedia are excluded). Requires authentication.', })
    @ApiParam({ name: 'id', description: 'WordMedia ID (uuid)', example: '45e16f14-b27f-4d20-99df-c1d5535ff9e3', type: 'string', })
    @ApiResponse({ status: 200, description: 'WordMedia retrieved successfully', type: BaseResponseDto<WordMedia>, })
    @ApiResponse({ status: 404, description: 'WordMedia not found', })
    @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required', })
    async findOne(@Param('id') id: string) {
        const WordMedia = await this.WordMediaService.findOne(id);
        return new BaseResponseDto(WordMedia, 'WordMedia retrieved successfully');
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a WordMedia by id', description: 'Updates an existing WordMedia with the provided information. Only active WordMedia can be updated. Requires authentication.', })
    @ApiParam({ name: 'id', description: 'WordMedia ID (uuid)', example: '45e16f14-b27f-4d20-99df-c1d5535ff9e3', type: 'number', })
    @ApiResponse({ status: 200, description: 'WordMedia updated successfully', type: BaseResponseDto<WordMedia>, })
    @ApiResponse({ status: 404, description: 'WordMedia not found', })
    @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required', })
    async update(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body() updateWordMediaDto: UpdateWordMediaDto,) {
        updateWordMediaDto.updated_by = user.userId;
        const WordMedia = await this.WordMediaService.update(id, updateWordMediaDto);
        return new BaseResponseDto(WordMedia, 'WordMedia updated successfully');
    }

    @Delete(':id')
    @ApiOperation({
        summary: 'Soft delete a WordMedia by id',
        description: 'Soft deletes a WordMedia by setting the deletedAt timestamp. The WordMedia will not appear in regular queries but can be restored. Requires authentication.',
    })
    @ApiParam({ name: 'id', description: 'WordMedia ID (uuid)', example: 1, type: 'number', })
    @ApiResponse({ status: 200, description: 'WordMedia soft deleted successfully', type: BaseResponseDto<null>, })
    @ApiResponse({ status: 404, description: 'WordMedia not found', })
    @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required', })
    async remove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
        await this.WordMediaService.remove(id);
        return new BaseResponseDto(null, 'WordMedia soft deleted successfully');
    }

    @Delete(':id/permanent')
    @ApiOperation({ summary: 'Permanently delete a WordMedia by id', description: 'Permanently deletes a WordMedia from the database. This action cannot be undone. Requires authentication.', })
    @ApiParam({ name: 'id', description: 'WordMedia ID (uuid)', example: 1, type: 'number', })
    @ApiResponse({ status: 200, description: 'WordMedia permanently deleted successfully', type: BaseResponseDto<null>, })
    @ApiResponse({ status: 404, description: 'WordMedia not found', })
    @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required', })
    async permanentRemove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
        await this.WordMediaService.permanentRemove(id);
        return new BaseResponseDto(null, 'WordMedia permanently deleted successfully');
    }

    @Post(':id/restore')
    @ApiOperation({ summary: 'Restore a soft-deleted WordMedia', description: 'Restores a soft-deleted WordMedia.', })
    @ApiParam({ name: 'id', description: 'WordMedia ID (uuid)', example: 1, type: 'number', })
    @ApiResponse({ status: 200, description: 'WordMedia restored successfully', type: BaseResponseDto<null>, })
    @ApiResponse({ status: 404, description: 'WordMedia not found', })
    @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required', })
    async restore(@CurrentUser() user: AuthUser, @Param('id') id: string) {
        await this.WordMediaService.restore(id);
        return new BaseResponseDto(null, 'WordMedia restored successfully');
    }
}


