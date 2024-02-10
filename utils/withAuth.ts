import { GetServerSideProps, GetServerSidePropsResult } from "next";
import jwt from "jsonwebtoken";
import { parse } from "cookie";
import { SafeUser } from "@/models/auth";
type AuthConfig = {
  redirect?: string | false;
  isLoginPage?: boolean;
};
type ContextFunction = (
  context: Parameters<GetServerSideProps>[0] & { user?: SafeUser }
) => Promise<GetServerSidePropsResult<any>>;
export function withAuth(config?: AuthConfig): ContextFunction;
export function withAuth(
  getServerSidePropsFunc?: ContextFunction,
  config?: AuthConfig
): ContextFunction;
export function withAuth(
  arg1?: ContextFunction | AuthConfig,
  arg2?: AuthConfig
) {
  const config =
    typeof arg1 !== "undefined"
      ? typeof arg1 === "object"
        ? arg1
        : arg2 || {
            redirect: false,
            isLoginPage: false,
          }
      : undefined;
  const getServerSidePropsFunc =
    typeof arg1 === "function" ? (arg1 as ContextFunction) : undefined;
  return async (context: Parameters<GetServerSideProps>[0]) => {
    const { req } = context;
    const cookies = parse(req.headers.cookie || "");
    const token = cookies.token || null;
    let result = ((await getServerSidePropsFunc?.({
      ...context,
    } as any)) as any) || { props: {} };
    let isLogged = false;
    if (token && process.env.SECRET) {
      try {
        const decoded = jwt.verify(token, process.env.SECRET);
        result.props = { ...result.props, user: decoded };
        isLogged = true;
      } catch (error) {}
    }
    if (
      config?.redirect &&
      ((isLogged && config.isLoginPage) || (!isLogged && !config.isLoginPage))
    ) {
      const [, q] = req.url?.split("?") || [];
      const qs = q?.split("&") || [];
      const haveContinueQ = qs.find((f) => f.indexOf("continue") >= 0);
      console.log("qs", q, qs, haveContinueQ);
      let destination =
        config.redirect +
        "?" +
        [
          ...qs.filter((f) => f.indexOf("continue") < 0),
          !haveContinueQ &&
            req.url &&
            `continue=${encodeURIComponent(req.url)}`,
        ]
          .filter((f) => f)
          .join("&");
      console.log("destination1", destination);
      if (haveContinueQ && config.isLoginPage) {
        const path = decodeURIComponent(haveContinueQ.split("=")[1] || "/");
        destination = path;
      }
      console.log("destination2", destination);
      result.redirect = {
        destination,
      };
    }
    return { ...result };
  };
}
