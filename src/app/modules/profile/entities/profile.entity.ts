export class Profile {
  id: string;
  email: string;
  name: string;
  password?: string;
  avatar: string;
  createdAt: Date;
  role?: string;
  refreshToken?: string;
  phone: string;
  seeker?: any;
  employer?: any;
}
