export type ThemeType = {
  colors: {
    primary: string;
    dark: string;
    lightDark: string;
    accent: string;
    background: string;
    highlight: string;
    white: string;
    lightGrey: string;
    grey: string;
    error: string;
    ethereum: string;
    solana: string;
    orange: string;
    bark: string;
  };
  fonts: {
    families: {
      openRegular: string;
      openBold: string;
      robotoRegular: string;
      robotoBold: string;
    };
    sizes: {
      small: string;
      normal: string;
      large: string;
      header: string;
      title: string;
      huge: string;
      uberHuge: string;
    };
    weights: {
      normal: string;
      bold: string;
    };
    colors: {
      primary: string;
      dark: string;
      accent: string;
      background: string;
      highlight: string;
    };
  };
  spacing: {
    tiny: string;
    small: string;
    medium: string;
    large: string;
    huge: string;
  };
  borderRadius: {
    small: string;
    default: string;
    large: string;
    extraLarge: string;
    custom: string;
  };
};

const Theme: ThemeType = {
  colors: {
    primary: "#3D3D3D",
    dark: "#1A1A1A",
    lightDark: "#262626",
    accent: "#F97068",
    background: "#EDF2EF",
    highlight: "#D1D646",
    white: "#FFFFFF",
    lightGrey: "#A0A0A0",
    grey: "#494949",
    error: "#FF0000",
    ethereum: "#C8B3F4",
    solana: "#00DCFA",
    orange: "#FFA500",
    bark: "#8A5A44",
  },
  fonts: {
    families: {
      openRegular: "OpenSans_400Regular",
      openBold: "OpenSans_700Bold",
      robotoRegular: "Roboto_400Regular",
      robotoBold: "Roboto_700Bold",
    },
    sizes: {
      small: "12px",
      normal: "14px",
      large: "16px",
      header: "18px",
      title: "24px",
      huge: "32px",
      uberHuge: "48px",
    },
    weights: {
      normal: "400",
      bold: "700",
    },
    colors: {
      primary: "#FFFFFF",
      dark: "#191919",
      accent: "#F97068",
      background: "#EDF2EF",
      highlight: "#D1D646",
    },
  },
  spacing: {
    tiny: "4px",
    small: "8px",
    medium: "16px",
    large: "24px",
    huge: "32px",
  },
  borderRadius: {
    small: "4px",
    default: "8px",
    large: "12px",
    extraLarge: "24px",
    custom: "16px",
  },
};

export default Theme;
