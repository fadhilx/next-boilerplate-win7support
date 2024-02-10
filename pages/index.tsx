import { apiUrl, useApi } from "@/hooks/useApi";
import { SafeUser } from "@/models/auth";
import { withAuth } from "@/utils/withAuth";
import { useRouter } from "next/router";
import { useEffect } from "react";

export const getServerSideProps = withAuth({
  redirect: "/login",
});
export default function Home({ user }: { user: SafeUser }) {
  return <div className="flex flex-col">logged</div>;
}
