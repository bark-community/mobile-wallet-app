import React, { useEffect, useState } from "react";
import { SafeAreaView, Platform, ActivityIndicator } from "react-native";
import { useSelector } from "react-redux";
import { Link } from "expo-router";
import styled, { useTheme } from "styled-components/native";
import { ThemeType } from "../../../styles/theme";
import type { RootState } from "../../../store";
import { formatDollar } from "../../../utils/formatDollars";
import { getSolanaBalance } from "../../../utils/solanaHelpers";
import CryptoInfoCard from "../../../components/CryptoInfoCard/CryptoInfoCard";
import SolanaIcon from "../../../assets/svg/solana.svg";
import EthereumIcon from "../../../assets/svg/ethereum.svg";
import BarkIcon from "../../../assets/svg/bark.svg";

const SafeAreaContainer = styled(SafeAreaView)<{ theme: ThemeType }>`
  flex: 1;
  background-color: ${(props) => props.theme.colors.dark};
  justify-content: flex-end;
`;

const ContentContainer = styled.View<{ theme: ThemeType }>`
  flex: 1;
  justify-content: flex-start;
  padding: ${(props) => props.theme.spacing.large};
  margin-top: ${Platform.OS === "android" ? "75px" : "0"};
`;

const CardView = styled.View<{ theme: ThemeType }>`
  margin-bottom: ${(props) => props.theme.spacing.medium};
  width: 100%;
`;

export default function SendOptions() {
  const theme = useTheme();
  const ethBalance = useSelector(
    (state: RootState) => state.wallet.ethereum.balance
  );
  const solBalance = useSelector(
    (state: RootState) => state.wallet.solana.balance
  );
  const barkBalance = useSelector(
    (state: RootState) => state.wallet.bark.balance // Obtain Bark balance from Redux store
  );
  const prices = useSelector((state: RootState) => state.price.data);
  const solPrice = prices.solana?.usd || 0;
  const ethPrice = prices.ethereum?.usd || 0;
  const barkPrice = useSelector((state: RootState) => state.price.data.bark?.usd) || 0; // Obtain Bark price from Redux store

  const [loading, setLoading] = useState(false);
  const [solUsd, setSolUsd] = useState(0);
  const [ethUsd, setEthUsd] = useState(0);
  const [barkUsd, setBarkUsd] = useState(0);

  useEffect(() => {
    const fetchPrices = async () => {
      setLoading(true);
      try {
        const ethUsd = ethPrice * ethBalance;
        const solUsd = solPrice * solBalance;
        const barkUsd = barkPrice * barkBalance; // Calculate Bark value in USD

        setEthUsd(ethUsd);
        setSolUsd(solUsd);
        setBarkUsd(barkUsd);
      } catch (error) {
        console.error("Error fetching prices:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
  }, [ethBalance, solBalance, barkBalance, ethPrice, solPrice, barkPrice]);

  return (
    <SafeAreaContainer>
      <ContentContainer>
        <CardView>
          <Link href="/token/send/ethereum">
            <CryptoInfoCard
              title="Ethereum"
              caption={`${ethBalance} ETH`}
              details={formatDollar(ethUsd)}
              icon={
                <EthereumIcon
                  width={35}
                  height={35}
                  fill={theme.colors.white}
                />
              }
            />
          </Link>
        </CardView>
        <CardView>
          <Link href="/token/send/solana">
            <CryptoInfoCard
              title="Solana"
              caption={`${solBalance} SOL`}
              details={formatDollar(solUsd)}
              icon={<SolanaIcon width={35} height={35} fill={theme.colors.white} />}
            />
          </Link>
        </CardView>
        <CardView>
          {loading ? (
            <ActivityIndicator size="large" color={theme.colors.primary} />
          ) : (
            <Link href="/token/send/bark"> {/* Add Bark send option */}
              <CryptoInfoCard
                title="Bark"
                caption={`${barkBalance} BARK`} // Display Bark balance
                details={formatDollar(barkUsd)} // Display Bark value in USD
                icon={<BarkIcon width={35} height={35} fill={theme.colors.white} />} // Use Bark icon
              />
            </Link>
          )}
        </CardView>
      </ContentContainer>
    </SafeAreaContainer>
  );
}
