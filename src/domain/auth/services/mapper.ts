import type { UserResponseDTO } from "@domain/auth/types/dto/auth.dto";
import type { User } from "@domain/auth/types/User";

export const toUser = (userResponse: UserResponseDTO): User => {
  return {
    id: userResponse.id,
    username: userResponse.username,
    nickname: userResponse.nickname,
  };
};
