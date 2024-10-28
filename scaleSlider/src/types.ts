export interface Scale {
  label: string;
  value: number;
  key: string;
  sliderKey?: string;
}

export interface ScaleSliderController {
  scales: Scale[];
  min: Scale;
  max: Scale;
  label: string;
  key: string;
}
