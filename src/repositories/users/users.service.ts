import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { FindManyOptions, Not, Raw, Repository } from 'typeorm';

import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { PaginationDto, QueryBaseDto } from '../../common/pagination/dto';
import { pagination } from '../../common/pagination/pagination';
import { CrudRepository } from '../../common/use-case';
import { normalizeText } from '../../common/utlis/string.utils';
import {
  ChangePasswordDto,
  CreateUserDto,
  UpdateProfileDto,
  UpdateUserDto,
  UserResponseDto,
} from './dto';
import { User } from './entities/user.entity';

const ALLOWED_SORT = new Set([
  'id',
  'name',
  'email',
  'role',
  'createdAt',
  'updatedAt',
  'lastLogin',
]);

@Injectable()
export class UsersService implements CrudRepository<User> {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const temporaryPassword = randomBytes(8).toString('hex');
    const newUser = this.usersRepository.create({
      ...createUserDto,
      password: temporaryPassword,
    });
    const createdUser = await this.usersRepository.save(newUser);
    return new UserResponseDto(createdUser, temporaryPassword);
  }

  async findAll(excludeUserId?: number): Promise<UserResponseDto[]> {
    const where: any = { deleted: false };

    if (excludeUserId) {
      where.id = Not(excludeUserId);
    }

    const users = await this.usersRepository.find({
      where,
    });
    return users.map((user) => new UserResponseDto(user));
  }

  async findPaginated(
    query: QueryBaseDto,
    excludeUserId?: number,
  ): Promise<PaginationDto<UserResponseDto>> {
    const {
      term,
      page = 1,
      size = 10,
      sort = 'createdAt',
      order = 'DESC',
    } = query;

    if (!ALLOWED_SORT.has(sort)) {
      throw new BadRequestException(`Campo de ordenamiento inválido: ${sort}`);
    }

    const where: any = { deleted: false };

    if (excludeUserId) {
      where.id = Not(excludeUserId);
    }

    const findOptions: FindManyOptions<User> = {
      where,
      take: size,
      skip: (page - 1) * size,
      order: { [sort]: order },
    };

    if (term) {
      const normalizedTerm = normalizeText(term);
      findOptions.where = {
        ...findOptions.where,
        name: Raw(
          (alias) => `unaccent(LOWER(${alias})) LIKE unaccent(LOWER(:value))`,
          {
            value: `%${normalizedTerm}%`,
          },
        ),
      };
    }

    const [users, total] = await this.usersRepository.findAndCount(findOptions);
    const userDtos = users.map((user) => new UserResponseDto(user));

    return pagination(page, size, userDtos, total);
  }

  async findValid(id: number | string): Promise<User> {
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;

    if (isNaN(numericId)) {
      throw new NotFoundException(`ID de usuario inválido: ${id}`);
    }

    const user = await this.usersRepository.findOne({
      where: { id: numericId, deleted: false },
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return user;
  }

  async findOne(id: number): Promise<UserResponseDto> {
    const user = await this.findValid(id);
    return new UserResponseDto(user);
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const userToUpdate = await this.findValid(id);
    Object.assign(userToUpdate, updateUserDto);
    const updatedUser = await this.usersRepository.save(userToUpdate);
    return new UserResponseDto(updatedUser);
  }

  async remove(id: number): Promise<{ message: string }> {
    const userToDelete = await this.findValid(id);
    userToDelete.deleted = true;
    await this.usersRepository.save(userToDelete);
    return { message: `Usuario con ID ${id} marcado como eliminado` };
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({
      where: { email, deleted: false },
    });
  }

  // ── Profile ─────────────────────────────────────────────

  async getProfile(userId: number): Promise<UserResponseDto> {
    const user = await this.findValid(userId);
    return new UserResponseDto(user);
  }

  async updateProfile(
    userId: number,
    dto: UpdateProfileDto,
  ): Promise<UserResponseDto> {
    const user = await this.findValid(userId);
    Object.assign(user, dto);
    const saved = await this.usersRepository.save(user);
    return new UserResponseDto(saved);
  }

  async changePassword(
    userId: number,
    dto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    const user = await this.usersRepository.findOne({
      where: { id: userId, deleted: false },
      select: ['id', 'password'],
    });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const valid = await user.comparePassword(dto.currentPassword);
    if (!valid) throw new UnauthorizedException('Contraseña actual incorrecta');

    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
    const hashed = await bcrypt.hash(dto.newPassword, saltRounds);
    await this.usersRepository.update(userId, { password: hashed });
    return { message: 'Contraseña actualizada exitosamente' };
  }
}
