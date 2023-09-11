import { MONTH } from "@shared/constants/user";
import Textfield from "./TextField";
import Select from "@/Components/Select";
import { extractDayMonthYearFromDate } from "@/Utils/date";

interface DateField {
  date: string;
  error?: string;
  onChange: (date: string) => void;
}

const checkCorrectDateFormat = (date: string) => {
  return /\d+-\d+-\d+/.test(date);
};

export default function DateField({ date, error, onChange }: DateField) {
  const { day, month, year } = extractDayMonthYearFromDate(
    checkCorrectDateFormat(date) ? date : "0000-00-00"
  );

  const monthStr = month ? MONTH[month - 1] : "";

  const handleDayChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.value.length > 2 || /\D/.test(event.currentTarget.value)) return;
    const changedDate = checkCorrectDateFormat(date) ? date : "0000-00-00";

    const newDate = changedDate.slice(0, 8) + event.currentTarget.value.padStart(2, "0");
    onChange(newDate);
  };

  const handleMonthChange = (value: string) => {
    const changedDate = checkCorrectDateFormat(date) ? date : "0000-00-00";

    const newDate =
      changedDate.slice(0, 5) +
      String(MONTH.findIndex((month) => month === value) + 1).padStart(2, "0") +
      changedDate.slice(-3);
    onChange(newDate);
  };

  const handleYearChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.value.length > 4 || /\D/.test(event.currentTarget.value)) return;
    const changedDate = checkCorrectDateFormat(date) ? date : "0000-00-00";

    const newDate = event.currentTarget.value.padStart(4, "0") + changedDate.slice(4);
    onChange(newDate);
  };

  return (
    <div>
      <div className="flex gap-2">
        <div className="w-0 flex-1">
          <Textfield
            label="Day"
            type="text"
            autocomplete="bday-day"
            value={day || ""}
            onChange={handleDayChange}
          />
        </div>
        <div className="w-0 flex-1">
          <Select
            label="Month"
            options={MONTH.map((month) => ({ id: month, label: month }))}
            title={monthStr}
            value={monthStr}
            onChange={handleMonthChange}
          />
        </div>
        <div className="w-0 flex-1">
          <Textfield
            label="Year"
            type="text"
            autocomplete="bday-year"
            value={year || ""}
            onChange={handleYearChange}
          />
        </div>
      </div>
      {error && <div className="text-error-text mt-1 text-danger">{error}</div>}
    </div>
  );
}
