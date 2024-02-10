import { apiUrl, useApi } from "@/hooks/useApi";
import { LoginFormDataType, LoginSuccessResponse } from "@/models/auth";
import { withAuth } from "@/utils/withAuth";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

export const getServerSideProps = withAuth({
  redirect: "/",
  isLoginPage: true,
});
export default function LoginPage() {
  const authApi = useApi<LoginFormDataType>(apiUrl("auth/login"));
  const { register, handleSubmit } = useForm<LoginFormDataType>({
    defaultValues: {
      username: "",
      password: "",
      remember: false,
    },
  });
  const router = useRouter();
  const onSubmit = async (data: LoginFormDataType) => {
    try {
      const res = await authApi.post<LoginSuccessResponse>(data);
      router.replace(
        router.query.continue
          ? decodeURIComponent(String(router.query.continue))
          : "/"
      );
    } catch (error) {}
  };
  return (
    <div className="flex absolute w-full h-full top-0 items-center justify-center">
      <form
        className="flex flex-col shadow-xl rounded-lg"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="px-4 p-2 flex">
          <div className="font-medium">Login</div>
        </div>
        <div className="px-4 p-2 flex flex-col space-y-2">
          <div className="flex flex-col">
            <input
              type="text"
              className="w-full rounded-md border p-2 px-4 disabled:opacity-50"
              placeholder="Username"
              disabled={authApi.loading}
              {...register("username")}
            />
          </div>
          <div className="flex flex-col">
            <input
              type="password"
              className="w-full rounded-md border p-2 px-4 disabled:opacity-50"
              placeholder="Password"
              disabled={authApi.loading}
              {...register("password")}
            />
          </div>
          <div className="flex flex-col justify-end">
            <label className="flex items-center justify-end space-x-1 text-neutral-500">
              <input
                type="checkbox"
                className="flex w-3 h-3"
                disabled={authApi.loading}
                {...register("remember")}
              />
              <span className="text-sm">remember me</span>
            </label>
          </div>
        </div>
        <div className="px-4 p-2 flex">
          <button
            type="submit"
            className="rounded-md p-1 px-2 bg-neutral-200 disabled:opacity-50 disabled:cursor-default"
            disabled={authApi.loading}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
