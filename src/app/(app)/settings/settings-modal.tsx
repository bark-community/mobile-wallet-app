import React from "react";
import { SafeAreaView } from "react-native";
import { useTheme } from "styled-components/native";
import { router } from "expo-router";
import styled from "styled-components/native";
import { clearPersistedState } from "../../../store";
import { clearStorage } from "../../../hooks/use-storage-state";
import { ROUTES } from "../../../constants/routes";
import { ThemeType } from "../../../styles/theme";
import ClearIcon from "../../../assets/svg/clear.svg";
import CloseIcon from "../../../assets/svg/close.svg";

const SafeAreaContainer = styled(SafeAreaView)<{ theme: ThemeType }>`
  flex: 1;
  background-color: ${(props) => props.theme.colors.dark};
`;

const ContentContainer = styled.View<{ theme: ThemeType }>`
  flex: 1;
  justify-content: flex-start;
  padding: ${(props) => props.theme.spacing.large};
`;

const TextContainer = styled.TouchableOpacity<{ theme: ThemeType }>`
  flex-direction: row;
  align-items: center;
  padding: ${(props) => props.theme.spacing.large};
  background-color: ${(props) => props.theme.colors.lightDark};
  border-radius: ${(props) => props.theme.spacing.medium};
`;

const Text = styled.Text<{ theme: ThemeType }>`
  color: ${(props) => props.theme.fonts.colors.primary};
  font-family: ${(props) => props.theme.fonts.families.openBold};
  font-size: ${(props) => props.theme.fonts.sizes.large};
`;

const IconContainer = styled.View<{ theme: ThemeType }>`
  background-color: ${(props) => props.theme.colors.lightDark};
  border-radius: ${(props) => props.theme.spacing.medium};
  margin-right: ${(props) => props.theme.spacing.medium};
`;

const SectionTitle = styled.Text<{ theme: ThemeType }>`
  color: ${(props) => props.theme.fonts.colors.primary};
  font-family: ${(props) => props.theme.fonts.families.openBold};
  font-size: ${(props) => props.theme.fonts.sizes.title};
  margin-bottom: ${(props) => props.theme.spacing.large};
  margin-left: ${(props) => props.theme.spacing.medium};
`;

const TopBar = styled.View<{ theme: ThemeType }>`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${(props) => props.theme.colors.lightDark};
`;

const IconTouch = styled.TouchableOpacity`
  padding: 20px;
`;

const SettingsIndex = () => {
  const theme = useTheme();

  // Function to clear wallets
  const clearWallets = () => {
    // Clear persisted state
    clearPersistedState();
    // Clear storage
    clearStorage();
    // Navigate to wallet setup screen
    router.replace(ROUTES.walletSetup);
  };

  // Function to navigate back
  const goBack = () => {
    router.back();
  };

  return (
    <>
      <TopBar>
        <IconTouch onPress={goBack}>
          <CloseIcon width={25} height={25} fill={theme.colors.white} />
        </IconTouch>
      </TopBar>
      <SafeAreaContainer>
        <ContentContainer>
          <SectionTitle>Settings</SectionTitle>
          <TextContainer onPress={clearWallets}>
            <IconContainer>
              <ClearIcon width={25} height={25} fill={theme.colors.primary} />
            </IconContainer>
            <Text>Clear Wallets</Text>
          </TextContainer>
        </ContentContainer>
      </SafeAreaContainer>
    </>
  );
};

export default SettingsIndex;
