import { Cluster } from "@solana/web3.js";

/**
 *
 */
export type AirdropDetails = {
  network: Cluster;
  address: string;
  signature: string;
};
