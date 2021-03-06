import { Body, Controller, Get, Inject, Post, UseGuards } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { JwTAuthGuard } from "src/auth/jwt-auth.guard";
import { Roles } from "src/auth/roles-auth.decorator";
import { RolesGuard } from "src/auth/roles.guard";
import { AddRoleDto } from "./dto/add-role.dto";
import { BanUserDto } from "./dto/ban-user.dto";
import { CreateUserDto } from "./dto/create-user.dto";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(
    private usersService: UsersService,
    @Inject("PRODUCT_SERVICE") private readonly client: ClientProxy
  ) {}

  @Post()
  create(@Body() userDto: CreateUserDto) {
    return this.usersService.createUser(userDto);
  }

  // @Roles("ADMIN")
  // @UseGuards(RolesGuard)
  @Get()
  async getAll() {
    const users = await this.usersService.getAllUsers();
    //this.client.emit("hello", users);
    // return this.usersService.getAllUsers();
    return this.client.emit("hello", users);
  }

  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @Post("/roles")
  addRole(@Body() addRoleDto: AddRoleDto) {
    return this.usersService.addRole(addRoleDto);
  }

  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @Post("/ban")
  ban(@Body() banUserDto: BanUserDto) {
    return this.usersService.ban(banUserDto);
  }
}
