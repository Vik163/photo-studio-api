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
  service: string;
  price?: string;
}

export class BodyServiceDto {
  type: TypeServices;
  id: string;
  service: string;
  price?: string;
}
