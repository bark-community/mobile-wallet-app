import React, { useState, useLayoutEffect } from "react";
import { SafeAreaView, Share, Alert } from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import * as Clipboard from "expo-clipboard";
import styled, { useTheme } from "styled-components/native";
import QRCode from "react-native-qrcode-svg";
import { useSelector } from "react-redux";
import { ThemeType } from "../../../../styles/theme";
import type { RootState } from "../../../../store";
import { capitalizeFirstLetter } from "../../../../utils/capitalizeFirstLetter";
import { truncateWalletAddress } from "../../../../utils/truncateWalletAddress";
import Button from "../../../../components/Button/Button";

interface TextInputProps {
  isAddressInputFocused?: boolean;
  theme: ThemeType;
}

const SafeAreaContainer = styled(SafeAreaView)<{ theme: ThemeType }>`
  flex: 1;
  background-color: ${(props) => props.theme.colors.dark};
  justify-content: flex-end;
`;

const ContentContainer = styled.View<{ theme: ThemeType }>`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: ${(props) => props.theme.spacing.large};
`;

const ImageContainer = styled.View<{ theme: ThemeType }>`
  width: 100%;
  justify-content: center;
  align-items: center;
  height: 225px;
  width: 225px;
  border-radius: ${(props) => props.theme.spacing.medium};
  background-color: ${(props) => props.theme.colors.white};
`;

const CopyButton = styled.TouchableOpacity<{ theme: ThemeType }>`
  background-color: ${(props) => props.theme.colors.primary};
  padding: ${(props) => props.theme.spacing.medium};
  border-radius: ${(props) => props.theme.borderRadius.default};
  align-items: center;
  justify-content: center;
  margin-right: 2px;
`;

const MaxText = styled.Text<{ theme: ThemeType }>`
  font-family: ${(props) => props.theme.fonts.families.openBold};
  font-size: ${(props) => props.theme.fonts.sizes.large};
  color: ${(props) => props.theme.colors.white};
  text-align: center;
  width: 75px;
`;

const ReceiveButtonView = styled.View<{ theme: ThemeType }>`
  flex-direction: row;
  align-items: center;
`;

const ReceiveTextInput = styled.TextInput<TextInputProps>`
  height: 60px;
  color: ${({ theme }) => theme.colors.lightGrey};
  font-size: ${(props) => props.theme.fonts.sizes.large};
  font-family: ${(props) => props.theme.fonts.families.openRegular};
  padding: ${({ theme }) => theme.spacing.medium};
`;

const ReceiveTextInputContainer = styled.View<TextInputProps>`
  height: 60px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.lightDark};
  border: 1px solid
    ${({ theme }) => theme.colors.grey};
  border-radius: ${({ theme }) => theme.borderRadius.default};
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing.huge};
`;

const InfoText = styled.Text<{ theme: ThemeType }>`
  font-family: ${(props) => props.theme.fonts.families.openRegular};
  font-size: ${(props) => props.theme.fonts.sizes.large};
  color: ${(props) => props.theme.colors.lightGrey};
  text-align: center;
  margin-top: ${(props) => props.theme.spacing.medium};
`;

const ButtonContainer = styled.View<{ theme: ThemeType }>`
  padding-left: ${(props) => props.theme.spacing.large};
  padding-right: ${(props) => props.theme.spacing.large};
  padding-bottom: ${(props) => props.theme.spacing.large};
  padding-top: ${(props) => props.theme.spacing.small};
`;

export default function ReceivePage() {
  const theme = useTheme();
  const { receive } = useLocalSearchParams();
  const chainName = receive as string;
  const navigation = useNavigation();
  const tokenAddress = useSelector(
    (state: RootState) => state.wallet[chainName].address
  );
  const [buttonText, setButtonText] = useState("Copy");

  const handleCopy = async () => {
    await Clipboard.setStringAsync(tokenAddress);
    setButtonText("Copied!");
    setTimeout(() => {
      setButtonText("Copy");
    }, 4000);
  };

  const onShare = async () => {
    try {
      await Share.share({
        message: tokenAddress,
      });
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: `Receive ${capitalizeFirstLetter(chainName)}`,
    });
  }, [navigation]);

  return (
    <SafeAreaContainer>
      <ContentContainer>
        <ImageContainer>
          <QRCode value={tokenAddress} size={200} />
        </ImageContainer>

        <ReceiveTextInputContainer>
          <ReceiveTextInput
            placeholder="Amount"
            value={truncateWalletAddress(tokenAddress, 8, 8)}
            editable={false}
            placeholderTextColor={theme.colors.lightGrey}
            keyboardType="numeric"
          />
          <ReceiveButtonView>
            <CopyButton onPress={() => handleCopy()}>
              <MaxText>{buttonText}</MaxText>
            </CopyButton>
          </ReceiveButtonView>
        </ReceiveTextInputContainer>
        <InfoText>
          Share this address to receive {capitalizeFirstLetter(chainName)}
        </InfoText>
      </ContentContainer>
      <ButtonContainer>
        <Button
          backgroundColor={theme.colors.primary}
          onPress={onShare}
          title="Share"
        />
      </ButtonContainer>
    </SafeAreaContainer>
  );
}
