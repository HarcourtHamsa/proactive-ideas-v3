import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";

function useAuth() {
  const auth = useSelector((state: RootState) => state.auth);
  return auth?.auth?.user;
}

export default useAuth;
