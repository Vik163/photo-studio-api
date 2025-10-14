export type TypeServices =
  | 'photo-na-dokumenty'
  | 'photo-restavraciya'
  | 'photo-dizain'
  | 'ritual-photo';

export type AdminServicesDto = {
  type: TypeServices;
  services: AdminOneServiceDto[];
};

export class AdminOneServiceDto {
  id: string;
  value: string;
  price?: string;
}

export class BodyServiceDto {
  type: TypeServices;
  id: string;
  value: string;
  price?: string;
}
