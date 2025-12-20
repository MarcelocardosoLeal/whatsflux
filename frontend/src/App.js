import React, { useState, useEffect } from "react";

import "react-toastify/dist/ReactToastify.css";
import { QueryClient, QueryClientProvider } from "react-query";
import lightBackground from '../src/assets/wa-background-light.png';
import darkBackground from '../src/assets/wa-background-dark.jpg';
import { ptBR } from "@material-ui/core/locale";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import { useMediaQuery } from "@material-ui/core";
import ColorModeContext from "./layout/themeContext";
import { SocketContext, SocketManager } from './context/Socket/SocketContext';

import Routes from "./routes";

const queryClient = new QueryClient();

const App = () => {
    const [locale, setLocale] = useState();

    const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
    const preferredTheme = window.localStorage.getItem("preferredTheme");
    const [mode, setMode] = useState(preferredTheme ? preferredTheme : prefersDarkMode ? "dark" : "light");

    const colorMode = React.useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
            },
        }),
        []
    );

    const theme = createTheme(
        {
            typography: {
                fontFamily: [
                    '"Outfit"',
                    'sans-serif',
                ].join(','),
            },
            scrollbarStyles: {
                "&::-webkit-scrollbar": {
                    width: '8px',
                    height: '8px',
                    borderRadius: "8px",
                },
                "&::-webkit-scrollbar-thumb": {
                    boxShadow: 'inset 0 0 6px rgba(0, 0, 0, 0.3)',
                    backgroundColor: "#00695C",
                    borderRadius: "8px",
                },
            },
            scrollbarStylesSoft: {
                "&::-webkit-scrollbar": {
                    width: "8px",
                    borderRadius: "8px",
                },
                "&::-webkit-scrollbar-thumb": {
                    backgroundColor: mode === "light" ? "#F3F3F3" : "#333333",
                    borderRadius: "8px",
                },
            },
            palette: {
                type: mode,
                primary: { main: mode === "light" ? "#00695C" : "#FFFFFF" },
                quicktags: { main: mode === "light" ? "#00695C" : "#00695C" },
                sair: { main: mode === "light" ? "#00695C" : "#333" },
                vcard: { main: mode === "light" ? "#00695C" : "#666" },
                textPrimary: mode === "light" ? "#00695C" : "#FFFFFF",
                borderPrimary: mode === "light" ? "#00695C" : "#FFFFFF",
                dark: { main: mode === "light" ? "#333333" : "#F3F3F3" },
                light: { main: mode === "light" ? "#F3F3F3" : "#333333" },
                tabHeaderBackground: mode === "light" ? "#EEE" : "#666",
                ticketlist: mode === "light" ? "#fafafa" : "#333",
                optionsBackground: mode === "light" ? "#fafafa" : "#333",
                options: mode === "light" ? "#fafafa" : "#666",
                fontecor: mode === "light" ? "#00695C" : "#fff",
                fancyBackground: mode === "light" ? "#fafafa" : "#333",
                bordabox: mode === "light" ? "#eee" : "#333",
                newmessagebox: mode === "light" ? "#eee" : "#333",
                inputdigita: mode === "light" ? "#fff" : "#666",
                contactdrawer: mode === "light" ? "#fff" : "#666",
                announcements: mode === "light" ? "#ededed" : "#333",
                login: mode === "light" ? "#fff" : "#1C1C1C",
                announcementspopover: mode === "light" ? "#fff" : "#666",
                chatlist: mode === "light" ? "#eee" : "#666",
                boxlist: mode === "light" ? "#ededed" : "#666",
                boxchatlist: mode === "light" ? "#ededed" : "#333",
                total: mode === "light" ? "#fff" : "#222",
                messageIcons: mode === "light" ? "grey" : "#F3F3F3",
                inputBackground: mode === "light" ? "#FFFFFF" : "#333",
                barraSuperior: mode === "light" ? "linear-gradient(to right, #00695C, #00695C , #00695C)" : "#666",
                boxticket: mode === "light" ? "#EEE" : "#666",
                campaigntab: mode === "light" ? "#ededed" : "#666",
                mediainput: mode === "light" ? "#ededed" : "#1c1c1c",
                contadordash: mode == "light" ? "#fff" : "#fff",
            },
            mode,
            overrides: {
                MuiCssBaseline: {
                    '@global': {
                        // Glassmorphism for Toasts
                        '.Toastify__toast': {
                            borderRadius: '16px !important',
                            background: mode === 'light'
                                ? 'rgba(255, 255, 255, 0.85) !important'
                                : 'rgba(30, 30, 30, 0.85) !important',
                            backdropFilter: 'blur(12px) !important',
                            webkitBackdropFilter: 'blur(12px) !important',
                            boxShadow: mode === 'light'
                                ? '0 8px 32px 0 rgba(31, 38, 135, 0.2) !important'
                                : '0 8px 32px 0 rgba(0, 0, 0, 0.35) !important',
                            color: mode === 'light' ? '#00695C !important' : '#FFFFFF !important',
                            border: '1px solid rgba(255, 255, 255, 0.18) !important',
                            padding: '16px !important',
                            fontFamily: "'Outfit', sans-serif !important",
                        },
                        '.Toastify__toast-body': {
                            fontFamily: "'Outfit', sans-serif !important",
                            fontWeight: 600,
                            fontSize: '1rem',
                        },
                        '.Toastify__progress-bar': {
                            background: 'linear-gradient(to right, #00ebd7, #00695C) !important', // Cyan to Teal
                        }
                    },
                },
                MuiListItem: {
                    root: {
                        "&.Mui-selected": {
                            backgroundColor: mode === "light" ? "#00695C !important" : "rgba(0, 105, 92, 0.3) !important",
                            color: "#FFF !important",
                            borderRadius: "0 25px 25px 0", // Modern shape
                            "&:hover": {
                                backgroundColor: mode === "light" ? "#004D40 !important" : "rgba(0, 105, 92, 0.4) !important",
                            },
                            "& .MuiListItemIcon-root": {
                                color: "#FFF !important",
                            },
                        },
                        "&:hover": {
                            borderRadius: "0 25px 25px 0",
                        },
                    },
                    button: {
                        "&:hover": {
                            backgroundColor: mode === "light" ? "rgba(0, 105, 92, 0.1)" : "rgba(255, 255, 255, 0.05)",
                        },
                    },
                },
            },
        },
        locale
    );

    useEffect(() => {
        const i18nlocale = localStorage.getItem("i18nextLng") || "pt-BR";
        const normalized = i18nlocale.toLowerCase();
        const isPt = normalized === "pt" || normalized === "pt-br" || normalized.startsWith("pt");
        if (isPt) {
            setLocale(ptBR);
        }
    }, []);

    useEffect(() => {
        window.localStorage.setItem("preferredTheme", mode);
    }, [mode]);



    return (
        <ColorModeContext.Provider value={{ colorMode }}>
            <ThemeProvider theme={theme}>
                <QueryClientProvider client={queryClient}>
                    <SocketContext.Provider value={SocketManager}>
                        <Routes />
                    </SocketContext.Provider>
                </QueryClientProvider>
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
};

export default App;
