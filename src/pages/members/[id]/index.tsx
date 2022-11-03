import { useRouter } from "next/router";
import type { NextPage } from "next/types";
import { useContext, useEffect } from "react";
import { AccountCtx } from "../../../services/context/account-ctx";
import CardSkeleton from "../../../components/loading/card-skeleton";
import PageRoutes from "../../../routing/page-routes";

const PrivateMemberPage: NextPage = () => {
  const router = useRouter();
  const { localAccount, loading } = useContext(AccountCtx);
  const { id: idString } = router.query;

  useEffect(() => {
    if (!(typeof idString === "string")) {
      router.replace(PageRoutes._404);
      return;
    }
    if (loading) return;

    const id = parseInt(idString);

    if (localAccount?.is_admin) {
      router.replace(PageRoutes.privateMemberProfile(id));
      return;
    }

    router.replace(PageRoutes.publicMemberProfile(id));
  }, [localAccount, loading, idString, router]);

  return <CardSkeleton />;
};

export default PrivateMemberPage;