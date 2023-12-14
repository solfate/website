"use client";

import { memo, useCallback, useState } from "react";
import toast from "react-hot-toast";
import {
  Connection,
  PublicKey,
  LAMPORTS_PER_SOL,
  clusterApiUrl,
  Cluster,
} from "@solana/web3.js";
import { AirdropDetails } from "@/types/tools";
import { AirdropDetailsCard } from "./AirdropDetailsCard";

export const AirdropRequestForm = memo(() => {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<AirdropDetails[]>([]);

  const getNetworkURL = useCallback((network: Cluster) => {
    // process the accepted networks
    switch (network) {
      case "devnet":
        return clusterApiUrl("devnet");
      case "testnet":
        return clusterApiUrl("testnet");
      case "mainnet-beta":
        alert("Ha, you wish!");
        return clusterApiUrl("devnet");
      default:
        return clusterApiUrl("devnet");
    }
  }, []);

  /*
  Function to airdrop to the entered wallet address and selected cluster
*/
  const airdropSol = useCallback(
    async (network: Cluster) => {
      // reset the current state
      setLoading(true);
      setTransactions([]);

      // init a blank signature
      let signature = "";

      try {
        // create a new cluster Connection
        const connection = new Connection(getNetworkURL(network));

        // create an Public key from the string address
        const publicKey = new PublicKey(address.toString().trim());

        // if (!publicKey) throw Error("Request for airdrop failed");

        signature = await connection
          .requestAirdrop(publicKey, LAMPORTS_PER_SOL)
          .catch((err) => {
            console.log(err);

            if (err.message.toString().includes("429")) {
              throw Error(
                "Slow down there tiger, rate limit exceeded! Try again later :)",
              );
            }

            throw Error("Request for airdrop failed");
          });

        await connection
          .confirmTransaction(signature, "confirmed")
          .catch((err) => {
            throw Error("Transaction failed to confirm");
          });

        // update the state to notify the user of the confirmed
        setTransactions(() => [{ network, address, signature }]);

        console.log("Airdrop successful:", signature);

        toast.success("Airdrop successful!");
      } catch (err: any) {
        console.warn("error:", `Airdrop failed! ${err?.message}`, signature);
        toast.error(err?.message || "Airdrop failed...");
      }

      setLoading(false);
    },
    [address, setLoading, setTransactions, getNetworkURL],
  );

  return (
    <section className="max-w-2xl mx-auto space-y-8">
      <div className="relative block text-center">
        {loading && <div className="absolute right-3 bottom-3 loader"></div>}

        <input
          type="text"
          value={address}
          required={true}
          disabled={loading}
          placeholder="Enter a Solana wallet address"
          className={"input w-[32rem] max-w-full tracking-wide text-center"}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>

      <p className="mx-auto text-gray-700 text-center">
        airdrop{" "}
        <span className="text-black font-semibold shadow-hot-pink">1 sol</span>{" "}
        on
      </p>

      <div className="grid justify-center grid-cols-2 gap-3 md:flex md:space-x-6">
        <button
          type="button"
          disabled={loading}
          className={"btn btn-lg btn-ghost justify-center"}
          onClick={() => airdropSol("testnet")}
        >
          Testnet
        </button>

        <button
          type="button"
          disabled={loading}
          className={
            "row-start-1 col-span-2 btn btn-lg btn-hot-pink justify-center"
          }
          onClick={() => airdropSol("devnet")}
        >
          Devnet
        </button>

        <button
          type="button"
          disabled={loading}
          className={"btn btn-lg btn-ghost justify-center"}
          onClick={() => alert("Ha, you wish ;)")}
        >
          Mainnet?
        </button>
      </div>

      <section className="">
        {transactions.map((tx, id) => (
          <AirdropDetailsCard tx={tx} key={id} />
        ))}
      </section>
    </section>
  );
});
