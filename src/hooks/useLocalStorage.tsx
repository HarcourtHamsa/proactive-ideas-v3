import { useDispatch } from "react-redux";
import { setGeoData } from "@/features/geo/geoSlice";

function useLocalStorage() {
  const dispatch = useDispatch();

  const setData = (key: string, value: any) => {
    if (typeof window !== 'undefined') {
      localStorage?.setItem(key, JSON.stringify(value));
      dispatch(setGeoData(value));
    }
  };

  const getData = (key: string) => {
    if (typeof window !== 'undefined') {
      const data = localStorage?.getItem(key);

      if (data === null || data === undefined) {
        return null;
      }


      return JSON.parse(data); // Parse the stored JSON data back to an object
    }

    return null;
  };

  return { setData, getData };
}

export default useLocalStorage;
