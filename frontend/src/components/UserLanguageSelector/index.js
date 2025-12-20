import React, { useContext, useState } from "react";
import { IconButton, Menu, MenuItem, Box } from "@material-ui/core";
import { i18n } from "../../translate/i18n";
import { AuthContext } from "../../context/Auth/AuthContext";

// Idiomas suportados
const languageData = {
  "pt-BR": { code: "PT‑BR", name: "Português (Brasil)" },
  "en": { code: "EN", name: "English" },
  "es": { code: "ES", name: "Español" }
};

const langMap = {
  "pt-BR": "pt",
  "en": "en",
  "es": "es"
};

const UserLanguageSelector = ({ iconOnly = true }) => {
  const [langueMenuAnchorEl, setLangueMenuAnchorEl] = useState(null);
  const { user } = useContext(AuthContext);

  const handleOpenLanguageMenu = e => {
    setLangueMenuAnchorEl(e.currentTarget);
  };

  const handleChangeLanguage = async language => {
    localStorage.setItem("language", language);
    localStorage.setItem("i18nextLng", language);
    i18n.changeLanguage(langMap[language] || language);
    handleCloseLanguageMenu();
    window.location.reload(false);
  };

  const handleCloseLanguageMenu = () => {
    setLangueMenuAnchorEl(null);
  };

  // Obtém o idioma atual ou usa 'pt-BR' como padrão
  const storedLanguage = localStorage.getItem("language") || user?.language || "pt-BR";
  const currentLanguage = storedLanguage === "pt" ? "pt-BR" : storedLanguage;
  const displayMap = { "pt-BR": "BR", en: "EN", es: "ES" };
  const displayCode = displayMap[currentLanguage] || (currentLanguage || "").toUpperCase();

  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleOpenLanguageMenu}
        aria-label="Selecionar idioma"
        title="Selecionar idioma"
      >
        <span style={{ fontSize: 12, fontWeight: 600, color: "#FFFFFF" }}>
          Idioma: {displayCode}
        </span>
      </IconButton>

      <Menu
        anchorEl={langueMenuAnchorEl}
        keepMounted
        open={Boolean(langueMenuAnchorEl)}
        onClose={handleCloseLanguageMenu}
      >
        {Object.entries(languageData).map(([code, { code: short, name }]) => (
          <MenuItem
            key={code}
            onClick={() => handleChangeLanguage(code)}
            selected={currentLanguage === code}
          >
            <Box display="flex" alignItems="center" justifyContent="space-between" width={180}>
              <span style={{ fontWeight: 600 }}>{short}</span>
              <span>{name}</span>
            </Box>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default UserLanguageSelector;
