import React, { useState } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import Typography from '@mui/material/Typography';

interface RangeSliderProps {
  min: number;
  max: number;
  onChange: (values: number | number[]) => void;
}

const RangeSlider: React.FC<RangeSliderProps> = ({ min, max, onChange }) => {
  const [values, setValues] = useState<number | number[]>([min, max]);

  const handleSliderChange = (newValues: number | number[]) => {
    setValues(newValues);
    onChange(newValues);
  };

  return (
    <div className="text-center">
      <Slider
        range
        min={min}
        max={max}
        defaultValue={[min, max]}
        onChange={handleSliderChange}
      />
      <Typography className='flex justify-center' variant="caption" display="block" gutterBottom>
        Min: {Array.isArray(values) ? values[0] : values}, Max: {Array.isArray(values) ? values[1] : values}
      </Typography>
    </div>
  );
};


export default RangeSlider;
