import { IMode, Mode } from "@/Constants/mode";
import { useStateRef } from "@/Hooks/useStateRef";
import { getManyPictures, getUploadPermission } from "@/Services/picture";
import { IPictureWithPercentile } from "@/Types/picture";
import { IUser } from "@/Types/user";
import { isAdmin } from "@/Utils/role";
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
  hasReachedPicsLimit: boolean;
  isFetchingFilter: boolean;
}

export interface MyPhotosAction {
  key: keyof MyPhotosState;
  value: any;
}

interface IMyPhotosContext {
  state: MyPhotosState;
  dispatch: React.Dispatch<MyPhotosAction>;
  isLoadingMoreImages: {
    readonly state: boolean;
    readonly ref: boolean;
  };
  updateLoadingMoreImages: (val: boolean) => void;
  getPictures: (cursor?: string) => Promise<void>;
  checkCanUploadMorePics: () => Promise<boolean>;
}
const MyPhotosContext = createContext<IMyPhotosContext>({} as IMyPhotosContext);

interface IMyPhotosProvider {
  children: React.ReactNode;
  loggedUser?: IUser;
  mode: IMode;
}

export const DEFAULT_SORT = "score desc";

export const MyPhotosProvider = ({ children, loggedUser, mode }: IMyPhotosProvider) => {
  const [isLoadingMoreImages, updateLoadingMoreImages] = useStateRef(false);

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
    hasReachedPicsLimit: false,
    isFetchingFilter: false,
  };

  function setterReducer(state: MyPhotosState, action: MyPhotosAction) {
    if (typeof action.value === "function") {
      return { ...state, [action.key]: action.value(state[action.key]) };
    }

    return { ...state, [action.key]: action.value };
  }

  const [state, dispatch] = useReducer(setterReducer, initialState);

  const getPictures = async (cursor?: string) => {
    try {
      if (!loggedUser) return;

      const orderByKey = state.sortValue.split(" ")[0];
      const orderByDir = state.sortValue.split(" ")[1];

      const res = await getManyPictures({
        ...(isAdmin(loggedUser.role) ? {} : { userId: loggedUser.id }),
        ...(state.filterSelect ? { [state.filterSelect]: true } : {}),
        ...(mode === Mode.Personal ? { isGlobal: false } : {}),
        gender: state.gender,
        orderBy: orderByKey,
        minAge: state.minAge,
        maxAge: state.maxAge,
        orderByDir,
        limit: 30,
        cursor,
      }).then(async (res) => {
        dispatch({ key: "nextCursor", value: res.nextCursor });

        dispatch({
          key: "picUrls",
          value: cursor
            ? [...new Set([...state.picUrls, ...res.pictures.map(({ url }) => url)])]
            : res.pictures.map(({ url }) => url),
        });

        dispatch({
          key: "picsInfo",
          value: cursor
            ? [
                ...new Set([
                  ...state.picsInfo.map((row) => JSON.stringify(row)),
                  ...res.pictures.map((pic) => JSON.stringify(pic)),
                ]),
              ].map((row) => JSON.parse(row))
            : res.pictures.map((pic) => pic),
        });
      });

      return res;
    } finally {
      checkCanUploadMorePics();
      updateLoadingMoreImages(false);
      dispatch({ key: "isFetchingFilter", value: false });
      dispatch({ key: "isSet", value: true });
    }
  };

  const checkCanUploadMorePics = async () => {
    return getUploadPermission().then(({ canUploadMore }) => {
      dispatch({ key: "hasReachedPicsLimit", value: !canUploadMore });
      return canUploadMore;
    });
  };

  return (
    <MyPhotosContext.Provider
      value={{
        state,
        dispatch,
        isLoadingMoreImages,
        updateLoadingMoreImages,
        getPictures,
        checkCanUploadMorePics,
      }}
    >
      {children}
    </MyPhotosContext.Provider>
  );
};

export const useMyPhotos = () => useContext(MyPhotosContext);
