import Select from "@/Components/AutoCompleteSelect";
import { getAdminPhotos, updateAdminPhoto } from "@/Services/picture";
import { IAdminPhoto } from "@/Types/picture";
import { loadImage } from "@/Utils/image";
import { COUNTRIES, ETHNICITY } from "@shared/constants/user";
import { useEffect, useState } from "react";

export const AdminPhotos = () => {
  const [pics, setPics] = useState<IAdminPhoto[]>();

  useEffect(() => {
    getAdminPhotos().then(async ({ pictures }) => {
      await Promise.all(pictures.map((pic) => loadImage(pic.url)));
      setPics(pictures);
    });
  }, []);

  const handleCountryChange = (index: number) => (value: string) => {
    setPics((pics) => {
      if (!pics) return;

      updateAdminPhoto(pics[index].id, { countryOfOrigin: value });

      return [
        ...pics?.slice(0, index),
        { ...pics[index], countryOfOrigin: value },
        ...pics?.slice(index + 1),
      ];
    });
  };

  const handleEthnicityChange = (index: number) => (value: string) => {
    setPics((pics) => {
      if (!pics) return;

      updateAdminPhoto(pics[index].id, { ethnicity: value });

      return [
        ...pics?.slice(0, index),
        { ...pics[index], ethnicity: value },
        ...pics?.slice(index + 1),
      ];
    });
  };

  return (
    <div className="">
      {pics?.map(({ id, url, countryOfOrigin, ethnicity }, index) => (
        <div key={id} className="flex">
          <img src={url} className="w-52" />
          <Select
            label="Country of Origin"
            options={COUNTRIES}
            value={countryOfOrigin ?? ""}
            onChange={handleCountryChange(index)}
          />
          <Select
            label="Ethnicity"
            options={ETHNICITY}
            value={ethnicity ?? ""}
            onChange={handleEthnicityChange(index)}
          />
        </div>
      ))}
    </div>
  );
};
