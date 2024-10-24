import { useCallback, useEffect, useState } from 'react';
import ScaleSlider from './ScaleSlider';
import { Scale, ScaleSliderController } from './types';

function App() {
  const [scaleSliders, setScaleSliders] = useState<ScaleSliderController[]>([]);
  const [scaleSliderRes, setScaleSlideRes] = useState<Scale[]>([]);
  const [allRes, setAllRes] = useState('');

  const reqInitFunction = useCallback(async () => {
    const res = await fetch(
      `http://${import.meta.env.VITE_FASTAPI_ADDR}:${import.meta.env.VITE_FASTAPI_PORT}/slide/data`,
      {
        method: 'GET',
      },
    );
    const data = (await res.json()) as ScaleSliderController[];
    setScaleSliders(data);
    setScaleSlideRes(data.map((item) => item.min));
  }, []);
  const reqResFunction = useCallback(async () => {
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
    reqResFunction();
  }, [reqResFunction]);
  useEffect(() => {
    reqInitFunction();
  }, []);

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
