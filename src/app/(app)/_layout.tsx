import React, { useEffect, useState } from "react";
import { Redirect, Stack, Link } from "expo-router";
import { useSelector } from "react-redux";
import styled, { useTheme } from "styled-components/native";
import { getSeedPhraseConfirmation } from "../../hooks/use-storage-state";
import { ROUTES } from "../../constants/routes";
import SettingsIcon from "../../assets/svg/settings.svg";
import LeftIcon from "../../assets/svg/left-arrow.svg";
import CloseIcon from "../../assets/svg/close.svg";

const IconTouchContainer = styled.TouchableOpacity`
  padding: 10px;
`;

export default function AppLayout() {
  const theme = useTheme();
  const ethWallet = useSelector((state) => state.wallet.ethereum);
  const solWallet = useSelector((state) => state.wallet.solana);
  const barkWallet = useSelector((state) => state.wallet.bark);
  const [seedPhraseConfirmed, setSeedPhraseConfirmed] = useState(null);

  useEffect(() => {
    const loadSeedPhraseConfirmation = async () => {
      const confirmation = await getSeedPhraseConfirmation();
      setSeedPhraseConfirmed(confirmation);
    };

    loadSeedPhraseConfirmation();
  }, []);

  if (seedPhraseConfirmed === null) {
    return null;
  }

  if (!seedPhraseConfirmed) {
    return <Redirect href={ROUTES.seedPhrase} />;
  }

  if (!ethWallet.address || !solWallet.address || !barkWallet.address) {
    return <Redirect href={ROUTES.walletSetup} />;
  }

  return (
    <>
      <Stack
        screenOptions={{
          headerTransparent: true,
          gestureEnabled: true,
          headerLeft: () => (
            <Link href={ROUTES.settings}>
              <SettingsIcon width={25} height={25} fill={theme.colors.primary} />
            </Link>
          ),
        }}
      >
        {/* Existing screens */}
        {/* Bark related screens */}
        <Stack.Screen
          name="token/send/bark"
          options={{
            headerShown: true,
            headerTransparent: true,
            gestureEnabled: true,
            presentation: "modal",
            title: "Send Bark",
          }}
        />
        <Stack.Screen
          name="token/receive/bark"
          options={{
            headerShown: true,
            headerTransparent: true,
            gestureEnabled: true,
            headerTitleStyle: {
              color: theme.colors.white,
            },
            title: "Receive Bark",
            presentation: "modal",
            headerLeft: () => (
              <IconTouchContainer onPress={() => router.back()}>
                <LeftIcon width={25} height={25} fill={theme.colors.white} />
              </IconTouchContainer>
            ),
          }}
        />
        {/* Modify existing screens */}
        <Stack.Screen
          name="token/send-options"
          options={{
            headerShown: true,
            headerTransparent: true,
            gestureEnabled: true,
            presentation: "modal",
            title: "Select Token",
            headerLeft: () => (
              <IconTouchContainer onPress={() => router.back()}>
                <CloseIcon width={25} height={25} fill={theme.colors.primary} />
              </IconTouchContainer>
            ),
          }}
        />
        <Stack.Screen
          name="token/receive-options"
          options={{
            headerShown: true,
            headerTransparent: true,
            gestureEnabled: true,
            presentation: "modal",
            title: "Select Token",
            headerLeft: () => (
              <IconTouchContainer onPress={() => router.back()}>
                <CloseIcon width={25} height={25} fill={theme.colors.primary} />
              </IconTouchContainer>
            ),
          }}
        />
      </Stack>
    </>
  );
}
