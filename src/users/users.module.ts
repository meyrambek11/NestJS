import { forwardRef, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { SequelizeModule } from "@nestjs/sequelize";
import { AuthModule } from "src/auth/auth.module";
import { Role } from "src/roles/roles.model";
import { RolesModule } from "src/roles/roles.module";
import { UserRoles } from "src/roles/user-roles.model";
import { UsersController } from "./users.controller";
import { User } from "./users.model";
import { UsersService } from "./users.service";

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    SequelizeModule.forFeature([User, Role, UserRoles]),
    RolesModule,
    forwardRef(() => AuthModule),
    ClientsModule.register([
      {
        name: "PRODUCT_SERVICE",
        transport: Transport.RMQ,
        options: {
          urls: [
            "amqps://yznzbkwx:cH1U1q0DjQndYcPzZ7cvO7Cj5H8wuzoK@cougar.rmq.cloudamqp.com/yznzbkwx",
          ],
          queue: "main_queue",
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  exports: [UsersService],
})
export class UsersModule {}
