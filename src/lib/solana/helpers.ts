import { Cluster } from "@solana/web3.js";

/**
 * Correctly format Solana details to the desired explorer
 */
export function solanaExplorerLink(
  type: "transaction" | "tx" | "account" | "token",
  value: string,
  cluster: Cluster = "mainnet-beta",
) {
  let route = "";

  if (type == "transaction" || type == "tx") {
    route = `/tx/${value}`;
  } else if (type == "account" || type == "token") {
    route = `/address/${value}`;
  }

  const url = new URL(route, "https://solana.fm");

  if (cluster == "devnet") {
    url.searchParams.set("cluster", "devnet-solana");
  } else if (cluster == "testnet") {
    url.searchParams.set("cluster", "testnet-solana");
  } else {
    url.searchParams.set("cluster", "mainnet-alpha");
  }

  return url.toString();
}
