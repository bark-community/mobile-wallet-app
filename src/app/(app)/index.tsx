import React, { useEffect, useState, useCallback } from "react";
import { View, SafeAreaView, ScrollView, RefreshControl } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { router, Link } from "expo-router";
import styled, { useTheme } from "styled-components/native";
import { ROUTES } from "../../constants/routes";
import type { ThemeType } from "../../styles/theme";
import type { RootState, AppDispatch } from "../../store";
import { fetchPrices } from "../../store/priceSlice";
import {
  fetchEthereumBalance,
  updateSolanaBalance,
  fetchBarkBalance,
  updateBarkBalance,
} from "../../store/walletSlice";
import { formatDollar } from "../../utils/formatDollars";
import { getSolanaBalance } from "../../utils/solanaHelpers";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";
import SendIcon from "../../assets/svg/send.svg";
import ReceiveIcon from "../../assets/svg/receive.svg";
import CryptoInfoCard from "../../components/CryptoInfoCard/CryptoInfoCard";
import SolanaIcon from "../../assets/svg/solana.svg";
import EthereumIcon from "../../assets/svg/ethereum.svg";
import BarkIcon from "../../assets/svg/bark.svg";
import { FETCH_PRICES_INTERVAL } from "../../constants/price";

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

const BalanceText = styled.Text<{ theme: ThemeType }>`
  font-family: ${(props) => props.theme.fonts.families.openBold};
  font-size: ${(props) => props.theme.fonts.sizes.uberHuge};
  color: ${(props) => props.theme.fonts.colors.primary};
  text-align: center;
`;

const ActionContainer = styled.View<{ theme: ThemeType }>`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-bottom: ${(props) => props.theme.spacing.medium};
`;

const CryptoInfoCardContainer = styled.View<{ theme: ThemeType }>`
  flex: 1;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const CardView = styled.View<{ theme: ThemeType }>`
  margin-bottom: ${(props) => props.theme.spacing.medium};
  width: 100%;
`;

const SectionTitle = styled.Text<{ theme: ThemeType }>`
  font-family: ${(props) => props.theme.fonts.families.openBold};
  font-size: ${(props) => props.theme.fonts.sizes.title};
  color: ${(props) => props.theme.fonts.colors.primary};
  margin-bottom: ${(props) => props.theme.spacing.medium};
  margin-left: ${(props) => props.theme.spacing.small};
`;

export default function Index() {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();
  const ethWalletAddress = useSelector(
    (state: RootState) => state.wallet.ethereum.address
  );
  const ethBalance = useSelector(
    (state: RootState) => state.wallet.ethereum.balance
  );
  const solWalletAddress = useSelector(
    (state: RootState) => state.wallet.solana.address
  );
  const solBalance = useSelector(
    (state: RootState) => state.wallet.solana.balance
  );
  const barkWalletAddress = useSelector(
    (state: RootState) => state.wallet.bark.address
  );
  const barkBalance = useSelector(
    (state: RootState) => state.wallet.bark.balance
  );

  const prices = useSelector((state: RootState) => state.price.data);
  const solPrice = prices.solana.usd;
  const ethPrice = prices.ethereum.usd;
  const barkPrice = prices.bark.usd;

  const [refreshing, setRefreshing] = useState(false);
  const [usdBalance, setUsdBalance] = useState(0);
  const [solUsd, setSolUsd] = useState(0);
  const [ethUsd, setEthUsd] = useState(0);
  const [barkUsd, setBarkUsd] = useState(0);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    dispatch(fetchPrices());
    fetchTokenBalances();
    updatePrices();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, [dispatch]);

  const fetchSolanaBalance = async () => {
    const currentSolBalance = await getSolanaBalance(solWalletAddress);
    dispatch(updateSolanaBalance(currentSolBalance));
  };

  const fetchTokenBalances = async () => {
    if (ethWalletAddress) {
      dispatch(fetchEthereumBalance(ethWalletAddress));
    }

    if (solWalletAddress) {
      fetchSolanaBalance();
    }

    if (barkWalletAddress) {
      dispatch(fetchBarkBalance(barkWalletAddress));
    }
  };

  const updatePrices = () => {
    const ethUsd = ethPrice * ethBalance;
    const solUsd = solPrice * solBalance;
    const barkUsd = barkPrice * barkBalance;

    setUsdBalance(ethUsd + solUsd + barkUsd);
    setEthUsd(ethUsd);
    setSolUsd(solUsd);
    setBarkUsd(barkUsd);
  };

  useEffect(() => {
    dispatch(fetchPrices());
    fetchTokenBalances();
    updatePrices();

    const interval = setInterval(async () => {
      await fetchTokenBalances();
      dispatch(fetchPrices());
      updatePrices();
    }, FETCH_PRICES_INTERVAL);

    return () => clearInterval(interval);
  }, [dispatch]);

  return (
    <SafeAreaContainer>
      <ScrollView
        refreshControl={
          <RefreshControl
            tintColor="#fff"
            titleColor="#fff"
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        <ContentContainer>
          <BalanceContainer>
            <BalanceText>{formatDollar(usdBalance)}</BalanceText>
          </BalanceContainer>
          <ActionContainer>
            <PrimaryButton
              icon={<SendIcon width={25} height={25} fill={theme.colors.primary} />}
              onPress={() => router.push(ROUTES.sendOptions)}
              btnText="Send"
            />
            <View style={{ width: 15 }} />
            <PrimaryButton
              icon={<ReceiveIcon width={25} height={25} fill={theme.colors.primary} />}
              onPress={() => router.push(ROUTES.receiveOptions)}
              btnText="Receive"
            />
          </ActionContainer>
          <SectionTitle>Assets</SectionTitle>
          <CryptoInfoCardContainer>
            <CardView>
              <Link href={ROUTES.ethDetails}>
                <CryptoInfoCard
                  title="Ethereum"
                  caption={`${ethBalance} ETH`}
                  details={formatDollar(ethUsd)}
                  icon={<EthereumIcon width={35} height={35} fill={theme.colors.white} />}
                />
              </Link>
            </CardView>
            <CardView>
              <Link href={ROUTES.solDetails}>
                <CryptoInfoCard
                  title="Solana"
                  caption={`${solBalance} SOL`}
                  details={formatDollar(solUsd)}
                  icon={<SolanaIcon width={25} height={25} fill="#14F195" />}
                />
              </Link>
            </CardView>
            {barkWalletAddress && (
              <CardView>
                <Link href={ROUTES.barkDetails}>
                  <CryptoInfoCard
                    title="Bark"
                    caption={`${barkBalance} BARK`}
                    details={formatDollar(barkUsd)}
                    icon={<BarkIcon width={25} height={25} fill="#fffff" />}
                  />
                </Link>
              </CardView>
            )}
          </CryptoInfoCardContainer>
        </ContentContainer>
      </ScrollView>
    </SafeAreaContainer>
  );
}
