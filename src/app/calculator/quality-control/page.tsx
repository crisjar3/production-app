import {Items} from "@/components/formula/Quality/List";
import {authOptions, getAuthSession} from "@/lib/auth";
import {redirect} from "next/navigation";

export default async function QualityControl() {
    const session = await getAuthSession();

    if (!session?.user) {
        redirect(authOptions?.pages?.signIn || "/login");
    }

    return (
        <Items/>
    )
}

