import { useCallback, useEffect, useState } from 'react';
import ScaleSlider from './ScaleSlider';
import { Scale, ScaleSliderController } from './types';

function App() {
  const scaleSliders: ScaleSliderController[] = [
    {
      scales: [
        { value: 10, label: 'One', key: '1' },
        { value: 20, label: 'Two', key: '2' },
        { value: 30, label: 'Three', key: '3' },
      ],
      min: { value: 0, label: 'Zero', key: 'min' },
      max: { value: 150, label: 'Max', key: 'max' },
      key: 'slide1',
    },
    {
      scales: [
        { value: 10, label: 'Low', key: '1' },
        { value: 70, label: 'Mid', key: '2' },
        { value: 90, label: 'High', key: '3' },
      ],
      min: { value: 0, label: 'Min', key: 'min' },
      max: { value: 120, label: 'Max', key: 'max' },
      key: 'slide2',
    },
  ];
  const [scaleSliderRes, setScaleSlideRes] = useState<Scale[]>(
    scaleSliders.map((item) => item.min),
  );
  const [allRes, setAllRes] = useState('');
  const reqFunction = useCallback(async () => {
    const res = await fetch(
      `http://${import.meta.env.VITE_FASTAPI_ADDR}:${import.meta.env.VITE_FASTAPI_PORT}/slide/res`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scaleSliderRes),
      },
    );
    const data = await res.json();
    setAllRes(data.result);
  }, [scaleSliderRes]);
  useEffect(() => {
    reqFunction();
  }, [reqFunction]);

  return (
    <div className="slides">
      <div>{allRes}</div>
      {scaleSliders.map((item, index) => {
        return (
          <ScaleSlider
            key={item.key}
            scale={item.scales}
            max={item.max}
            min={item.min}
            getRes={(newScale) => {
              setScaleSlideRes((prev) =>
                prev.map((s, i) => (i === index ? newScale : s)),
              );
            }}
          />
        );
      })}
    </div>
  );
}

export default App;
