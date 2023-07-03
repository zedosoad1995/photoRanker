import Select from "@/components/Select";
import Textfield from "@/components/TextField";
import { COUNTRIES, ETHNICITY } from "../../../../backend/src/constants/user";
import DateField from "@/components/DateField";

export default function PersonalInfoForm() {
  return (
    <>
      <Select label="Ethnicity" options={ETHNICITY} />
      <Select label="Country of Origin" options={COUNTRIES} />
      <DateField label="Date of Birth" />
    </>
  );
}
