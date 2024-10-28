import { useEffect, useMemo, useRef, useState } from 'react';
import './scaleSlider.scss';
import { Scale } from './types';

function ScaleSlider({
  sliderKey,
  scale,
  max,
  min,
  label,
  getRes,
}: {
  sliderKey: string;
  scale?: Scale[];
  max: Scale;
  min: Scale;
  label: string;
  getRes: (s: Scale, sliderKey: string) => void;
}) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const [mouseX, setMouseX] = useState(0);
  const [mouseDown, setMouseDown] = useState(false);
  const [sliderWidth, setSliderWidth] = useState(0);
  const prevMaxSelect = useRef<Scale | null>(null);
  const [maxSelect, setMaxSelect] = useState<Scale>();

  const throttle = <T extends (...args: any[]) => void>(
    func: T,
    wait: number,
  ): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout | null = null;
    let lastArgs: Parameters<T> | null = null;

    return function (...args: Parameters<T>) {
      if (!timeout) {
        func(...args);
        timeout = setTimeout(() => {
          timeout = null;
          if (lastArgs) {
            func(...lastArgs);
            lastArgs = null;
          }
        }, wait);
      } else {
        lastArgs = args;
      }
    };
  };

  const mouseMoveHandler = throttle((e: MouseEvent) => {
    if (mouseDown && sliderRef.current) {
      const sliderRect = sliderRef.current.getBoundingClientRect();
      const offsetX = e.clientX - sliderRect.left;

      // 确保 offsetX 在 0 和 sliderWidth 之间
      const clampedOffsetX = Math.max(0, Math.min(offsetX, sliderRect.width));
      setMouseX(clampedOffsetX);
    }
  }, 16); // 使用更短的时间间隔更流畅

  useEffect(() => {
    if (mouseDown) {
      document.addEventListener('mousemove', mouseMoveHandler);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', handleMouseUp);
    }

    // 清理函数
    return () => {
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [mouseDown]);

  const handleMouseUp = () => {
    setMouseDown(false);
  };

  const percentage = useMemo(
    () => (sliderWidth ? (mouseX * 100) / sliderWidth : 0),
    [mouseX, sliderWidth],
  );

  useEffect(() => {
    const target = (percentage * max.value) / 100;
    if (!scale || scale.length === 0) return;

    const calcScale = [min, ...scale, max];
    // 过滤出所有比 target 小的 scale 对象
    const filteredScales = calcScale.filter((item) => item.value < target);

    // 找到 filteredScales 中 value 最大的那个
    const maxSelect = filteredScales.reduce((prev, current) => {
      return current.value > prev.value ? current : prev;
    }, filteredScales[0]);
    // 只有在 maxSelect 发生变化时才调用 getRes
    if (maxSelect && maxSelect.key !== prevMaxSelect.current?.key) {
      prevMaxSelect.current = maxSelect;
      getRes(maxSelect, sliderKey);
      setMaxSelect(maxSelect);
    }
  }, [max, scale, percentage]);

  return (
    <div className="slider-box">
      <p>{label}</p>
      <div>
        <div className="slider" ref={sliderRef}>
          <div
            className="rail"
            ref={railRef}
            style={{ width: `${percentage}%` }}
          />
          <div
            className="handle"
            ref={handleRef}
            onMouseDown={() => {
              setSliderWidth(
                sliderRef.current?.getBoundingClientRect().width ?? 0,
              );
              setMouseDown(true);
            }}
            style={{ left: `${percentage}%` }}
          />
          <div className="track" />
          {scale?.map((item) => {
            return (
              <div
                className="scale"
                key={item.key}
                style={{ left: `${(item.value * 100) / max.value}%` }}
              ></div>
            );
          })}
        </div>
      </div>
      <p>{maxSelect?.value}</p>
    </div>
  );
}

export default ScaleSlider;
