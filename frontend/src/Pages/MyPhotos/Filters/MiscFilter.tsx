import Select from "@/Components/Select";

interface IMiscFilter {
  isAdmin: boolean;
  option: string;
  onChange: (value: any) => void;
}

const MiscFilter = ({ isAdmin, option, onChange }: IMiscFilter) => {
  return (
    <>
      {isAdmin && (
        <div className="w-full">
          <Select
            onChange={onChange}
            options={[
              { id: "belongsToMe", label: "My Pictures" },
              { id: "hasReport", label: "Reported Pictures" },
              { id: "isBanned", label: "Banned Users" },
            ]}
            value={option}
            title="Filters"
          />
        </div>
      )}
    </>
  );
};

export default MiscFilter;
