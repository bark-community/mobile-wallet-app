export interface Routes {
  home: string;
  wallet: {
    setup: string;
    createdSuccessfully: string;
    import: {
      options: string;
      seedPhrase: string;
    };
    restore: {
      seedPhrase: string;
      wallet: string;
    };
    seedPhrase: string;
    confirmSeedPhrase: string;
  };
  send: {
    options: string;
    confirmation: string;
    ethereum: string;
    solana: string;
    bark: string;
  };
  receive: string;
  settings: string;
}

export const ROUTES: Routes = {
  home: "/",
  wallet: {
    setup: "/wallet/setup",
    createdSuccessfully: "/wallet/created",
    import: {
      options: "/wallet/import/options",
      seedPhrase: "/wallet/import/seed-phrase",
    },
    restore: {
      seedPhrase: "/wallet/restore/seed-phrase",
      wallet: "/wallet/restore/wallet",
    },
    seedPhrase: "/wallet/seed-phrase",
    confirmSeedPhrase: "/wallet/confirm-seed-phrase",
  },
  send: {
    options: "/send/options",
    confirmation: "/send/confirmation",
    ethereum: "/send/ethereum",
    solana: "/send/solana",
    bark: "/send/bark",
  },
  receive: "/receive",
  settings: "/settings",
};
