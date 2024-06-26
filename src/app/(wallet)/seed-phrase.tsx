import React, { useState, useEffect } from "react";
import { SafeAreaView, ScrollView, ActivityIndicator } from "react-native";
import * as Clipboard from "expo-clipboard";
import { router } from "expo-router";
import styled from "styled-components/native";
import { useTheme } from "styled-components";
import { getPhrase } from "../../hooks/use-storage-state";
import { ThemeType } from "../../styles/theme";
import Copy from "../../assets/svg/copy.svg";
import Button from "../../components/Button/Button";
import Bubble from "../../components/Bubble/Bubble";
import { ROUTES } from "../../constants/routes";

const SafeAreaContainer = styled(SafeAreaView)<{ theme: ThemeType }>`
  flex: 1;
  background-color: ${(props) => props.theme.colors.lightDark};
`;

const ContentContainer = styled.View<{ theme: ThemeType }>`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: ${(props) => props.theme.spacing.medium};
`;

const TextContainer = styled.View<{ theme: ThemeType }>`
  margin-bottom: ${(props) => props.theme.spacing.huge};
`;

const Title = styled.Text<{ theme: ThemeType }>`
  font-family: ${(props) => props.theme.fonts.families.openBold};
  font-size: 28px;
  color: ${(props) => props.theme.fonts.colors.primary};
  margin-bottom: ${(props) => props.theme.spacing.medium};
  text-align: center;
`;

const Subtitle = styled.Text<{ theme: ThemeType }>`
  font-family: ${(props) => props.theme.fonts.families.openRegular};
  font-size: ${(props) => props.theme.fonts.sizes.large};
  color: ${(props) => props.theme.fonts.colors.primary};
  text-align: center;
`;

const ButtonContainer = styled.View<{ theme: ThemeType }>`
  padding-left: ${(props) => props.theme.spacing.large};
  padding-right: ${(props) => props.theme.spacing.large};
  padding-bottom: ${(props) => props.theme.spacing.medium};
  width: 100%;
`;

const SeedPhraseContainer = styled.View<{ theme: ThemeType }>`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  margin-right: ${(props) => props.theme.spacing.medium};
  margin-left: ${(props) => props.theme.spacing.medium};
`;

export const SecondaryButtonContainer = styled.TouchableOpacity`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 10px 20px;
  height: 60px;
  margin-top: ${(props) => props.theme.spacing.medium};
`;

export const SecondaryButtonText = styled.Text<{ theme: ThemeType }>`
  margin-left: ${(props) => props.theme.spacing.small};
  font-family: ${(props) => props.theme.fonts.families.openBold};
  font-size: ${(props) => props.theme.fonts.sizes.header};
  color: ${(props) => props.theme.fonts.colors.primary};
`;

const LogoContainer = styled.View``;

export default function Page() {
  const theme = useTheme();
  const [buttonText, setButtonText] = useState("Copy to clipboard");
  const [seedPhrase, setSeedPhrase] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const handleCopy = async () => {
    await Clipboard.setStringAsync(seedPhrase.join(" "));
    setButtonText("Copied!");
    setTimeout(() => {
      setButtonText("Copy to clipboard");
    }, 4000);
  };

  useEffect(() => {
    const fetchSeedPhrase = async () => {
      try {
        const storedSeedPhrase: string = await getPhrase();
        setSeedPhrase(storedSeedPhrase.split(" "));
        setLoading(false);
      } catch (error) {
        setError("Error fetching seed phrase.");
        setLoading(false);
      }
    };

    fetchSeedPhrase();
  }, []);

  return (
    <SafeAreaContainer>
      <ScrollView contentContainerStyle={{ flex: 1 }}>
        <ContentContainer>
          <TextContainer>
            <Title>Secret Recovery Phrase</Title>
            <Subtitle>
              This is the only way you will be able to recover your account.
              Please store it somewhere safe!
            </Subtitle>
          </TextContainer>
          {loading ? (
            <ActivityIndicator size="large" color={theme.colors.primary} />
          ) : error ? (
            <Subtitle>{error}</Subtitle>
          ) : (
            <>
              <SeedPhraseContainer>
                {seedPhrase.map((word, index) => (
                  <Bubble key={index} word={word} number={index + 1} />
                ))}
              </SeedPhraseContainer>
              <SecondaryButtonContainer onPress={handleCopy}>
                <LogoContainer>
                  <Copy fill={theme.colors.white} />
                </LogoContainer>
                <SecondaryButtonText>{buttonText}</SecondaryButtonText>
              </SecondaryButtonContainer>
            </>
          )}
        </ContentContainer>
      </ScrollView>
      <ButtonContainer>
        <Button
          color={theme.colors.white}
          backgroundColor={theme.colors.primary}
          onPress={() => router.push(ROUTES.confirmSeedPhrase)}
          title="Ok, I saved it"
        />
      </ButtonContainer>
    </SafeAreaContainer>
  );
}
