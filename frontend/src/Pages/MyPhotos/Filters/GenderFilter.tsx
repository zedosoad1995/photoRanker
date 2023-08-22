import Select from "@/Components/Select";
import { GENDER } from "@shared/constants/user";

interface IGenderFilter {
  isAdmin: boolean;
  option: string;
  onChange: (value: any) => void;
}

const GenderFilter = ({ isAdmin, option, onChange }: IGenderFilter) => {
  return (
    <>
      {isAdmin && (
        <div className="w-full">
          <Select
            onChange={onChange}
            options={[
              { id: GENDER.Male, label: GENDER.Male },
              { id: GENDER.Female, label: GENDER.Female },
            ]}
            value={option}
            title="Gender"
          />
        </div>
      )}
    </>
  );
};

export default GenderFilter;
