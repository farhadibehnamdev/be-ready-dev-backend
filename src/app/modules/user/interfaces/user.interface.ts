import { Document, Types } from 'mongoose';

import { RoleTypeEnum } from '@shared/enums/role-type.enum';

export interface IUserDocument extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: RoleTypeEnum;
  isEmailVerified: boolean;
  isDeleted: boolean;
  passwordChangedAt?: Date;
  avatar: Types.ObjectId;
}
