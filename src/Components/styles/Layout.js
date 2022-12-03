import React, { useContext } from "react";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import { normalize } from "styled-normalize";
import { GlobalContext } from "./globalContext";
import moonSvg from '../../png/moon.svg';
import sunSvg from '../../png/sun.svg';
import mainLight from '../../png/main.png';
import mainDark from '../../png/mainDark.webp';

const GlobalStyle = createGlobalStyle`
  ${normalize}

  body {
    background: ${(props) => props.theme.background};
    transition: background 0.5s;    
  }
`;

const Layout = ({ children }) => {
  const darkTheme = {
    theme: 'dark',
    img: moonSvg,
    background: "#111827",
    button: "#374151",
    transform: 'translate(13px)',

    backgroundNavbar: '#111827',
    border: 'rgb(27, 80, 80)',
    avatarBackground: 'rgb(27, 80, 80)',
    avatarColorName: 'rgb(67, 137, 127)',
    SettingsText: 'rgb(46, 46, 46)',
    pageBackground: mainDark,
  };

  const lightTheme = {
    theme: 'light',
    img: sunSvg,
    background: "#F9FAFB",
    button: "rgb(254, 254, 149)",
    transform: 'translate(0px)',
    
    backgroundNavbar: 'rgb(248, 248, 248)',
    border: 'black',
    avatarBackground: 'rgb(195, 200, 201)',
    avatarColorName: 'white',
    SettingsText: 'rgb(107, 107, 107)',
    pageBackground: mainLight,
  };

  const currentTheme = useContext(GlobalContext);

  let theme;
  
  switch (currentTheme.theme) {
    case "dark":
      theme = darkTheme;
      break;
    case "light":
      theme = lightTheme;
      break;
    default:
      theme = lightTheme;
  }

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <main>
        {children}
      </main>
    </ThemeProvider>
  );
};

export default Layout;