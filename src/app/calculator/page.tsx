import { redirect } from "next/navigation";

import { UserNameForm } from "@/components/UserNameForm";
import { authOptions, getAuthSession } from "@/lib/auth";

export const metadata = {
  title: "Calculator",
  description: "See al methods availables to calculate formula.",
};

export default async function SettingsPage() {
  const session = await getAuthSession();

  if (!session?.user) {
    redirect(authOptions?.pages?.signIn || "/login");
  }

  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="grid items-start gap-8">
        <h1 className="font-bold text-3xl md:text-4xl">Calculator</h1>

        <div className="grid gap-10">
          <Items />
        </div>
      </div>
    </div>
  );
}

const Items = () => {
  return (
    <div className="rounded-md bg-white shadow">
      <div className="px-6 py-4 flex justify-between">
        <div className="w-0 flex-1">
          <div className="max-h-40 mt-1 text-xs text-gray-500">
            <a
              className="underline text-zinc-900 text-sm underline-offset-2"
              href={`/calculator`}
            >
              Calculator
            </a>
            <span className="px-1">•</span>
            <span>Method:</span>{" "}
          </div>
          <a href={`/calculator/method/eoq`}>
            <h1 className="text-lg font-semibold py-2 leading-6 text-gray-900">
              EOQ
            </h1>
          </a>
        </div>
      </div>
    </div>
  );
};
