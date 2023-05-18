import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UpdatePatchUserDTO } from './dto/update-patch.dto';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { UserEntity } from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async create(data: CreateUserDTO) {
    try {
      if (
        await this.usersRepository.exist({
          where: {
            email: data.email,
          },
        })
      ) {
        throw new BadRequestException('Email já cadastrado');
      }

      if (!data.birthAt) {
        data.birthAt = null;
      }

      data.password = await bcrypt.hash(data.password, await bcrypt.genSalt());

      const user = this.usersRepository.create(data);

      return this.usersRepository.save(user);
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async list() {
    return this.usersRepository.find();
  }

  async show(id: number) {
    await this.exists(id);
    return this.usersRepository.findOneBy({
      id,
    });
  }

  async update(
    id: number,
    { email, name, password, birthAt, role }: UpdateUserDTO,
  ) {
    await this.exists(id);

    password = await bcrypt.hash(password, await bcrypt.genSalt());

    await this.usersRepository.update(id, {
      email,
      name,
      password,
      birthAt: birthAt ? new Date(birthAt) : null,
      role: role,
    });

    return this.show(id);
  }

  async updatePartial(
    id: number,
    { email, name, password, birthAt, role }: UpdatePatchUserDTO,
  ) {
    await this.exists(id);
    const data: any = {};

    if (birthAt) {
      data.birthAt = new Date(birthAt);
    }

    if (name) {
      data.name = name;
    }

    if (email) {
      data.email = email;
    }

    if (password) {
      data.password = await bcrypt.hash(password, await bcrypt.genSalt());
    }

    if (role) {
      data.role = role;
    }

    await this.usersRepository.update(id, data);

    return this.show(id);
  }

  async delete(id: number) {
    await this.exists(id);

    return this.usersRepository.delete(id);
  }

  async exists(id: number) {
    if (
      !(await this.usersRepository.exist({
        where: {
          id,
        },
      }))
    ) {
      throw new NotFoundException('Usuário inexistente');
    }
  }
}
