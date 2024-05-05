import React from "react";
import { useDispatch } from "react-redux";
import { Image } from "expo-image";
import { router } from "expo-router";
import styled from "styled-components/native";
import { createWallet } from "../../utils/etherHelpers";
import {
  savePrivateKey,
  savePhrase,
  saveWallet,
  setSeedPhraseConfirmation,
} from "../../hooks/use-storage-state";
import Button from "../../components/Button/Button";
import { ThemeType } from "../../styles/theme";
import {
  saveEthereumAddress,
  saveEthereumPublicKey,
  saveSolanaAddress,
  saveSolanaPublicKey,
  saveBarkAddress,
  saveBarkPublicKey,
} from "../../store/walletSlice";
import { ROUTES } from "../../constants/routes";

export const SafeAreaContainer = styled.SafeAreaView<{ theme: ThemeType }>`
  flex: 1;
  background-color: ${(props) => props.theme.colors.primary};
  justify-content: flex-end;
`;

export const ContentContainer = styled.View<{ theme: ThemeType }>`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const TextContainer = styled.View<{ theme: ThemeType }>`
  padding: ${(props) => props.theme.spacing.large};
`;

export const Title = styled.Text<{ theme: ThemeType }>`
  font-family: ${(props) => props.theme.fonts.families.openBold};
  font-size: 32px;
  color: ${(props) => props.theme.fonts.colors.primary};
  margin-bottom: ${(props) => props.theme.spacing.small};
`;

export const Subtitle = styled.Text<{ theme: ThemeType }>`
  font-family: ${(props) => props.theme.fonts.families.openRegular};
  font-size: ${(props) => props.theme.fonts.sizes.large};
  color: ${(props) => props.theme.fonts.colors.primary};
`;

export const ButtonContainer = styled.View<{ theme: ThemeType }>`
  padding-left: ${(props) => props.theme.spacing.large};
  padding-right: ${(props) => props.theme.spacing.large};
  padding-bottom: ${(props) => props.theme.spacing.large};
  padding-top: ${(props) => props.theme.spacing.small};
`;

export const ExpoImage = styled(Image)`
  flex: 1;
  width: 100%;
`;

export const ImageContainer = styled.View<{ theme: ThemeType }>`
  flex: 1;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

export default function WalletSetup() {
  const dispatch = useDispatch();

  const walletSetup = () => {
    const wallets = createWallet();

    if (Object.keys(wallets).length > 0) {
      saveWallet(JSON.stringify(wallets));
      const etherAddress = wallets.ethereumWallet.address;
      const masterMnemonicPhrase = wallets.ethereumWallet.mnemonic.phrase;
      const masterPrivateKey = wallets.ethereumWallet.privateKey;

      const etherPublicKey = wallets.ethereumWallet.publicKey;

      const solanaAddress = wallets.solanaWallet.publicKey.toBase58();
      const solanaPublicKey = wallets.solanaWallet.publicKey.toBase58();

      const barkAddress = "bark_address_example";
      const barkPublicKey = "bark_public_key_example";

      savePhrase(masterMnemonicPhrase);
      savePrivateKey(masterPrivateKey);
      setSeedPhraseConfirmation(false);

      dispatch(saveEthereumAddress(etherAddress));
      dispatch(saveEthereumPublicKey(etherPublicKey));

      dispatch(saveSolanaAddress(solanaAddress));
      dispatch(saveSolanaPublicKey(solanaPublicKey));

      dispatch(saveBarkAddress(barkAddress));
      dispatch(saveBarkPublicKey(barkPublicKey));

      router.push(ROUTES.seedPhrase);
    }
  };

  return (
    <SafeAreaContainer>
      <ContentContainer>
        <ImageContainer>
          <ExpoImage
            source={require("../../assets/images/wallet_alt.png")}
            contentFit="cover"
          />
        </ImageContainer>

        <TextContainer>
          <Title>Get Started with Ease</Title>
          <Subtitle>
            Secure your financial future with a few easy steps. Your
            decentralized wallet awaits.
          </Subtitle>
        </TextContainer>
      </ContentContainer>
      <ButtonContainer>
        <Button onPress={walletSetup} title="Create Wallet" />
        <Button onPress={() => router.push(ROUTES.walletImportOptions)} title="Import Wallet" />
      </ButtonContainer>
    </SafeAreaContainer>
  );
}
