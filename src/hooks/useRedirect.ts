import { useRouter } from "next/router";
import { useEffect } from "react";

export const useRedirect = ({ isAuth = true, path = "/" } = {}) => {
  console.log({ isAuth });
  const { push } = useRouter();
  useEffect(() => {
    if (!isAuth) {
      void push(path);
    }
  }, [isAuth, path, push]);
};
