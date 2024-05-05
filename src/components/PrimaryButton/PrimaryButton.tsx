import styled from "styled-components/native";
import React from "react";
import PropTypes from "prop-types";

const ButtonContainer = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: ${({ backgroundColor, theme }) =>
  backgroundColor || theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  height: 65px;
  padding: ${({ theme }) => theme.spacing.medium};
  padding-left: 15px;
`;

const ButtonText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.families.openBold};
  font-size: ${({ theme }) => theme.fonts.sizes.large};
  color: ${({ theme }) => theme.colors.white};
`;

const IconContainer = styled.View`
  justify-content: center;
  align-items: center;
  width: ${({ iconSize }) => iconSize || 40}px;
  height: ${({ iconSize }) => iconSize || 40}px;
  border-radius: 100px;
  margin-right: 5px;
`;

const PrimaryButton = ({
  onPress,
  text,
  backgroundColor,
  icon,
  iconSize,
  disabled,
}) => {
  return (
    <ButtonContainer
      onPress={disabled ? null : onPress}
      backgroundColor={backgroundColor}
      disabled={disabled}
    >
      <IconContainer iconSize={iconSize}>{icon}</IconContainer>
      <ButtonText>{text}</ButtonText>
    </ButtonContainer>
  );
};

PrimaryButton.propTypes = {
  onPress: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
  backgroundColor: PropTypes.string,
  icon: PropTypes.node.isRequired,
  iconSize: PropTypes.number,
  disabled: PropTypes.bool,
};

export default PrimaryButton;
