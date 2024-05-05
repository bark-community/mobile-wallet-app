import { router } from "expo-router";
import styled, { useTheme } from "styled-components/native";
import { ThemeType } from "../../styles/theme";
import CloseIcon from "../../assets/svg/close.svg";

const ModalContainer = styled.View<{ theme: ThemeType }>`
  flex: 1;
  justify-content: flex-start;
  padding: ${(props) => props.theme.spacing.large};
`;

const TopBar = styled.View<{ theme: ThemeType }>`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${(props) => props.theme.colors.lightDark};
`;

const IconTouch = styled.TouchableHighlight`
  padding: 20px;
`;

const ModalLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const theme = useTheme();

  const handleGoBack = () => {
    try {
      router.back();
    } catch (error) {
      console.error("Failed to navigate back:", error);
      // Handle the error gracefully, e.g., display an error message to the user
    }
  };

  return (
    <ModalContainer>
      <TopBar>
        <IconTouch onPress={handleGoBack}>
          <CloseIcon width={25} height={25} fill={theme.colors.white} />
        </IconTouch>
      </TopBar>
      {children}
    </ModalContainer>
  );
};

export default ModalLayout;
