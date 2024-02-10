import { SafeUser } from "@/models/auth";
import Link from "next/link";

type NavDropMenuItem = {
  label: string;
  className?: string;
  href?: string;
  onClick?: () => void;
} & (
  | { href: string; onClick?: undefined }
  | { onClick: () => void; href?: undefined }
);

export function NavBar({
  isLoggedIn,
  verified,
  user,
  menuItems,
}: {
  isLoggedIn?: boolean;
  verified?: boolean;
  user?: { username: string };
  menuItems?: NavDropMenuItem[];
}) {
  return (
    <div className="flex justify-between">
      <div className="flex p-2"></div>
      <div className="flex p-2"></div>
      <div className="flex p-2">
        {isLoggedIn ? (
          <>
            <div className="group/profile cursor-pointer" tabIndex={0}>
              {verified ? user?.username : "..."}
              <div className="group-focus/profile:flex rounded-md flex-col py-1 hidden absolute bg-neutral-50 z-20 shadow-md right-4">
                {menuItems?.map((item, i) =>
                  item.onClick ? (
                    <div
                      className={`hover:bg-neutral-200/30 p-2 px-4 ${
                        item.className || ""
                      }`}
                      onClick={item.onClick}
                      key={i}
                    >
                      {item.label}
                    </div>
                  ) : (
                    <Link href={item.href} key={i}>
                      <a
                        className={`hover:bg-neutral-200/30 p-2 px-4 ${
                          item.className || ""
                        }`}
                      >
                        {item.label}
                      </a>
                    </Link>
                  )
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            <Link href={"/login"}>Login</Link>
          </>
        )}
      </div>
    </div>
  );
}
