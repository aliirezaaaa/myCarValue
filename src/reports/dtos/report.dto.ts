import { Expose, Transform } from 'class-transformer';
import { User } from '../../users/user.entity';

// The purpose of this dto is to take the report entity instance and convert it
// into an object that has these properties. During this conversion we can exclude and include some properties.
// To generate a new property, that pulls some information from original report entity,
// we use transform decorator.
export class ReportDto {
  @Expose()
  id: number;

  @Expose()
  price: number;

  @Expose()
  year: number;

  @Expose()
  lng: number;

  @Expose()
  lat: number;

  @Expose()
  company: string;

  @Expose()
  model: string;

  @Expose()
  mileage: number;

  @Expose()
  approved: boolean;

  // Here obj is a reference to the original report entity
  @Transform(({ obj }) => obj.user.id)
  @Expose()
  userId: number;
}
