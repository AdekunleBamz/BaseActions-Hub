"use client";

import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { CONTRACTS, ACTION_COST } from "@/config/contracts";
import { BaseActionsHubABI } from "@/config/abis";

export function useSignGuestbook() {
  const { data: hash, writeContract, isPending, error, reset } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const signGuestbook = (owner: string, message: string) => {
    writeContract({
      address: CONTRACTS.BaseActionsHub,
      abi: BaseActionsHubABI,
      functionName: "signGuestbook",
      args: [owner as `0x${string}`, message],
      value: ACTION_COST,
    });
  };

  return {
    signGuestbook,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
    reset,
  };
}
