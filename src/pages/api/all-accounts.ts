import type { NextApiRequest, NextApiResponse } from "next";
import { includeAllAccountInfo } from "../../../prisma/helpers";
import db from "../../../prisma/prisma-client";
import getAccountFromRequest from "../../utils/api/get-account-from-request";
import type { AccountRes } from "./account/[id]";

function getAllAccounts(): Promise<AccountRes[]> {
  return db.account.findMany({
    include: includeAllAccountInfo,
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AccountRes[] | string>
) {
  try {
    const currentUser = await getAccountFromRequest(req, res);
    if (!currentUser) return;
    if (!currentUser.is_admin)
      return res.status(401).send("You are not authorized to view account information.");

    const accounts = await getAllAccounts();
    return res.status(200).send(accounts);
  } catch (e: any) {
    return res.status(500).send({ ...e, message: e.message }); // prisma error messages are getters
  }
}
