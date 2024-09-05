export class CreateUserDto {
  readonly username: string;
  readonly password: string;
  readonly firstname: string;
  readonly lastname: string;
  readonly email: string;
  readonly usecode?: string;
}
