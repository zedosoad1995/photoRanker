import { IPictureWithPercentile } from "@/Types/picture";
import { createContext, useContext, useReducer } from "react";

export interface MyPhotosState {
  picUrls: string[];
  picsInfo: IPictureWithPercentile[];
  nextCursor?: string;
  isSet: boolean;
  filterSelect: string;
  sortValue: string;
  gender?: string;
  minAge?: number;
  maxAge?: number;
}

export interface MyPhotosAction {
  key: keyof MyPhotosState;
  value: any;
}

interface IMyPhotosContext {
  state: MyPhotosState;
  dispatch: React.Dispatch<MyPhotosAction>;
}
const MyPhotosContext = createContext<IMyPhotosContext>({} as IMyPhotosContext);

interface IMyPhotosProvider {
  children: React.ReactNode;
}

export const DEFAULT_SORT = "score desc";

export const MyPhotosProvider = ({ children }: IMyPhotosProvider) => {
  const initialState: MyPhotosState = {
    picUrls: [],
    picsInfo: [],
    nextCursor: undefined,
    isSet: false,
    filterSelect: "",
    sortValue: DEFAULT_SORT,
    gender: undefined,
    minAge: undefined,
    maxAge: undefined,
  };

  function setterReducer(state: MyPhotosState, action: MyPhotosAction) {
    return { ...state, [action.key]: action.value };
  }

  const [state, dispatch] = useReducer(setterReducer, initialState);

  return (
    <MyPhotosContext.Provider value={{ state, dispatch }}>{children}</MyPhotosContext.Provider>
  );
};

export const useMyPhotos = () => useContext(MyPhotosContext);
