import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UseGuards,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { addAttribute } from "sequelize-typescript";
import { JwTAuthGuard } from "src/auth/jwt-auth.guard";
import { Role } from "src/roles/roles.model";
import { RolesService } from "src/roles/roles.service";
import { UserRoles } from "src/roles/user-roles.model";
import { AddRoleDto } from "./dto/add-role.dto";
import { BanUserDto } from "./dto/ban-user.dto";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./users.model";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    private roleService: RolesService,
    @InjectModel(UserRoles) private userRoleRepository: typeof UserRoles
  ) {}

  async createUser(dto: CreateUserDto) {
    try {
      const user = await this.userRepository.create(dto);
      const role = await this.roleService.getRoleByValue("USER");
      await user.$set("roles", [role.id]);
      user.roles = [role];
      return user;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async getAllUsers() {
    const users = await this.userRepository.findAll({
      attributes: ["id", "email"],
      include: { all: true },
    });
    return users;
  }

  async getUserByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      include: { all: true },
    });
    return user;
  }

  async getUserById(id: number) {
    const user = await this.userRepository.findByPk(id, {
      include: { all: true },
    });
    return user;
  }

  async addRole(dto: AddRoleDto) {
    const user = this.getUserById(dto.userId);
    const role = await this.roleService.getRoleByValue(dto.value);
    if (role && user) {
      (await user).$add("role", role.id);
      return this.getUserById(dto.userId);
    }
    throw new HttpException(
      "Пользователь или роль не найдены",
      HttpStatus.NOT_FOUND
    );
  }

  async ban(dto: BanUserDto) {}
}
