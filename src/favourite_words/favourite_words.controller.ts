import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BaseResponseDto } from 'src/common/dto/base-response.dto';
import { CurrentUser } from './../common/decorators/current-user.decorator';
import type AuthUser from 'src/auth/dto/auth-user';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesEnum } from 'src/common/enums/role.enum';
import { FavouriteWords } from './entities/favourite_words.entity';
import { CreateFavouriteWordsDto } from './dto/create-favourite_words.dto';
import { FavouriteWordsService } from './favourite_words.service';
import { FilterFavouriteWordsDto } from './dto/filter-favourite_words.dto';
import { UpdateFavouriteWordsDto } from './dto/update-favourite_words.dto';

@ApiTags('FavouriteWords')
@ApiBearerAuth()
@Roles(RolesEnum.ADMIN, RolesEnum.TEACHER, RolesEnum.STUDENT)
@Controller('api/v1/favourite-words')
export class FavouriteWordsController {
    constructor(private readonly FavouriteWordsService: FavouriteWordsService) { }

    @Post()
    @ApiOperation({
        summary: 'Create a new FavouriteWords', description: 'Creates a new FavouriteWords with the provided information. Password will be hashed before saving. Requires authentication.',
    })
    @ApiResponse({ status: 201, description: 'FavouriteWords created successfully', type: BaseResponseDto<FavouriteWords>, })
    @ApiResponse({ status: 400, description: 'Bad request - validation error', })
    @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required', })
    async create(@CurrentUser() user: AuthUser, @Body() createFavouriteWordsDto: CreateFavouriteWordsDto) {
        createFavouriteWordsDto.created_by = user.userId;
        const entity = await this.FavouriteWordsService.create(createFavouriteWordsDto);
        return new BaseResponseDto(entity, 'FavouriteWords created successfully');
    }

    @Get()
    @ApiOperation({ summary: 'Get all FavouriteWords with pagination and filters', description: 'Retrieves a paginated list of all active FavouriteWords with optional filtering by role, department, and search terms. Requires authentication.', })
    @ApiResponse({
        status: 200, description: 'Returns paginated list of FavouriteWords', type: BaseResponseDto<PaginatedResponseDto<FavouriteWords>>,
        schema: {
            example: {
                success: true,
                message: 'FavouriteWords retrieved successfully',
                data: {
                    items: [] as FavouriteWords[],
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
    async findAll(@Query() filters: FilterFavouriteWordsDto) {
        const { page, limit, ...FavouriteWordsFilters } = filters;
        const pagination = { page, limit };
        const FavouriteWords = await this.FavouriteWordsService.findAll(pagination, FavouriteWordsFilters);
        return new BaseResponseDto(FavouriteWords, 'FavouriteWords retrieved successfully');
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a FavouriteWords by id', description: 'Retrieves a specific FavouriteWords by their ID. Only returns active FavouriteWords (soft-deleted FavouriteWords are excluded). Requires authentication.', })
    @ApiParam({ name: 'id', description: 'FavouriteWords ID (uuid)', example: '45e16f14-b27f-4d20-99df-c1d5535ff9e3', type: 'string', })
    @ApiResponse({ status: 200, description: 'FavouriteWords retrieved successfully', type: BaseResponseDto<FavouriteWords>, })
    @ApiResponse({ status: 404, description: 'FavouriteWords not found', })
    @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required', })
    async findOne(@Param('id') id: string) {
        const FavouriteWords = await this.FavouriteWordsService.findOne(id);
        return new BaseResponseDto(FavouriteWords, 'FavouriteWords retrieved successfully');
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a FavouriteWords by id', description: 'Updates an existing FavouriteWords with the provided information. Only active FavouriteWords can be updated. Requires authentication.', })
    @ApiParam({ name: 'id', description: 'FavouriteWords ID (uuid)', example: '45e16f14-b27f-4d20-99df-c1d5535ff9e3', type: 'number', })
    @ApiResponse({ status: 200, description: 'FavouriteWords updated successfully', type: BaseResponseDto<FavouriteWords>, })
    @ApiResponse({ status: 404, description: 'FavouriteWords not found', })
    @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required', })
    async update(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body() updateFavouriteWordsDto: UpdateFavouriteWordsDto,) {
        updateFavouriteWordsDto.updated_by = user.userId;
        const FavouriteWords = await this.FavouriteWordsService.update(id, updateFavouriteWordsDto);
        return new BaseResponseDto(FavouriteWords, 'FavouriteWords updated successfully');
    }

    @Delete(':id')
    @ApiOperation({
        summary: 'Soft delete a FavouriteWords by id',
        description: 'Soft deletes a FavouriteWords by setting the deletedAt timestamp. The FavouriteWords will not appear in regular queries but can be restored. Requires authentication.',
    })
    @ApiParam({ name: 'id', description: 'FavouriteWords ID (uuid)', example: 1, type: 'number', })
    @ApiResponse({ status: 200, description: 'FavouriteWords soft deleted successfully', type: BaseResponseDto<null>, })
    @ApiResponse({ status: 404, description: 'FavouriteWords not found', })
    @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required', })
    async remove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
        await this.FavouriteWordsService.remove(id);
        return new BaseResponseDto(null, 'FavouriteWords soft deleted successfully');
    }

    @Delete(':id/permanent')
    @ApiOperation({ summary: 'Permanently delete a FavouriteWords by id', description: 'Permanently deletes a FavouriteWords from the database. This action cannot be undone. Requires authentication.', })
    @ApiParam({ name: 'id', description: 'FavouriteWords ID (uuid)', example: 1, type: 'number', })
    @ApiResponse({ status: 200, description: 'FavouriteWords permanently deleted successfully', type: BaseResponseDto<null>, })
    @ApiResponse({ status: 404, description: 'FavouriteWords not found', })
    @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required', })
    async permanentRemove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
        await this.FavouriteWordsService.permanentRemove(id);
        return new BaseResponseDto(null, 'FavouriteWords permanently deleted successfully');
    }

    @Post(':id/restore')
    @ApiOperation({ summary: 'Restore a soft-deleted FavouriteWords', description: 'Restores a soft-deleted FavouriteWords.', })
    @ApiParam({ name: 'id', description: 'FavouriteWords ID (uuid)', example: 1, type: 'number', })
    @ApiResponse({ status: 200, description: 'FavouriteWords restored successfully', type: BaseResponseDto<null>, })
    @ApiResponse({ status: 404, description: 'FavouriteWords not found', })
    @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required', })
    async restore(@CurrentUser() user: AuthUser, @Param('id') id: string) {
        await this.FavouriteWordsService.restore(id);
        return new BaseResponseDto(null, 'FavouriteWords restored successfully');
    }
}


