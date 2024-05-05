import React from "react";
import styled from "styled-components/native";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { formatDollar } from "../../utils/formatDollars";

interface ButtonContainerProps {
  backgroundColor?: string;
}

const TokenInfoCardContainer = styled.View<ButtonContainerProps>`
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
`;

const TokenSectionView = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  width: 100%;
  padding-left: 20px;
  padding-right: 20px;
  background-color: ${({ theme }) => theme.colors.lightDark};
  border: 1px solid ${({ theme }) => theme.colors.dark};
`;

const TokenNameLabel = styled.Text`
  font-family: ${({ theme }) => theme.fonts.families.openBold};
  font-size: ${({ theme }) => theme.fonts.sizes.large};
  color: ${({ theme }) => theme.colors.lightGrey};
`;

const TokenNameText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.families.openBold};
  font-size: ${({ theme }) => theme.fonts.sizes.large};
  color: ${({ theme }) => theme.colors.white};
`;

interface TokenInfoCardProps {
  tokenName: string;
  tokenSymbol: string;
  network: string;
  price?: number;
}

const TokenInfoCard: React.FC<TokenInfoCardProps> = ({
  tokenName,
  tokenSymbol,
  network,
  price = 0,
}) => {
  const prices = useSelector<RootState, PriceState>((state) => state.price.data);
  const ethPrice = prices.ethereum?.usd || 0;
  const solPrice = prices.solana?.usd || 0;
  const barkPrice = prices.bark?.usd || 0;

  const findTokenPrice = (tokenSymbol: string): number => {
    switch (tokenSymbol) {
      case "ETH":
        return ethPrice;
      case "SOL":
        return solPrice;
      case "BARK":
        return barkPrice;
      default:
        return 0;
    }
  };

  return (
    <TokenInfoCardContainer>
      <TokenSectionView>
        <TokenNameLabel>Token Name</TokenNameLabel>
        <TokenNameText>
          {tokenName} ({tokenSymbol})
        </TokenNameText>
      </TokenSectionView>
      <TokenSectionView>
        <TokenNameLabel>Network</TokenNameLabel>
        <TokenNameText>{network}</TokenNameText>
      </TokenSectionView>
      <TokenSectionView>
        <TokenNameLabel>Price</TokenNameLabel>
        <TokenNameText>{formatDollar(findTokenPrice(tokenSymbol))}</TokenNameText>
      </TokenSectionView>
    </TokenInfoCardContainer>
  );
};

export default TokenInfoCard;
