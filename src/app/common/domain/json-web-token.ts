export interface JsonWebToken {
  sub: string;
  name: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}
