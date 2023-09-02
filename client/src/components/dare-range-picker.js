import { useState } from 'react';
import DatePicker from '@amir04lm26/react-modern-calendar-date-picker';
import moment from 'moment';
import '@amir04lm26/react-modern-calendar-date-picker/lib/DatePicker.css';
import './date-range.picker.css'

export const DATE_ISO_FORMAT = 'YYYY-MM-DD';

export default function DateRangePicker(props) {

  const [value, setValue] = useState(convertRanges(props.value));

  const formatCustomDate = () => {
    const from = value?.from;
    const to = value?.to;
    if (!from || !to) return 'Select Date Range';
    return `${from.day}-${from.month}-${from.year} to ${to.day}-${to.month}-${to.year}`;
  };

  const onChange = (newVal) => {
    setValue(newVal);
    if (!newVal.from) return;
    if (!newVal.to) return;

    const from = moment({ day: newVal.from.day, month: newVal.from.month - 1, year: newVal.from.year });
    const to = moment({ day: newVal.to.day, month: newVal.to.month - 1, year: newVal.to.year });
    const fromResult = from.format(DATE_ISO_FORMAT);
    const toResult = to.format(DATE_ISO_FORMAT);
    props.onChange({ from: fromResult, to: toResult });
  }

  return (
    <div className='wrapper'>
      <DatePicker
        value={value}
        formatInputText={() => formatCustomDate()}
        onChange={(newVal) => onChange(newVal)}
        inputPlaceholder="Select Date Range"
        colorPrimary='#EC1B41'
        colorPrimaryLight='#FFEBEE'
        inputClassName='dateInput'
      />
    </div>
  )
}

function convertRanges(range) {
  return {
    from: toDayValue(range?.from),
    to: toDayValue(range?.to),
  };
}

function toDayValue(from) {
  if (!from) return null;
  let convertVal = moment(from);
  if (!convertVal) return null;

  const to = { year: convertVal.year(), month: convertVal.month() + 1, day: convertVal.date() };
  return to;
}