export interface Scale {
  label: string;
  value: number;
  key: string;
}

export interface ScaleSliderController {
  scales: Scale[];
  min: Scale;
  max: Scale;
  key: string;
}
