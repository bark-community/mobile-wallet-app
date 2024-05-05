import React, { useEffect, useState } from "react";
import { View, SafeAreaView, FlatList } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { router, useLocalSearchParams } from "expo-router";
import styled, { useTheme } from "styled-components/native";
import type { ThemeType } from "../../../styles/theme";
import { ROUTES } from "../../../constants/routes";
import type { RootState, AppDispatch } from "../../../store";
import {
  fetchEthereumBalance,
  updateSolanaBalance,
  fetchSolanaTransactions,
  fetchEthereumTransactions,
  updateBarkBalance
} from "../../../store/walletSlice";
import { getSolanaBalance } from "../../../utils/solanaHelpers";
import { capitalizeFirstLetter } from "../../../utils/capitalizeFirstLetter";
import { formatDollar } from "../../../utils/formatDollars";
import PrimaryButton from "../../../components/PrimaryButton/PrimaryButton";
import SendIcon from "../../../assets/svg/send.svg";
import ReceiveIcon from "../../../assets/svg/receive.svg";
import TokenInfoCard from "../../../components/TokenInfoCard/TokenInfoCard";
import SolanaIcon from "../../../assets/svg/solana.svg";
import EthereumIcon from "../../../assets/svg/ethereum_plain.svg";
import BarkIcon from "../../../assets/svg/bark.svg";
import { AssetTransfer } from "../../../types";
import CryptoInfoCard from "../../../components/CryptoInfoCard/CryptoInfoCard";
import { truncateWalletAddress } from "../../../utils/truncateWalletAddress";
import { TICKERS } from "../../../constants/tickers";
import { Chains } from "../../../types";

const SafeAreaContainer = styled(SafeAreaView)<{ theme: ThemeType }>`
  flex: 1;
  background-color: ${(props) => props.theme.colors.dark};
  justify-content: flex-end;
`;

const ContentContainer = styled.View<{ theme: ThemeType }>`
  flex: 1;
  justify-content: flex-start;
  padding: ${(props) => props.theme.spacing.large};
`;

const BalanceContainer = styled.View<{ theme: ThemeType }>`
  margin-top: 10px;
  margin-bottom: ${(props) => props.theme.spacing.huge};
`;

const BalanceTokenText = styled.Text<{ theme: ThemeType }>`
  font-family: ${(props) => props.theme.fonts.families.openBold};
  font-size: ${(props) => props.theme.fonts.sizes.huge};
  color: ${(props) => props.theme.fonts.colors.primary};
  text-align: center;
`;

const BalanceUsdText = styled.Text<{ theme: ThemeType }>`
  font-family: ${(props) => props.theme.fonts.families.openBold};
  font-size: ${(props) => props.theme.fonts.sizes.title};
  color: ${(props) => props.theme.colors.lightGrey};
  text-align: center;
`;

const ActionContainer = styled.View<{ theme: ThemeType }>`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-bottom: ${(props) => props.theme.spacing.huge};
`;

const CryptoInfoCardContainer = styled.View<{ theme: ThemeType }>`
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-bottom: ${(props) => props.theme.spacing.medium};
`;

const SectionTitle = styled.Text<{ theme: ThemeType }>`
  font-family: ${(props) => props.theme.fonts.families.openBold};
  font-size: ${(props) => props.theme.fonts.sizes.header};
  color: ${(props) => props.theme.fonts.colors.primary};
  margin-left: ${(props) => props.theme.spacing.small};
  margin-bottom: ${(props) => props.theme.spacing.medium};
`;

const TransactionTitle = styled.Text<{ theme: ThemeType }>`
  font-family: ${(props) => props.theme.fonts.families.openBold};
  font-size: ${(props) => props.theme.fonts.sizes.header};
  color: ${(props) => props.theme.fonts.colors.primary};
  margin-bottom: ${(props) => props.theme.spacing.small};
`;

const ComingSoonView = styled.View<{ theme: ThemeType }>`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const ComingSoonText = styled.Text<{ theme: ThemeType }>`
  font-family: ${(props) => props.theme.fonts.families.openBold};
  font-size: ${(props) => props.theme.fonts.sizes.header};
  color: ${(props) => props.theme.colors.lightGrey};
  margin-top: ${(props) => props.theme.spacing.medium};
`;

// Placeholder API functions
const fetchBarkTransactions = async (tokenAddress) => {
  try {
    // Implement logic to fetch Bark transactions using your backend API
    // Replace the URL with your actual endpoint
    const response = await fetch(`https://api.barktoken.app/bark/transactions/${tokenAddress}`);
    const data = await response.json();
    return data; // Return the fetched transactions
  } catch (error) {
    console.error("Error fetching Bark transactions:", error);
    throw error;
  }
};

const fetchBarkPrice = async () => {
  try {
    // Implement logic to fetch Bark price using your backend API
    // Replace the URL with your actual endpoint
    const response = await fetch('https://api.barktoken.app/price'); // change correct uri
    const data = await response.json();
    return data.price; // Return the fetched Bark price
  } catch (error) {
    console.error("Error fetching Bark price:", error);
    throw error;
  }
};

export default function Index() {
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useLocalSearchParams();
  const theme = useTheme();
  const chainName = id as string;
  const tokenAddress = useSelector(
    (state: RootState) => state.wallet[chainName].address
  );
  const tokenBalance = useSelector(
    (state: RootState) => state.wallet[chainName].balance
  );
  const transactionHistory = useSelector(
    (state: RootState) => state.wallet[chainName].transactions
  );
  const prices = useSelector((state: RootState) => state.price.data);
  const solPrice = prices.solana.usd;
  const ethPrice = prices.ethereum.usd;
  const barkPrice = useSelector((state: RootState) => state.price.data.bark?.usd); // Access Bark price from Redux store
  
  const [usdBalance, setUsdBalance] = useState(0);
  const [transactions, setTransactions] = useState<AssetTransfer[]>([]);
  
  const ticker = TICKERS[chainName];
  const isSolana = chainName === Chains.Solana;
  const isBark = chainName === Chains.Solana;
  const isEthereum = chainName === Chains.Ethereum;
  const Icon = isBark ? BarkIcon : isSolana ? SolanaIcon : EthereumIcon;

  useEffect(() => {
    const fetchBarkData = async () => {
      try {
        // Fetch Bark transactions
        const barkTransactions = await fetchBarkTransactions(tokenAddress);
        setTransactions(barkTransactions);

        // Fetch Bark price
        const barkPriceData = await fetchBarkPrice();
        dispatch(updateBarkBalance(barkPriceData));
      } catch (error) {
        console.error("Error fetching Bark data:", error);
      }
    };

    if (isSolana && tokenAddress) {
      fetchBarkData();
    }
  }, [tokenAddress]);

  useEffect(() => {
    // Update USD balance whenever token balance or Bark price changes
    const updatedUsdBalance = barkPrice * tokenBalance;
    setUsdBalance(updatedUsdBalance);
  }, [tokenBalance, barkPrice]);

  return (
    <SafeAreaContainer>
      <ContentContainer>
        <FlatList
          ListHeaderComponent={
            <>
              <BalanceContainer>
                <BalanceTokenText>
                  {tokenBalance} {ticker}
                </BalanceTokenText>
                <BalanceUsdText>{formatDollar(usdBalance)}</BalanceUsdText>
              </BalanceContainer>
              <ActionContainer>
                <PrimaryButton
                  icon={
                    <SendIcon
                      width={25}
                      height={25}
                      fill={theme.colors.primary}
                    />
                  }
                  onPress={() => router.push(`token/send/${chainName}`)}
                  btnText="Send"
                />
                <View style={{ width: 15 }} />
                <PrimaryButton
                  icon={
                    <ReceiveIcon
                      width={25}
                      height={25}
                      fill={theme.colors.primary}
                    />
                  }
                  onPress={() => router.push(`token/receive/${chainName}`)}
                  btnText="Receive"
                />
              </ActionContainer>
              <SectionTitle>
                About {capitalizeFirstLetter(chainName)}
              </SectionTitle>
              <CryptoInfoCardContainer>
                <TokenInfoCard
                  tokenName={capitalizeFirstLetter(chainName)}
                  tokenSymbol={ticker}
                  network={capitalizeFirstLetter(chainName)}
                />
              </CryptoInfoCardContainer>

              <TransactionTitle>Transaction History</TransactionTitle>
            </>
          }
          data={transactions}
          renderItem={({ item }) => (
            <>
              {item.category === "external" &&
                item.from.toLowerCase() === tokenAddress.toLowerCase() && (
                  <CryptoInfoCard
                    title="Sent"
                    caption={`To ${truncateWalletAddress(item.to)}`}
                    details={`- ${item.value} ${item.asset}`}
                    icon={<Icon width={35} height={35} fill={theme.colors.white} />}
                  />
                )}
              {item.category === "external" &&
                item.to.toLowerCase() === tokenAddress.toLowerCase() && (
                  <CryptoInfoCard
                    title="Received"
                    caption={`From ${truncateWalletAddress(item.from)}`}
                    details={`+ ${item.value} ${item.asset}`}
                    icon={<Icon width={35} height={35} fill={theme.colors.white} />}
                  />
                )}
            </>
          )}
          keyExtractor={(item) => item.uniqueId}
          contentContainerStyle={{ gap: 10 }}
          ListEmptyComponent={
            isSolana ? (
              <ComingSoonView>
                <ComingSoonText>Coming Soon</ComingSoonText>
              </ComingSoonView>
            ) : (
              <ComingSoonView>
                <ComingSoonText>
                  Add some {ticker} to your wallet
                </ComingSoonText>
              </ComingSoonView>
            )
          }
        />
      </ContentContainer>
    </SafeAreaContainer>
  );
}
