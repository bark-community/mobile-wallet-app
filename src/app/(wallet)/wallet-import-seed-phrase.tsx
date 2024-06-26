import React, { useState } from "react";
import { Dimensions, Keyboard, ScrollView } from "react-native";
import { SafeAreaView } from "react-native";
import { router } from "expo-router";
import { useDispatch } from "react-redux";
import styled from "styled-components/native";
import { useTheme } from "styled-components";
import { restoreWalletFromPhrase } from "../../utils/etherHelpers";
import { ThemeType } from "../../styles/theme";
import {
  saveEthereumAddress,
  saveEthereumPublicKey,
  saveSolanaAddress,
  saveSolanaPublicKey,
  saveBarkAddress,
  saveBarkPublicKey,
} from "../../store/walletSlice";
import Button from "../../components/Button/Button";
import { ROUTES } from "../../constants/routes";
import { savePrivateKey } from "../../hooks/use-storage-state";
import { setSeedPhraseConfirmation } from "../../hooks/use-storage-state";

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
  padding-bottom: ${(props) => props.theme.spacing.large};
  padding-top: ${(props) => props.theme.spacing.small};
  width: 100%;
`;

const SeedTextInput = styled.TextInput<{ theme: ThemeType }>`
  justify-content: flex-start;
  padding: ${(props) => props.theme.spacing.large};
  margin: ${(props) => props.theme.spacing.large};
  background-color: ${(props) => props.theme.colors.dark};
  border-radius: ${(props) => props.theme.borderRadius.extraLarge};
  min-height: 135px;
  width: ${(Dimensions.get("window").width - 80).toFixed(0)}px;
  color: ${(props) => props.theme.colors.white};
  font-size: ${(props) => props.theme.fonts.sizes.large};\
  font-family: ${(props) => props.theme.fonts.families.openRegular};
  border: 1px solid ${(props) => props.theme.colors.grey};
`;

const ErrorTextContainer = styled.View<{ theme: ThemeType }>`
  padding: ${(props) => props.theme.spacing.medium};
`;

const ErrorText = styled.Text<{ theme: ThemeType }>`
  font-family: ${(props) => props.theme.fonts.families.openRegular};
  font-size: ${(props) => props.theme.fonts.sizes.large};
  color: ${(props) => props.theme.colors.error};
  text-align: center;
`;

export default function Page() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [textValue, setTextValue] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleVerifySeedPhrase = async () => {
    const errorText =
      "Looks like the seed phrase is incorrect. Please try again.";
    if (!textValue.trim()) {
      setError("Please enter your seed phrase.");
      return;
    }
    if (textValue.split(" ").length !== 12) {
      setError(errorText);
      return;
    }
    setLoading(true);

    const importedWallets = restoreWalletFromPhrase(textValue);
    if (Object.keys(importedWallets).length > 0) {
      setLoading(false);
      const { ethereumWallet, solanaWallet, barkWallet } = importedWallets;
      const masterPrivateKey = ethereumWallet.privateKey;
      const etherAddress = ethereumWallet.address;
      const etherPublicKey = ethereumWallet.publicKey;
      const solanaAddress = solanaWallet.publicKey.toBase58();
      const solanaPublicKey = solanaWallet.publicKey.toBase58();
      const barkAddress = barkWallet.address;
      const barkPublicKey = barkWallet.publicKey;

      savePrivateKey(masterPrivateKey);

      dispatch(saveEthereumAddress(etherAddress));
      dispatch(saveEthereumPublicKey(etherPublicKey));

      dispatch(saveSolanaAddress(solanaAddress));
      dispatch(saveSolanaPublicKey(solanaPublicKey));

      dispatch(saveBarkAddress(barkAddress));
      dispatch(saveBarkPublicKey(barkPublicKey));

      setSeedPhraseConfirmation(true);

      router.push({
        pathname: ROUTES.walletCreatedSuccessfully,
        params: { successState: "IMPORTED_WALLET" },
      });
    } else {
      setLoading(false);
      setError(errorText);
    }
  };

  return (
    <SafeAreaContainer>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <ContentContainer>
          <TextContainer>
            <Title>Secret Recovery Phrase</Title>
            <Subtitle>
              Start the process to restore your wallet by entering your 12 or
              24-word recovery phrase below.
            </Subtitle>
          </TextContainer>
          <SeedTextInput
            autoCapitalize="none"
            multiline
            returnKeyType="done"
            value={textValue}
            onChangeText={setTextValue}
            placeholder="Enter your seed phrase"
            placeholderTextColor={theme.colors.grey}
            blurOnSubmit
            onSubmitEditing={() => Keyboard.dismiss()}
          />
        </ContentContainer>
      </ScrollView>
      {error && (
        <ErrorTextContainer>
          <ErrorText>{error}</ErrorText>
        </ErrorTextContainer>
      )}
      <ButtonContainer>
        <Button
          loading={loading}
          color={theme.colors.white}
          backgroundColor={theme.colors.primary}
          onPress={handleVerifySeedPhrase}
          title="Verify seed phrase"
        />
      </ButtonContainer>
    </SafeAreaContainer>
  );
}
