import React, { useState, useEffect, useCallback } from "react";
import { Redirect, Stack, router } from "expo-router";
import { useSelector } from "react-redux";
import styled, { useTheme } from "styled-components/native";
import { ROUTES } from "../../constants/routes";
import SettingsIcon from "../../assets/svg/settings.svg";
import LeftIcon from "../../assets/svg/left-arrow.svg";
import { getSeedPhraseConfirmation } from "../../hooks/use-storage-state";

const IconTouchContainer = styled.TouchableOpacity`
  padding: 10px;
`;

const AppLayout = () => {
  const theme = useTheme();
  const ethWallet = useSelector((state) => state.wallet.ethereum);
  const solWallet = useSelector((state) => state.wallet.solana);
  const barkWallet = useSelector((state) => state.wallet.bark);
  const [isSeedPhraseConfirmed, setSeedPhraseConfirmed] = useState(false);

  useEffect(() => {
    const loadSeedPhraseConfirmation = async () => {
      try {
        const confirmation = await getSeedPhraseConfirmation();
        setSeedPhraseConfirmed(confirmation);
      } catch (error) {
        console.error("Error loading seed phrase confirmation:", error);
      }
    };

    loadSeedPhraseConfirmation();
  }, []);

  const handleBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push(ROUTES.settings);
    }
  }, []);

  const shouldRedirectToSeedPhrase = !isSeedPhraseConfirmed && (ethWallet.address || solWallet.address || barkWallet.address);
  const shouldRedirectToWalletSetup = !ethWallet.address || !solWallet.address || !barkWallet.address;

  if (shouldRedirectToSeedPhrase) {
    return <Redirect href={ROUTES.seedPhrase} />;
  }

  if (shouldRedirectToWalletSetup) {
    return <Redirect href={ROUTES.walletSetup} />;
  }

  return (
    <>
      <Stack
        screenOptions={{
          headerTransparent: true,
          gestureEnabled: true,
          headerLeft: () => (
            <IconTouchContainer onPress={handleBack}>
              <LeftIcon width={25} height={25} fill={theme.colors.primary} />
            </IconTouchContainer>
          ),
        }}
      >
        {/* Stack Screens */}
      </Stack>
    </>
  );
};

export default AppLayout;
