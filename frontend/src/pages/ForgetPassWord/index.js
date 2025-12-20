import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Link as RouterLink, useHistory } from "react-router-dom";
import {
  Button,
  TextField,
  Typography,
  Grid,
  InputAdornment,
  IconButton,
  CircularProgress,
  Container,
  Link,
} from "@material-ui/core";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import api from "../../services/api";
import { i18n } from "../../translate/i18n";
import toastError from "../../errors/toastError";
import { toast } from "react-toastify";

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
    backgroundColor: 'rgba(77, 208, 225, 0.4)',
    animationDelay: '0s',
  },
  blob2: {
    bottom: '-10%',
    right: '-10%',
    width: '50vw',
    height: '50vw',
    backgroundColor: 'rgba(140, 240, 229, 0.4)',
    animationDelay: '2s',
  },
  blob3: {
    top: '30%',
    left: '30%',
    width: '30vw',
    height: '30vw',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    animationDelay: '4s',
    filter: 'blur(60px)',
  },
  container: {
    position: 'relative',
    width: '100%',
    maxWidth: 400,
    margin: theme.spacing(2),
    zIndex: 1,
  },
  card: {
    padding: theme.spacing(4, 3),
    borderRadius: theme.spacing(2),
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)',
    background: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(15px)',
    border: '1px solid rgba(255, 255, 255, 0.5)',
    position: 'relative',
    overflow: 'visible',
  },
  logoContainer: {
    position: 'absolute',
    top: -90,
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#E0F2F1',
    width: 150,
    height: 150,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
    border: '4px solid #FFFFFF',
    zIndex: 2,
    '& img': {
      maxWidth: 120,
      height: 'auto',
    },
  },
  formTitle: {
    margin: theme.spacing(6, 0, 3),
    color: '#00695C',
    fontWeight: 700,
    textAlign: 'center',
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(3),
  },
  inputField: {
    marginBottom: theme.spacing(2),
    '& .MuiOutlinedInput-root': {
      borderRadius: 12,
      backgroundColor: '#F3F6F9',
      transition: 'all 0.3s ease',
      '& fieldset': {
        border: '1px solid rgba(0, 0, 0, 0.1)',
      },
      '&:hover fieldset': {
        borderColor: '#00695C',
      },
      '&.Mui-focused': {
        backgroundColor: '#FFFFFF',
        '& fieldset': {
          borderColor: '#00695C',
        },
        boxShadow: '0 0 0 4px rgba(0, 105, 92, 0.1)',
      },
    },
    '& .MuiInputLabel-outlined': {
      color: '#5e6c84',
      '&.Mui-focused': {
        color: '#00695C',
      },
    },
  },
  submitButton: {
    margin: theme.spacing(3, 0, 2),
    padding: theme.spacing(1.5),
    borderRadius: 12,
    fontWeight: 700,
    fontSize: '1rem',
    letterSpacing: 0.5,
    textTransform: 'none',
    backgroundColor: '#00695C',
    color: 'white',
    boxShadow: '0 4px 15px rgba(0, 105, 92, 0.3)',
    transition: 'all 0.2s',
    '&:hover': {
      backgroundColor: '#004D40',
      boxShadow: '0 6px 20px rgba(0, 105, 92, 0.5)',
      transform: 'translateY(-2px)',
    },
    '&:active': {
      transform: 'translateY(0)',
    },
  },
  linkText: {
    color: '#00695C',
    fontWeight: 600,
    textDecoration: 'none',
    display: 'inline-block',
    margin: theme.spacing(1, 0),
    fontSize: '0.9rem',
    transition: 'color 0.2s',
    '&:hover': {
      color: '#004D40',
      textDecoration: 'underline',
    },
  },
}));

const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

const ForgetPassword = () => {
  const theme = useTheme();
  const classes = useStyles();
  const history = useHistory();
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const backendUrl = (process.env.REACT_APP_BACKEND_URL || "http://localhost:4000").replace(/\/$/, "");
  const logo = `${backendUrl}/public/logotipos/login.png`;

  const handleSendEmail = async (values) => {
    setLoading(true);
    try {
      const response = await api.post(
        `${process.env.REACT_APP_BACKEND_URL}/forgetpassword/${values.email}`
      );
      if (response.data.status === 404) {
        toast.error("Email não encontrado");
      } else {
        toast.success(i18n.t("Email enviado com sucesso!"));
        setShowAdditionalFields(true);
      }
    } catch (err) {
      toastError(err);
    }
    setLoading(false);
  };

  const handleResetPassword = async (values) => {
    setLoading(true);
    try {
      await api.post(
        `${process.env.REACT_APP_BACKEND_URL}/resetpasswords/${values.email}/${values.token}/${values.newPassword}`
      );
      toast.success(i18n.t("Senha redefinida com sucesso."));
      history.push("/login");
    } catch (err) {
      toastError(err);
    }
    setLoading(false);
  };

  const UserSchema = Yup.object().shape({
    email: Yup.string().email("Email inválido").required("Campo obrigatório"),
    token: showAdditionalFields
      ? Yup.string().required("Informe o código de verificação enviado ao seu email")
      : Yup.string(),
    newPassword: showAdditionalFields
      ? Yup.string()
        .required("Campo obrigatório")
        .matches(
          passwordRegex,
          "Sua senha precisa ter no mínimo 8 caracteres, sendo uma letra maiúscula, uma minúscula e um número."
        )
      : Yup.string(),
    confirmPassword: Yup.string().when("newPassword", {
      is: (newPassword) => showAdditionalFields && newPassword,
      then: Yup.string()
        .oneOf([Yup.ref("newPassword"), null], "As senhas não correspondem")
        .required("Campo obrigatório"),
      otherwise: Yup.string(),
    }),
  });

  return (
    <div className={classes.root}>
      <div className={`${classes.blob} ${classes.blob1}`} />
      <div className={`${classes.blob} ${classes.blob2}`} />
      <div className={`${classes.blob} ${classes.blob3}`} />
      <div className={classes.container}>
        <div className={classes.card}>
          <div className={classes.logoContainer}>
            <img src={logo} alt="Logo" />
          </div>
          <Typography variant="h5" className={classes.formTitle}>
            Redefinir senha
          </Typography>
          <Formik
            initialValues={{
              email: "",
              token: "",
              newPassword: "",
              confirmPassword: "",
            }}
            validationSchema={UserSchema}
            onSubmit={(values) => {
              if (showAdditionalFields) {
                handleResetPassword(values);
              } else {
                handleSendEmail(values);
              }
            }}
          >
            {({ touched, errors }) => (
              <Form className={classes.form}>
                <Field
                  as={TextField}
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
                  autoComplete="email"
                  className={classes.inputField}
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                />

                {showAdditionalFields && (
                  <>
                    <Field
                      as={TextField}
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      id="token"
                      label="Código de Verificação"
                      name="token"
                      className={classes.inputField}
                      error={touched.token && Boolean(errors.token)}
                      helperText={touched.token && errors.token}
                    />

                    <Field
                      as={TextField}
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      name="newPassword"
                      label="Nova senha"
                      type={showPassword ? "text" : "password"}
                      id="newPassword"
                      className={classes.inputField}
                      error={touched.newPassword && Boolean(errors.newPassword)}
                      helperText={touched.newPassword && errors.newPassword}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => setShowPassword((v) => !v)}
                              edge="end"
                              color={theme.palette.type === 'dark' ? 'default' : 'primary'}
                            >
                              {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />

                    <Field
                      as={TextField}
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      name="confirmPassword"
                      label="Confirme a senha"
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      className={classes.inputField}
                      error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                      helperText={touched.confirmPassword && errors.confirmPassword}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle confirm password visibility"
                              onClick={() => setShowConfirmPassword((v) => !v)}
                              edge="end"
                              color={theme.palette.type === 'dark' ? 'default' : 'primary'}
                            >
                              {showConfirmPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </>
                )}

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submitButton}
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : showAdditionalFields ? "Redefinir Senha" : "Enviar Email"}
                </Button>

                <Grid container justifyContent="space-between">
                  <Grid item>
                    <Link
                      component={RouterLink}
                      to="/signup"
                      className={classes.linkText}
                    >
                      Não tem uma conta? Cadastre-se!
                    </Link>
                  </Grid>
                  <Grid item>
                    <Link
                      component={RouterLink}
                      to="/login"
                      className={classes.linkText}
                    >
                      Voltar ao login
                    </Link>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
