export type User = {
  userId: string;
  username: string;
  isAdmin: boolean;
};

export type RouteName = string

export type JwtPayload = { id: string; username: string; admin: boolean };
