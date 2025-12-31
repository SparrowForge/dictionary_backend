import { ApiProperty } from '@nestjs/swagger';
import { Status } from 'src/common/enums';
// import { Country } from 'src/country/entities/country.entity';
import { Role } from 'src/roles/entities/role.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';


@Entity('dc_users')
export class User {
  @ApiProperty({ description: 'User ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'User email', example: 'user@example.com' })
  @Column({ unique: true, nullable: false })
  email: string;

  @ApiProperty({ description: 'User name', example: 'johndoe' })
  @Column({ unique: true, nullable: false })
  user_name: string;

  @ApiProperty({ description: 'User password', example: 'p@ssword' })
  @Column({ select: false })
  password: string;

  @ApiProperty({ description: 'News letter send through email option status', example: true })
  @Column({ default: false })
  is_news_letter: boolean;

  @ApiProperty({ description: 'User phone number', example: '+880', required: false, })
  @Column({ nullable: true })
  phone_no?: string;

  //====================================================================
  @ApiProperty({ description: 'User first name', example: 'John', required: false, })
  @Column({ nullable: true })
  first_name?: string;

  @ApiProperty({ description: 'User last name', example: 'Doe', required: false, })
  @Column({ nullable: true })
  last_name?: string;

  @ApiProperty({ description: 'Primary address', example: 'primary address', required: false, })
  @Column({ nullable: true })
  address_line_1?: string;

  @ApiProperty({ description: 'Secondary address', example: 'secondary address', required: false, })
  @Column({ nullable: true })
  address_line_2?: string;

  @ApiProperty({ description: 'City', example: 'New York', required: false, })
  @Column({ nullable: true })
  city?: string;

  @ApiProperty({ description: 'Post Code', example: '00256', required: false, })
  @Column({ nullable: true })
  post_code?: string;

  // @ApiProperty({ description: 'Country', example: 10, required: false, })
  // @Column({ nullable: true, type: 'int' })
  // country_id?: number;

  @ApiProperty({ description: 'State', example: 'some state name', required: false, })
  @Column({ nullable: true })
  state?: string;

  @ApiProperty({ description: 'User Date Of Birth', example: '1990-03-14T12:00:00.000Z', required: false, })
  @Column({ nullable: true, type: 'timestamp' })
  date_of_birth?: Date;

  @ApiProperty({ description: 'User role ID', example: 1, })
  @Column({ nullable: true })
  roleId: string;

  @ApiProperty({ description: 'User status', example: 'active', enum: Status, })
  @Column({ type: 'enum', enum: Status, nullable: false, default: Status.ACTIVE, })
  status: Status;

  //====================================================================
  @ApiProperty({ description: 'User created at', example: '2025-03-14T12:00:00.000Z', })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'User updated at', example: '2025-03-14T12:00:00.000Z', })
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ApiProperty({ description: 'User deleted at', example: '2025-03-14T12:00:00.000Z', })
  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date;

  /* Relation */
  // @ApiProperty({ description: 'Country details', type: () => Country })
  // @ManyToOne(() => Country, (country) => country.id)
  // @JoinColumn({ name: 'country_id' })
  // countries?: Country;

  @ApiProperty({ description: 'User role object', type: () => Role, })
  @ManyToOne(() => Role, { nullable: true })
  @JoinColumn({ name: 'roleId' })
  role: Role;

}
