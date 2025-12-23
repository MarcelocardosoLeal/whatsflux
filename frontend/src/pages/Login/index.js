import React, { useState, useContext, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";

// Material-UI Components
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import CircularProgress from "@material-ui/core/CircularProgress";
import useMediaQuery from "@material-ui/core/useMediaQuery";

// Custom Imports
import api from "../../services/api";
import { i18n } from "../../translate/i18n";
import { AuthContext } from "../../context/Auth/AuthContext";

const useStyles = makeStyles((theme) => ({
  '@global': {
    '@keyframes aurora': {
      '0%': { backgroundPosition: '0% 50%' },
      '50%': { backgroundPosition: '100% 50%' },
      '100%': { backgroundPosition: '0% 50%' },
    },
    '@keyframes float': {
      '0%': { transform: 'translateY(0px)' },
      '50%': { transform: 'translateY(-20px)' },
      '100%': { transform: 'translateY(0px)' },
    },
    '@keyframes fadeIn': {
      '0%': { opacity: 0, transform: 'translateY(20px)' },
      '100%': { opacity: 1, transform: 'translateY(0)' },
    },
  },
  root: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(-45deg, #8CF0E5, #4DD0E1, #00695C, #8CF0E5)',
    backgroundSize: '400% 400%',
    animation: 'aurora 15s ease infinite',
    position: 'relative',
    overflow: 'hidden',
  },
  // Animated Blobs
  blob: {
    position: 'absolute',
    borderRadius: '50%',
    filter: 'blur(40px)',
    opacity: 0.7,
    animation: 'float 10s ease-in-out infinite',
    zIndex: 0,
  },
  blob1: {
    top: '-10%',
    left: '-10%',
    width: '50vw',
    height: '50vw',
    backgroundColor: 'rgba(77, 208, 225, 0.4)', // Cyan
    animationDelay: '0s',
  },
  blob2: {
    bottom: '-10%',
    right: '-10%',
    width: '50vw',
    height: '50vw',
    backgroundColor: 'rgba(140, 240, 229, 0.4)', // Mint
    animationDelay: '2s',
  },
  blob3: {
    top: '30%',
    left: '30%',
    width: '30vw',
    height: '30vw',
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // White highlight
    animationDelay: '4s',
    filter: 'blur(60px)',
  },
  loginContainer: {
    position: 'relative',
    width: '100%',
    maxWidth: 400,
    margin: theme.spacing(2),
    zIndex: 1,
    animation: 'fadeIn 1s ease-out forwards',
  },
  loginCard: {
    padding: theme.spacing(15, 4, 5, 4), // Reduced padding for smaller logo
    borderRadius: theme.spacing(2),
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)',
    background: 'rgba(255, 255, 255, 0.85)', // High quality glass
    backdropFilter: 'blur(15px)',
    borderTop: '1px solid rgba(255, 255, 255, 0.9)', // Highlight
    borderLeft: '1px solid rgba(255, 255, 255, 0.9)', // Highlight
    borderBottom: '1px solid rgba(255, 255, 255, 0.2)', // Shadow side
    borderRight: '1px solid rgba(255, 255, 255, 0.2)', // Shadow side
    boxShadow: '0 25px 45px rgba(0,0,0,0.2), inset 0 0 15px rgba(255,255,255,0.5)', // Deep depth + Internal volume
    textAlign: 'center',
    position: 'relative', // For absolute positioning of logo
    overflow: 'visible', // Allow logo to float outside
    maxWidth: 400,
    width: '100%',
  },
  logoContainer: {
    position: 'absolute',
    top: -90, // Adjusted for smaller size
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#E0F2F1', // Very Light Green background
    width: 180,
    height: 180, // Reduced size
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
    border: '4px solid #FFFFFF', // White border to blend with card
    '& img': {
      maxWidth: 150, // Reduced image size
      height: 'auto',
      // filter: 'brightness(0) invert(1)', // Removed to show original mascot colors
    },
  },
  formTitle: {
    margin: theme.spacing(4, 0, 3), // Adjusted margins
    color: '#00695C',
    fontWeight: 700,
    fontSize: '1.6rem', // Slightly larger
    fontFamily: "'Outfit', sans-serif",
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  inputField: {
    marginBottom: theme.spacing(2),
    '& .MuiOutlinedInput-root': {
      borderRadius: 12,
      backgroundColor: '#F3F6F9', // Light Grey Flat Input
      transition: 'all 0.3s ease',
      '& fieldset': {
        border: '1px solid rgba(0, 0, 0, 0.1)', // Light visible border
      },
      '&:hover': {
        backgroundColor: '#E9ECEF',
      },
      '&.Mui-focused': {
        backgroundColor: '#FFFFFF',
        '& fieldset': {
          borderColor: '#00695C', // Green border on focus
        },
        boxShadow: '0 0 0 4px rgba(0, 105, 92, 0.1)', // Subtle focus ring
      },
    },
    '& .MuiInputLabel-outlined': {
      color: '#5e6c84', // Neutral label color
      '&.Mui-focused': {
        color: '#00695C',
      },
    },
  },
  submitButton: {
    margin: theme.spacing(4, 0, 2),
    padding: theme.spacing(1.8),
    backgroundColor: '#00695C',
    color: 'white',
    borderRadius: 12,
    fontSize: '1rem',
    fontWeight: 700,
    letterSpacing: '1px',
    boxShadow: '0 4px 15px rgba(0, 105, 92, 0.3)',
    '&:hover': {
      backgroundColor: '#004D40',
      boxShadow: '0 6px 20px rgba(0, 105, 92, 0.5)',
      transform: 'scale(1.02)',
    }
  },
  linkText: {
    color: '#00695C',
    fontWeight: 600,
    textDecoration: 'none',
    fontSize: '0.9rem',
    transition: 'color 0.2s',
    '&:hover': {
      color: '#004D40',
      textDecoration: 'underline',
    },
  },
  footer: {
    marginTop: theme.spacing(4),
    color: '#FFFFFF', // White text on the dark/vibrant background for contrast
    textShadow: '0 1px 2px rgba(0,0,0,0.2)', // Shadow for readability
    fontSize: '0.8rem',
    textAlign: 'center',
    fontWeight: 500,
    opacity: 0.9,
    animation: 'fadeIn 2s ease-out forwards', // Slower fade in for footer
  }
}));

const Login = () => {
  const theme = useTheme();
  const classes = useStyles();
  const [user, setUser] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const { handleLogin, loading } = useContext(AuthContext);
  const [viewregister, setviewregister] = useState('disabled');

  const handleChangeInput = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    fetchviewregister();
  }, []);

  const fetchviewregister = async () => {
    try {
      const responsev = await api.get("/settings/viewregister");
      const viewregisterX = responsev?.data?.value;
      setviewregister(viewregisterX);
    } catch (error) {
      console.error('Error retrieving viewregister', error);
    }
  };

  const handlSubmit = (e) => {
    e.preventDefault();
    handleLogin(user);
  };

  const backendUrl = (process.env.REACT_APP_BACKEND_URL || "https://api.example.com").replace(/\/$/, "");
  const logo = `${backendUrl}/public/logotipos/login.png`;
  const randomValue = Math.random();
  const logoWithRandom = `${logo}?r=${randomValue}`;

  return (
    <div className={classes.root}>
      {/* Animated Blobs */}
      <div className={`${classes.blob} ${classes.blob1}`} />
      <div className={`${classes.blob} ${classes.blob2}`} />
      <div className={`${classes.blob} ${classes.blob3}`} />

      <div className={classes.loginContainer}>
        <div className={classes.loginCard}>
          <div className={classes.logoContainer}>
            <img src={logoWithRandom} alt="WhatsFlux Logo" />
          </div>

          <Typography variant="h5" className={classes.formTitle}>
            Acesse sua conta
          </Typography>

          <form className={classes.form} onSubmit={handlSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label={i18n.t("login.form.email")}
              name="email"
              value={user.email}
              onChange={handleChangeInput}
              autoComplete="email"
              className={classes.inputField}
            />

            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label={i18n.t("login.form.password")}
              type={showPassword ? "text" : "password"}
              id="password"
              value={user.password}
              onChange={handleChangeInput}
              autoComplete="current-password"
              className={classes.inputField}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              className={classes.submitButton}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "ENTRAR"
              )}
            </Button>

            <Grid container>
              <Grid item xs>
                <Link
                  component={RouterLink}
                  to="/forgetpsw"
                  className={classes.linkText}
                >
                  Esqueceu sua senha?
                </Link>
              </Grid>
              <Grid item>
                {viewregister === "enabled" && (
                  <Link
                    component={RouterLink}
                    to="/signup"
                    className={classes.linkText}
                  >
                    Criar conta
                  </Link>
                )}
              </Grid>
            </Grid>
          </form>
        </div>
      </div>
      <Typography variant="body2" className={classes.footer}>
        Copyright WhatsFlux - v 6.0.1-{new Date().getFullYear()}
      </Typography>
    </div>
  );
};

export default Login;