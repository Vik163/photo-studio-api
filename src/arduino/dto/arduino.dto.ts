export type SwitchStatus = '0' | '1';

export class ArduinoDto {
  id: string;
  min?: number[];
  max?: number[];
  avr?: number[];
  thd?: number[];
  timerOutLight?: string[];
  outLight: SwitchStatus;
}
