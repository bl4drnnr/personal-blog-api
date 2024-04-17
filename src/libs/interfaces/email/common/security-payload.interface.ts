import { UserInfoInterface } from '@interfaces/user-info.interface';

export interface SecurityPayloadInterface {
  link: string;
  userInfo?: UserInfoInterface;
}
