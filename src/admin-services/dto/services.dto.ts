export type TypeServices =
  | 'photo-na-dokumenty'
  | 'photo-restavraciya'
  | 'photo-dizain'
  | 'retual-photo';

export type AdminServicesDto = {
  [key in TypeServices]?: AdminOneServiceDto[];
};

export class AdminOneServiceDto {
  service: string;
  price?: number;
}

export class BodyServiceDto {
  type: TypeServices;
  service: string;
  price?: number;
}
