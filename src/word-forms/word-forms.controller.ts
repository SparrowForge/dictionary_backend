import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BaseResponseDto } from 'src/common/dto/base-response.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type AuthUser from 'src/auth/dto/auth-user';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesEnum } from 'src/common/enums/role.enum';
import { WordForms } from './entities/word-forms.entity';
import { CreateWordFormsDto } from './dto/create-word-forms.dto';
import { WordFormsService } from './word-forms.service';
import { FilterWordFormsDto } from './dto/filter-word-forms.dto';
import { UpdateWordFormsDto } from './dto/update-word-forms.dto';

@ApiTags('WordForms')
@ApiBearerAuth()
@Roles(RolesEnum.ADMIN)
@Controller('api/v1/word-forms')
export class WordFormsController {
    constructor(private readonly WordFormsService: WordFormsService) { }

    @Post()
    @ApiOperation({
        summary: 'Create a new WordForms', description: 'Creates a new WordForms with the provided information. Password will be hashed before saving. Requires authentication.',
    })
    @ApiResponse({ status: 201, description: 'WordForms created successfully', type: BaseResponseDto<WordForms>, })
    @ApiResponse({ status: 400, description: 'Bad request - validation error', })
    @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required', })
    async create(@CurrentUser() user: AuthUser, @Body() createWordFormsDto: CreateWordFormsDto) {
        createWordFormsDto.created_by = user.userId;
        const entity = await this.WordFormsService.create(createWordFormsDto);
        return new BaseResponseDto(entity, 'WordForms created successfully');
    }

    @Get()
    @ApiOperation({ summary: 'Get all WordForms with pagination and filters', description: 'Retrieves a paginated list of all active WordForms with optional filtering by role, department, and search terms. Requires authentication.', })
    @ApiResponse({
        status: 200, description: 'Returns paginated list of WordForms', type: BaseResponseDto<PaginatedResponseDto<WordForms>>,
        schema: {
            example: {
                success: true,
                message: 'WordForms retrieved successfully',
                data: {
                    items: [] as WordForms[],
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
    async findAll(@Query() filters: FilterWordFormsDto) {
        const { page, limit, ...WordFormsFilters } = filters;
        const pagination = { page, limit };
        const WordForms = await this.WordFormsService.findAll(pagination, WordFormsFilters);
        return new BaseResponseDto(WordForms, 'WordForms retrieved successfully');
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a WordForms by id', description: 'Retrieves a specific WordForms by their ID. Only returns active WordForms (soft-deleted WordForms are excluded). Requires authentication.', })
    @ApiParam({ name: 'id', description: 'WordForms ID (uuid)', example: '45e16f14-b27f-4d20-99df-c1d5535ff9e3', type: 'string', })
    @ApiResponse({ status: 200, description: 'WordForms retrieved successfully', type: BaseResponseDto<WordForms>, })
    @ApiResponse({ status: 404, description: 'WordForms not found', })
    @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required', })
    async findOne(@Param('id') id: string) {
        const WordForms = await this.WordFormsService.findOne(id);
        return new BaseResponseDto(WordForms, 'WordForms retrieved successfully');
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a WordForms by id', description: 'Updates an existing WordForms with the provided information. Only active WordForms can be updated. Requires authentication.', })
    @ApiParam({ name: 'id', description: 'WordForms ID (uuid)', example: '45e16f14-b27f-4d20-99df-c1d5535ff9e3', type: 'number', })
    @ApiResponse({ status: 200, description: 'WordForms updated successfully', type: BaseResponseDto<WordForms>, })
    @ApiResponse({ status: 404, description: 'WordForms not found', })
    @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required', })
    async update(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body() updateWordFormsDto: UpdateWordFormsDto,) {
        updateWordFormsDto.updated_by = user.userId;
        const WordForms = await this.WordFormsService.update(id, updateWordFormsDto);
        return new BaseResponseDto(WordForms, 'WordForms updated successfully');
    }

    @Delete(':id')
    @ApiOperation({
        summary: 'Soft delete a WordForms by id',
        description: 'Soft deletes a WordForms by setting the deletedAt timestamp. The WordForms will not appear in regular queries but can be restored. Requires authentication.',
    })
    @ApiParam({ name: 'id', description: 'WordForms ID (uuid)', example: 1, type: 'number', })
    @ApiResponse({ status: 200, description: 'WordForms soft deleted successfully', type: BaseResponseDto<null>, })
    @ApiResponse({ status: 404, description: 'WordForms not found', })
    @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required', })
    async remove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
        await this.WordFormsService.remove(id);
        return new BaseResponseDto(null, 'WordForms soft deleted successfully');
    }

    @Delete(':id/permanent')
    @ApiOperation({ summary: 'Permanently delete a WordForms by id', description: 'Permanently deletes a WordForms from the database. This action cannot be undone. Requires authentication.', })
    @ApiParam({ name: 'id', description: 'WordForms ID (uuid)', example: 1, type: 'number', })
    @ApiResponse({ status: 200, description: 'WordForms permanently deleted successfully', type: BaseResponseDto<null>, })
    @ApiResponse({ status: 404, description: 'WordForms not found', })
    @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required', })
    async permanentRemove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
        await this.WordFormsService.permanentRemove(id);
        return new BaseResponseDto(null, 'WordForms permanently deleted successfully');
    }

    @Post(':id/restore')
    @ApiOperation({ summary: 'Restore a soft-deleted WordForms', description: 'Restores a soft-deleted WordForms.', })
    @ApiParam({ name: 'id', description: 'WordForms ID (uuid)', example: 1, type: 'number', })
    @ApiResponse({ status: 200, description: 'WordForms restored successfully', type: BaseResponseDto<null>, })
    @ApiResponse({ status: 404, description: 'WordForms not found', })
    @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required', })
    async restore(@CurrentUser() user: AuthUser, @Param('id') id: string) {
        await this.WordFormsService.restore(id);
        return new BaseResponseDto(null, 'WordForms restored successfully');
    }
}


