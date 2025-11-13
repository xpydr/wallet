
/* eslint-disable @typescript-eslint/no-explicit-any */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { createWallet } from "@/hooks/createWallet";
import { ethers } from "ethers";

vi.mock("ethers", async () => {
  const actual = await vi.importActual<typeof import("ethers")>("ethers");

  return {
    ...actual,
    ethers: {
      randomBytes: vi.fn(),
      Mnemonic: {
        fromEntropy: vi.fn(),
      },
      Wallet: {
        fromPhrase: vi.fn(),
      }
    }
  }
});

describe("createWallet", () => {
  const mockWallet = {
    address: "0x000000000000000000000000000000000000dEaD",
    encrypt: vi.fn(),
  }
  
  const wordCount = 12;
  const password = "secret";
  const mockMnemonic = "words...";

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("creates wallet and returns wallet address, mnemonic and balance", async () => {
    (ethers.randomBytes as any).mockReturnValue("mock-entropy");
    (ethers.Mnemonic.fromEntropy as any).mockReturnValue({ phrase: mockMnemonic });
    (ethers.Wallet.fromPhrase as any).mockReturnValue(mockWallet);
    mockWallet.encrypt.mockResolvedValue("mock-keystore-json");

    const result = await createWallet(wordCount, password);

    expect(result).toEqual({
      address: mockWallet.address,
      balance: 0,
      mnemonic: mockMnemonic,
    });

    expect(localStorage.getItem("walletKeystore")).toBe("mock-keystore-json");

    expect(ethers.randomBytes).toHaveBeenCalledWith(16); // 128 bits / 8, from 12 word mnemonic
    expect(ethers.Mnemonic.fromEntropy).toHaveBeenCalledWith("mock-entropy");
    expect(ethers.Wallet.fromPhrase).toHaveBeenCalledWith(mockMnemonic);
    expect(mockWallet.encrypt).toHaveBeenCalledWith(password);
  });

  it("throws error for invalid word count", async () => {
    const result = await createWallet(99 as any, "pass");
    expect(result).toBeNull();
  });

  it("returns null if wallet.encrypt throws", async () => {
    (ethers.randomBytes as any).mockReturnValue("mock-entropy");
    (ethers.Mnemonic.fromEntropy as any).mockReturnValue({ phrase: mockMnemonic });
    (ethers.Wallet.fromPhrase as any).mockReturnValue(mockWallet);
    mockWallet.encrypt.mockRejectedValue(new Error("encryption failed"));

    const result = await createWallet(wordCount, password);
    expect(result).toBeNull();
  });
});
