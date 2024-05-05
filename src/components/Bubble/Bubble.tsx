import React, { useCallback } from "react";
import { TouchableOpacity, ViewPropTypes } from "react-native";
import PropTypes from "prop-types";
import styled from "styled-components/native";

// Styled components for Bubble
const BubbleContainer = styled.View`
  background-color: ${({ theme }) => theme.colors.dark};
  padding: ${({ theme, smallBubble }) => (smallBubble ? "0px" : theme.spacing.small)};
  border-radius: ${({ theme }) => theme.borderRadius.extraLarge};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.grey};
  margin: 5px;
  height: ${({ smallBubble }) => (smallBubble ? "40px" : "60px")};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  width: ${({ smallBubble }) => (smallBubble ? "80px" : "100px")};
`;

const BubbleText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.families.openBold};
  font-size: ${({ theme }) => theme.fonts.sizes.normal};
  color: ${({ theme }) => theme.fonts.colors.primary};
`;

const BubbleNumber = styled.Text`
  font-family: ${({ theme }) => theme.fonts.families.openBold};
  font-size: ${({ theme }) => theme.fonts.sizes.large};
  color: ${({ theme }) => theme.fonts.colors.primary};
`;

const Line = styled.View`
  background-color: ${({ theme }) => theme.colors.grey};
  height: 50%;
  width: 2px;
`;

// Prop types for Bubble component
const propTypes = {
  word: PropTypes.string.isRequired,
  number: PropTypes.number.isRequired,
  smallBubble: PropTypes.bool,
  hideDetails: PropTypes.bool,
  onPress: PropTypes.func,
  containerStyle: ViewPropTypes.style,
};

const Bubble = React.memo(
  ({
    word,
    number,
    smallBubble = false,
    hideDetails = false,
    onPress,
    containerStyle,
  }) => {
    const num = number.toString();

    const memoizedOnPress = useCallback(() => {
      if (onPress) {
        onPress();
      }
    }, [onPress]);

    return (
      <TouchableOpacity onPress={memoizedOnPress}>
        <BubbleContainer style={[containerStyle, { height: smallBubble ? 40 : 60 }]}>
          {!hideDetails && <BubbleNumber>{num}</BubbleNumber>}
          {!hideDetails && <Line />}
          <BubbleText>{word}</BubbleText>
        </BubbleContainer>
      </TouchableOpacity>
    );
  }
);

Bubble.propTypes = propTypes;

export default Bubble;
