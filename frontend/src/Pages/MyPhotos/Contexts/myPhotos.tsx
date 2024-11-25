import { IMode, Mode } from "@/Constants/mode";
import { useStateRef } from "@/Hooks/useStateRef";
import { getManyPictures, getUploadPermission } from "@/Services/picture";
import { IPictureWithPercentile } from "@/Types/picture";
import { IUser } from "@/Types/user";
import { isAdmin } from "@/Utils/role";
import { createContext, useContext, useEffect, useReducer } from "react";
import { usePhotos } from "@/Contexts/photos";
import {
  FILTER_SELECT,
  GENDER,
  MAX_AGE,
  MIN_AGE,
  SORT_VALUE,
} from "@/Constants/localStorageKeys";

export interface MyPhotosState {
  picUrls?: string[];
  picsInfo?: IPictureWithPercentile[];
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

export const MyPhotosProvider = ({
  children,
  loggedUser,
  mode,
}: IMyPhotosProvider) => {
  const {
    picUrls,
    picsInfo,
    setPicUrls,
    setPicsInfo,
    nextCursor,
    setNextCursor,
  } = usePhotos(mode);

  const [isLoadingMoreImages, updateLoadingMoreImages] = useStateRef(false);

  const initialState: MyPhotosState = {
    picUrls,
    picsInfo,
    nextCursor,
    isSet: false,
    filterSelect: localStorage.getItem(FILTER_SELECT(mode)) || "",
    sortValue: localStorage.getItem(SORT_VALUE(mode)) || DEFAULT_SORT,
    gender: localStorage.getItem(GENDER(mode)) || undefined,
    minAge: Number(localStorage.getItem(MIN_AGE(mode))) || undefined,
    maxAge: Number(localStorage.getItem(MAX_AGE(mode))) || undefined,
    hasReachedPicsLimit: false,
    isFetchingFilter: false,
  };

  function setterReducer(state: MyPhotosState, action: MyPhotosAction) {
    if (typeof action.value === "function") {
      return { ...state, [action.key]: action.value(state[action.key]) };
    }

    if (
      ["sortValue", "filterSelect", "gender", "minAge", "maxAge"].includes(
        action.key
      )
    ) {
      localStorage.setItem(action.key + " " + mode, action.value);
    }

    return { ...state, [action.key]: action.value };
  }

  const [state, dispatch] = useReducer(setterReducer, initialState);

  useEffect(() => {
    setPicUrls(state.picUrls);
  }, [state.picUrls]);

  useEffect(() => {
    setPicsInfo(state.picsInfo);
  }, [state.picsInfo]);

  useEffect(() => {
    setNextCursor(state.nextCursor);
  }, [state.nextCursor]);

  const getPictures = async (cursor?: string) => {
    dispatch({ key: "isSet", value: false });

    try {
      if (!loggedUser) return;

      const orderByKey = state.sortValue.split(" ")[0];
      const orderByDir = state.sortValue.split(" ")[1];

      return getManyPictures({
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
      }).then((res) => {
        dispatch({ key: "nextCursor", value: res.nextCursor });

        dispatch({
          key: "picUrls",
          value: cursor
            ? [
                ...new Set([
                  ...(state.picUrls ?? []),
                  ...res.pictures.map(({ url }) => url),
                ]),
              ]
            : res.pictures.map(({ url }) => url),
        });

        dispatch({
          key: "picsInfo",
          value: cursor
            ? [
                ...new Set([
                  ...(state.picsInfo?.map((row) => JSON.stringify(row)) ?? []),
                  ...res.pictures.map((pic) => JSON.stringify(pic)),
                ]),
              ].map((row) => JSON.parse(row))
            : res.pictures.map((pic) => pic),
        });
      });
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
