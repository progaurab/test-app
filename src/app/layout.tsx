"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useMsal } from "@azure/msal-react";

const tabs = [
  { name: "TTT", groupId: "group-id-1" },
  { name: "Ultron", groupId: "group-id-2" },
  { name: "TTT Cache", groupId: "group-id-3" },
  { name: "DA AU", groupId: "group-id-4" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { instance, accounts } = useMsal();
  const [userGroups, setUserGroups] = useState<string[]>([]);

  useEffect(() => {
    if (pathname === "/") {
      router.push("/ttt");
    }
  }, [pathname, router]);

  useEffect(() => {
    const fetchUserGroups = async () => {
      if (accounts.length > 0) {
        const accessToken = await instance.acquireTokenSilent({
          scopes: ["User.Read"],
          account: accounts[0],
        });

        const response = await fetch("https://graph.microsoft.com/v1.0/me/memberOf", {
          headers: { Authorization: `Bearer ${accessToken.accessToken}` },
        });
        const data = await response.json();
        const groups = data.value.map((group: any) => group.id);
        setUserGroups(groups);
      }
    };

    fetchUserGroups();
  }, [accounts, instance]);

  return (
    <html lang="en">
      <body>
        <div className="p-4">
          <nav className="flex space-x-4 border-b pb-2">
            {tabs
              .filter((tab) => userGroups.includes(tab.groupId))
              .map((tab) => (
                <button
                  key={tab.name}
                  className={`p-2 ${pathname === `/${tab.name.toLowerCase()}` ? "font-bold" : ""}`}
                  onClick={() => router.push(`/${tab.name.toLowerCase()}`)}
                >
                  {tab.name}
                </button>
              ))}
          </nav>
          <div>{children}</div>
        </div>
      </body>
    </html>
  );
}
