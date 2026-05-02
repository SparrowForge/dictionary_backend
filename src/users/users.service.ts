import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';

import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UpdatePasswordDto } from 'src/users/dto/update-password.dto';
import { BaseResponseDto } from 'src/common/dto/base-response.dto';
import { WordView } from 'src/words/entities/word-view.entity';
import { AuditLog } from 'src/audits/entities/audit.entity';
import { PasswordResetToken } from 'src/auth/entities/password-reset-token.entity';
import { RefreshToken } from 'src/auth/entities/refresh-token.entity';
import { Catagory } from 'src/catagory/entities/catagory.entity';
import { Classes } from 'src/classes/entities/classes.entity';
import { FavouriteWords } from 'src/favourite_words/entities/favourite_words.entity';
import { NotificationRecord } from 'src/notification-record/entities/notification-record.entity';
import { UserToFirebaseTokenMap } from 'src/notifications/entity/userToFirebaseTokenMap.entity';
import { StudentActivity } from 'src/student_activity/entities/student-activity.entity';
import { Students } from 'src/students/entities/students.entity';
import { Files } from 'src/files/entities/file.entity';
import { RolesEnum } from 'src/common/enums/role.enum';

type InternalVerificationFields = {
  is_verified?: boolean;
  verification_token?: string | null;
  verification_token_expires_at?: Date | null;
};

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(WordView)
    private wordViewRepository: Repository<WordView>,
    @InjectRepository(AuditLog)
    private AuditLogRepository: Repository<AuditLog>,
    @InjectRepository(PasswordResetToken)
    private PasswordResetTokenRepository: Repository<PasswordResetToken>,
    @InjectRepository(RefreshToken)
    private RefreshTokenRepository: Repository<RefreshToken>,
    @InjectRepository(Catagory)
    private CatagoryRepository: Repository<Catagory>,
    @InjectRepository(Classes)
    private ClassesRepository: Repository<Classes>,
    @InjectRepository(FavouriteWords)
    private FavouriteWordsRepository: Repository<FavouriteWords>,
    @InjectRepository(NotificationRecord)
    private NotificationRecordRepository: Repository<NotificationRecord>,
    @InjectRepository(UserToFirebaseTokenMap)
    private UserToFirebaseTokenMapRepository: Repository<UserToFirebaseTokenMap>,
    @InjectRepository(StudentActivity)
    private StudentActivityRepository: Repository<StudentActivity>,
    @InjectRepository(WordView)
    private WordViewRepository: Repository<WordView>,
    @InjectRepository(Students)
    private StudentsRepository: Repository<Students>,
    @InjectRepository(Files)
    private FilesRepository: Repository<Files>,
  ) { }

  async create(
    createUserDto: CreateUserDto & {
      verification_token?: string | null;
      verification_token_expires_at?: Date | null;
    },
  ): Promise<User> {
    // Hash the password before saving
    const existingUser = await this.findByEmail(createUserDto.email);
    console.log(existingUser);
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }
    // const existingUserByUserName = await this.findByEmailOrUserName(createUserDto.name);
    // if (existingUserByUserName) {
    //   throw new BadRequestException('Username already exists');
    // }
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Create user DTO with hashed password
    const userWithHashedPassword = {
      ...createUserDto,
      password: hashedPassword,
    };

    const user = this.userRepository.create(userWithHashedPassword);
    return this.userRepository.save(user);
  }

  async findAll(
    paginationDto: PaginationDto,
    filters?: Partial<FilterUserDto>,
  ): Promise<PaginatedResponseDto<User>> {
    const { page = 1, limit = 1000000000000 } = paginationDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.file', 'file')
      .leftJoinAndSelect('user.class', 'class')
      .skip(skip)
      .take(limit)
      .orderBy('user.name', 'ASC');

    // Apply filter if phone no avl
    if (filters?.phone_no) {
      queryBuilder.andWhere('user.phone_no = :phone_no', {
        phone_no: filters.phone_no,
      });
    }

    // Apply status filter if provided
    if (filters?.status) {
      queryBuilder.andWhere('user.status = :status', {
        status: filters.status,
      });
    }

    // Apply role filter if provided
    if (filters?.role) {
      queryBuilder.andWhere('user.role = :role', {
        role: filters.role,
      });
    }

    // Apply email filter if provided
    if (filters?.email) {
      queryBuilder.andWhere('user.email = :email', {
        email: filters.email,
      });
    }

    // Apply name filter if provided
    if (filters?.name) {
      queryBuilder.andWhere('user.name ILIKE :name', {
        name: filters.name,
      });
    }
    if (filters?.class_id) {
      queryBuilder.andWhere('user.class_id = :class_id', {
        class_id: filters.class_id,
      });
    }
    if (filters?.section) {
      queryBuilder.andWhere('(user.section ILIKE :section)',
        { section: `%${filters.section}%` },
      );
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

  findOne(id: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
      relations: ['file', 'class'],
      withDeleted: false, // Only get non-deleted users
    });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
  }

  findByIdWithPassword(id: string): Promise<User | null> {
    return this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.id = :id', { id })
      .getOne();
  }

  update(id: string, updateUserDto: UpdateUserDto & InternalVerificationFields) {
    return this.userRepository.update(id, updateUserDto);
  }

  remove(id: string) {
    return this.userRepository.softDelete(id);
  }

  // Method to permanently delete a user (for admin purposes)
  async permanentRemove(id: string) {

    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      return new BadRequestException('User not found');
    }
    if (user.role === RolesEnum.STUDENT) {
      await this.wordViewRepository.delete({ user_id: id });
      await this.AuditLogRepository.delete({ userId: id });
      await this.PasswordResetTokenRepository.delete({ userId: id });
      await this.RefreshTokenRepository.delete({ userId: id });
      await this.CatagoryRepository.delete({ created_by: id });
      await this.CatagoryRepository.delete({ updated_by: id });
      await this.FavouriteWordsRepository.delete({ created_by: id });
      await this.FavouriteWordsRepository.delete({ updated_by: id });
      await this.NotificationRecordRepository.delete({ userId: id });
      await this.UserToFirebaseTokenMapRepository.delete({ userId: id });
      await this.StudentActivityRepository.delete({ created_by: id });
      await this.StudentActivityRepository.delete({ updated_by: id });
      await this.WordViewRepository.delete({ user_id: id });
      await this.StudentsRepository.delete({ user_id: id });
      await this.FilesRepository.delete({ uploaded_by: id });
    }

    return this.userRepository.delete(id);
  }

  // Method to restore a soft-deleted user
  restore(id: string) {
    return this.userRepository.restore(id);
  }

  getRoles(userId: string) {
    return this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'role'],
    });
  }

  async updatePassword(id: string, newPassword: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepository.update(id, { password: hashedPassword });
  }

  async updatePasswordNew(userId: string, updatePasswordDto: UpdatePasswordDto) {
    const { previousPassword, newPassword } = updatePasswordDto;

    const user = await this.findByIdWithPassword(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    console.log(user);
    const isPreviousPasswordValid = await bcrypt.compare(
      previousPassword,
      user.password,
    );
    if (!isPreviousPasswordValid) {
      throw new UnauthorizedException('Previous password is incorrect');
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      throw new BadRequestException(
        'New password must be different from previous password',
      );
    }

    await this.updatePassword(userId, newPassword);
    return new BaseResponseDto(null, 'Password updated successfully');
  }
}
