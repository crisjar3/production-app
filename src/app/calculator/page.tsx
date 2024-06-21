import {redirect} from "next/navigation";
import {authOptions, getAuthSession} from "@/lib/auth";
import {FormulaItems, Items} from "@/components/formula/List";
import Link from "next/link";

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
                <h1 className="font-bold text-3xl md:text-4xl">Calculadora</h1>
                <FigmaButton/>
                <Items/>
            </div>
        </div>
    );
}

function FigmaButton() {
    return (
        <Link prefetch={true} href="/calculator/quality-control"
              className="inline-flex items-center justify-center p-5 text-base font-medium text-gray-500 rounded-lg bg-gray-50 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white">
            <svg
                version="1.1"
                id="Layer_1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                x="0px"
                y="0px"
                viewBox="0 0 122.88 122.75"
                style={{enableBackground: 'new 0 0 122.88 122.75'}}
                width="25px"
                height="25px"
                xmlSpace="preserve"
            >
                <style type="text/css">
                    {`.st0{fill-rule:evenodd;clip-rule:evenodd;}`}
                </style>
                <g>
                    <path
                        className="st0"
                        d="M49.02,52.21l8.55,8.14L72.3,45.39c1.46-1.48,2.37-2.67,4.17-0.82l5.83,5.97
          c1.92,1.89,1.82,3,0.01,4.76L60.9,76.32c-3.81,3.73-3.14,3.96-7.01,0.13L39.21,61.84c-0.8-0.87-0.72-1.75,0.16-2.62
          l6.77-7.02C47.15,51.13,47.97,51.2,49.02,52.21L49.02,52.21L49.02,52.21z M92.46,8.97c-1.35-0.94-2.88-1.35-4.44-1.04
          c-1.56,0.31-2.88,1.15-3.82,2.46l-5.27,7.43c-1.87-0.83-3.82-1.46-5.9-1.98c-2.08-0.52-4.03-0.94-6.11-1.25l-1.67-9.72
          c-0.31-1.67-1.15-2.88-2.36-3.82c-1.35-0.94-2.78-1.25-4.44-0.94L46.27,2.3c-1.56,0.31-2.78,1.04-3.82,2.39
          c-0.94,1.35-1.35,2.78-1.04,4.44l1.56,8.88c-1.98,0.83-3.82,1.77-5.59,2.88c-1.77,1.04-3.5,2.29-5.07,3.5l-8.26-5.69
          c-1.35-0.94-2.78-1.35-4.34-1.04c-1.56,0.31-2.88,1.15-3.82,2.5L8.86,30.21c-0.94,1.35-1.35,2.88-1.04,4.44
          c0.31,1.67,1.15,2.88,2.5,3.82l7.43,5.27c-0.83,1.87-1.46,3.82-1.98,5.9c-0.52,2.08-0.94,4.03-1.25,6.11L4.8,57.42
          c-8.24,1.55-3.58,13.36-2.57,18.98c0.31,1.56,1.04,2.78,2.36,3.82c1.35,0.94,2.78,1.35,4.44,1.04l8.88-1.56
          c0.83,1.98,1.77,3.82,2.88,5.59c1.04,1.77,2.29,3.5,3.5,5.17l-5.69,8.16c-0.94,1.35-1.35,2.78-1.04,4.34
          c0.31,1.56,1.14,2.88,2.46,3.82l10.13,7.11c1.35,0.94,2.88,1.25,4.44,0.94c1.56-0.31,2.88-1.04,3.92-2.36l5.28-7.53
          c1.87,0.83,3.82,1.46,5.9,1.98c2.08,0.52,4.02,0.94,6.11,1.25l1.67,9.72c0.31,1.67,1.15,2.88,2.36,3.82
          c1.35,0.94,2.78,1.25,4.44,0.94l12.18-2.19c1.56-0.31,2.78-1.04,3.82-2.36c0.94-1.35,1.35-2.78,1.04-4.44l-1.56-8.88
          c1.98-0.83,3.82-1.77,5.59-2.88c1.77-1.04,3.51-2.26,5.17-3.5l8.16,5.69c1.35,0.94,2.78,1.35,4.44,1.04
          c1.67-0.31,2.88-1.15,3.82-2.46l7.11-10.14c0.94-1.35,1.25-2.88,0.94-4.44c-0.31-1.56-1.04-2.88-2.39-3.92l-7.53-5.17
          c0.83-1.87,1.46-3.82,1.98-5.9c0.52-2.08,0.94-4.03,1.25-6.11l9.72-1.67c1.67-0.31,2.88-1.15,3.82-2.39
          c0.94-1.35,1.25-2.78,0.94-4.44l-2.19-12.18c-0.31-1.56-1.04-2.78-2.36-3.82c-1.35-0.94-2.78-1.35-4.44-1.04l-8.88,1.56
          c-0.83-1.87-1.77-3.71-2.88-5.59c-1.04-1.87-2.29-3.5-3.5-5.07l5.69-8.26c0.94-1.35,1.35-2.78,1.04-4.34
          c-0.31-1.56-1.15-2.88-2.46-3.82L92.74,8.86L92.46,8.97L92.46,8.97L92.46,8.97z M55.42,28.78c4.39-0.72,8.84-0.72,13.23,0.29
          c4.25,1,8.12,2.72,11.65,5.11c3.39,2.44,6.4,5.54,8.84,9.26c2.44,3.68,3.97,7.84,4.68,12.23c0.72,4.39,0.72,8.84-0.29,13.23
          c-1,4.25-2.72,8.12-5.11,11.65c-2.44,3.39-5.54,6.4-9.27,8.84c-3.68,2.44-7.84,3.97-12.23,4.68c-4.39,0.72-8.84,0.72-13.23-0.29
          c-4.25-1-8.12-2.72-11.65-5.11c-3.39-2.44-6.4-5.54-8.84-9.26c-2.44-3.68-3.97-7.84-4.68-12.23c-0.72-4.39-0.72-8.84,0.29-13.23
          c1-4.25,2.72-8.12,5.11-11.65c2.44-3.39,5.54-6.4,9.27-8.84C46.92,31.07,51.02,29.49,55.42,28.78L55.42,28.78L55.42,28.78z"
                    />
                </g>
            </svg>

            <span className="w-full ml-1">Calcular Control de Calidad</span>
            <svg className="w-4 h-4 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                 fill="none" viewBox="0 0 14 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M1 5h12m0 0L9 1m4 4L9 9"/>
            </svg>
        </Link>
    );
}
