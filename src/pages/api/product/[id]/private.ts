import type { product } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { selectAllProductInfo } from "../../../../../prisma/helpers";
import db from "../../../../../prisma/prisma-client";
import getAccountFromRequest from "../../../../utils/api/get-account-from-request";

export type PrivateProductDBRes = Awaited<ReturnType<typeof getPrivateProductInfo>>;

export type PrivateProductRes = Omit<
  NonNullable<PrivateProductDBRes>,
  "product"
> & {
  public: (Omit<product, "publish_date"> & { publish_date: string | null }) | null;
};

function getPrivateProductInfo(id: number) {
  return db.product.findUnique({
    where: { id },
    select: selectAllProductInfo,
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PrivateProductDBRes | string>
) {
  if (!req.query.id || typeof req.query.id !== "string")
    return res.status(400).send("Product ID is required.");

  try {
    const id = parseInt(req.query.id);
    const currentAccount = await getAccountFromRequest(req, res);
    if (!currentAccount) return;

    const authorized = currentAccount.is_admin || currentAccount.member;
    if (!authorized)
      return res
        .status(401)
        .send("You are not authorized to view this product's private information.");

    const product = await getPrivateProductInfo(id);
    if (!product) return res.status(400).send("Product not found. ID: " + id);

    return res.status(200).send(product);
  } catch (e: any) {
    return res.status(500).send({ ...e, message: e.message }); // prisma error messages are getters
  }
}
