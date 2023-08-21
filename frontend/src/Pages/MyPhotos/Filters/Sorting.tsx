import Select from "@/Components/Select";

interface ISorting {
  isAdmin: boolean;
  option: string;
  onChange: (value: any) => void;
}

const Sorting = ({ isAdmin, option, onChange }: ISorting) => {
  return (
    <div className="w-full">
      <Select
        onChange={onChange}
        options={[
          { id: "score desc", label: "Score Highest to Lowest" },
          { id: "score asc", label: "Score Lowest to Highest" },
          { id: "numVotes desc", label: "Votes Highest to Lowest" },
          { id: "numVotes asc", label: "Votes Lowest to Highest" },
          { id: "createdAt desc", label: "Creation Date Highest to Lowest" },
          { id: "createdAt asc", label: "Creation Date Lowest to Highest" },
          ...(isAdmin
            ? [
                { id: "reportedDate desc", label: "Reported Date Highest to Lowest" },
                { id: "reportedDate asc", label: "Reported Date Lowest to Highest" },
              ]
            : []),
        ]}
        value={option}
        title="Sort"
      />
    </div>
  );
};

export default Sorting;
