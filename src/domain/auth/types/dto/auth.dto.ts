export interface SignUpRequestDTO {
  username: string;
  nickname: string;
  password?: string;
  confirmPassword?: string;
}

export interface SignInRequestDTO {
  username: string;
  password?: string;
}

export interface UserResponseDTO {
  id: number;
  username: string;
  nickname: string;
}
