import React, { useState, useEffect } from "react";
import qs from 'query-string';
import * as Yup from "yup";
import { useHistory } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import { toast } from "react-toastify";
import { Formik, Form, Field } from "formik";
import usePlans from "../../hooks/usePlans";
import api from "../../services/api";
import InputMask from 'react-input-mask';
import {
	Avatar,
	Button,
	TextField,
	Link,
	Grid,
	Box,
	Paper,
	Typography,
	Card,
	CardContent,
	CardHeader,
	CardActions,
	Stepper,
	Step,
	StepLabel,
	useMediaQuery,
	Fade,
	Slide,
	Badge
} from "@material-ui/core";
import {
	LockOutlined,
	CheckCircle,
	Business,
	Phone,
	Email,
	VpnKey,
	ArrowBack,
	Star
} from "@material-ui/icons";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { i18n } from "../../translate/i18n";
import { openApi } from "../../services/api";
import toastError from "../../errors/toastError";
import moment from "moment";

const nomeEmpresa = process.env.REACT_APP_COPYRIGHT || '';
const versionSystem = process.env.REACT_APP_VERSION || '';

const Copyright = () => {
	return (
		<Typography variant="body2" style={{ color: 'white' }} align="center">
			{"Copyright © "}
			<Link color="inherit" href="#">
				{nomeEmpresa} - v{versionSystem}
			</Link>{" "}
			{new Date().getFullYear()}
			{"."}
		</Typography>
	);
};

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
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		flex: 1,
		padding: theme.spacing(4, 2),
		zIndex: 1,
	},
	hero: {
		textAlign: 'center',
		marginBottom: theme.spacing(4),
		maxWidth: 800,
	},
	heroTitle: {
		fontWeight: 800,
		marginBottom: theme.spacing(2),
		color: '#FFFFFF', // White for contrast
		fontSize: '2.5rem',
		textShadow: '0 2px 4px rgba(0,0,0,0.1)',
		[theme.breakpoints.down('sm')]: {
			fontSize: '2rem',
		},
	},
	heroSubtitle: {
		color: '#FFFFFF', // White for contrast
		fontSize: '1.1rem',
		lineHeight: 1.6,
		opacity: 0.9,
	},
	formContainer: {
		width: '100%',
		maxWidth: 1200,
	},
	paper: {
		padding: theme.spacing(4),
		borderRadius: theme.spacing(2),
		boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)',
		background: 'rgba(255, 255, 255, 0.85)',
		backdropFilter: 'blur(15px)',
		border: '1px solid rgba(255, 255, 255, 0.5)',
		position: 'relative',
		overflow: 'visible',
	},
	avatar: {
		margin: '0 auto',
		background: '#00695C',
		width: 64,
		height: 64,
	},
	form: {
		width: "100%",
		marginTop: theme.spacing(2),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
		padding: theme.spacing(1.8),
		backgroundColor: '#00695C',
		color: 'white',
		borderRadius: 12,
		fontSize: '1rem',
		fontWeight: 700,
		letterSpacing: '1px',
		boxShadow: '0 4px 15px rgba(0, 105, 92, 0.3)',
		textTransform: 'none',
		'&:hover': {
			backgroundColor: '#004D40',
			boxShadow: '0 6px 20px rgba(0, 105, 92, 0.5)',
			transform: 'scale(1.02)',
		}
	},
	logoContainer: {
		display: 'flex',
		justifyContent: 'center',
		marginBottom: theme.spacing(3),
	},
	logo: {
		maxWidth: 180,
		height: 'auto',
		transition: 'all 0.3s ease',
	},
	title: {
		marginBottom: theme.spacing(3),
		fontWeight: 700,
		textAlign: 'center',
		color: '#00695C',
	},
	pricingCard: {
		height: '100%',
		display: 'flex',
		flexDirection: 'column',
		borderRadius: 16,
		background: 'rgba(255, 255, 255, 0.9)',
		border: '1px solid',
		borderColor: theme.palette.divider,
		transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
		overflow: 'hidden',
		position: 'relative',
		'&:hover': {
			transform: 'translateY(-8px)',
			boxShadow: theme.shadows[6],
			borderColor: '#00695C',
		},
	},
	pricingCardSelected: {
		borderColor: '#00695C',
		boxShadow: `0 0 0 2px #00695C`,
		transform: 'translateY(-8px)',
		background: '#FFFFFF',
	},
	pricingCardHeader: {
		padding: theme.spacing(3),
		background: 'rgba(0, 105, 92, 0.05)',
		position: 'relative',
	},
	pricingCardTitle: {
		fontWeight: 700,
		color: theme.palette.text.primary,
		textAlign: 'center',
	},
	pricingCardPrice: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'baseline',
		marginBottom: theme.spacing(2),
	},
	pricingCardPriceAmount: {
		fontSize: '2.25rem',
		fontWeight: 800,
		lineHeight: 1,
		color: '#00695C',
	},
	pricingCardFeatures: {
		padding: theme.spacing(3),
		flexGrow: 1,
	},
	pricingCardFeature: {
		display: 'flex',
		alignItems: 'center',
		padding: theme.spacing(1.5, 0),
		color: theme.palette.text.secondary,
	},
	featureIcon: {
		color: '#00695C',
		marginRight: theme.spacing(1.5),
		fontSize: '1.2rem',
	},
	stepper: {
		padding: theme.spacing(3, 0, 5),
		maxWidth: 600,
		margin: '0 auto',
		background: 'transparent', // Important
		'& .MuiStepIcon-root.MuiStepIcon-active': {
			color: '#00695C',
		},
		'& .MuiStepIcon-root.MuiStepIcon-completed': {
			color: '#00695C',
		},
		'& .MuiStepLabel-label.MuiStepLabel-active': {
			color: '#FFFFFF',
			fontWeight: 600,
		},
		'& .MuiStepLabel-label': {
			color: 'rgba(255,255,255,0.7)',
		}
	},
	backButton: {
		marginRight: theme.spacing(1),
		color: theme.palette.text.secondary,
		borderRadius: 8,
		padding: theme.spacing(1, 2),
		'&:hover': {
			backgroundColor: theme.palette.action.hover,
		},
	},
	stepContent: {
		marginTop: theme.spacing(2),
	},
	planSummary: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: theme.spacing(2.5),
		background: 'rgba(0, 105, 92, 0.05)',
		borderRadius: 12,
		marginBottom: theme.spacing(3),
		border: `1px solid ${theme.palette.divider}`,
	},
	planName: {
		fontWeight: 600,
		color: '#00695C',
	},
	popularBadge: {
		position: 'absolute',
		top: 0,
		right: 0,
		transform: 'translateY(-50%)',
		backgroundColor: '#ff9800',
		color: 'white',
		fontWeight: 700,
		padding: theme.spacing(0.5, 2),
		borderRadius: 16,
		fontSize: '0.75rem',
		display: 'flex',
		alignItems: 'center',
		boxShadow: theme.shadows[2],
		'& svg': {
			fontSize: '0.9rem',
			marginRight: theme.spacing(0.5),
		},
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
			'&:hover': {
				backgroundColor: '#E9ECEF',
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
	stepLabel: {
		'& .MuiStepLabel-label': {
			fontWeight: 600,
			fontSize: '1rem',
		},
	},
}));

const UserSchema = Yup.object().shape({
	name: Yup.string()
		.min(2, "Nome muito curto!")
		.max(50, "Nome muito longo!")
		.required("Obrigatório"),
	password: Yup.string()
		.min(5, "Senha muito curta! Mínimo 5 caracteres")
		.max(50, "Senha muito longa!")
		.required("Obrigatório"),
	email: Yup.string()
		.email("Email inválido")
		.required("Obrigatório"),
	phone: Yup.string()
		.min(15, "Telefone incompleto")
		.required("Obrigatório"),
});

const SignUp = () => {
	const classes = useStyles();
	const history = useHistory();
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
	const [allowregister, setallowregister] = useState('enabled');
	const [trial, settrial] = useState('3');
	const [activeStep, setActiveStep] = useState(0);
	const [selectedPlan, setSelectedPlan] = useState(null);

	// const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:4000";
	const backendUrl = (process.env.REACT_APP_BACKEND_URL || "http://localhost:4000").replace(/\/$/, "");
	const logoLight = `${backendUrl}/public/logotipos/interno.png`;
	const logoDark = `${backendUrl}/public/logotipos/logo_w.png`;

	let companyId = null;

	useEffect(() => {
		fetchallowregister();
		fetchtrial();
	}, []);

	const fetchtrial = async () => {
		try {
			const responsevvv = await api.get("/settings/trial");
			const allowtrialX = responsevvv.data.value;
			settrial(allowtrialX);
		} catch (error) {
			console.error('Error retrieving trial', error);
		}
	};

	const fetchallowregister = async () => {
		try {
			const responsevv = await api.get("/settings/allowregister");
			const allowregisterX = responsevv.data.value;
			setallowregister(allowregisterX);
		} catch (error) {
			console.error('Error retrieving allowregister', error);
		}
	};

	if (allowregister === "disabled") {
		history.push("/login");
	}

	const params = qs.parse(window.location.search);
	if (params.companyId !== undefined) {
		companyId = params.companyId;
	}

	const initialState = {
		name: "",
		email: "",
		phone: "",
		password: "",
		planId: selectedPlan?.id || ""
	};

	const dueDate = moment().add(trial, "day").format();

	const handleSignUp = async values => {
		Object.assign(values, {
			recurrence: "MENSAL",
			dueDate: dueDate,
			status: "t",
			campaignsEnabled: true,
			planId: selectedPlan.id
		});

		try {
			await openApi.post("/companies/cadastro", values);
			toast.success(i18n.t("signup.toasts.success"));
			history.push("/login");
		} catch (err) {
			console.log(err);
			toastError(err);
		}
	};

	const [plans, setPlans] = useState([]);
	const { register: listPlans } = usePlans();

	useEffect(() => {
		async function fetchData() {
			const list = await listPlans();
			setPlans(list);
		}
		fetchData();
	}, []);

	const handleNext = () => {
		setActiveStep((prevActiveStep) => prevActiveStep + 1);
	};

	const handleBack = () => {
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
	};

	const handlePlanSelect = (plan) => {
		setSelectedPlan(plan);
		handleNext();
	};

	const steps = ['Selecione seu plano', 'Crie sua conta'];

	// Identificar o plano mais popular (com maior valor)
	const popularPlan = plans.length > 0
		? plans.reduce((prev, current) =>
			(prev.value > current.value) ? prev : current)
		: null;

	return (
		<div className={classes.root}>
			{/* Animated Blobs */}
			<div className={`${classes.blob} ${classes.blob1}`} />
			<div className={`${classes.blob} ${classes.blob2}`} />
			<div className={`${classes.blob} ${classes.blob3}`} />
			<Container maxWidth="lg" className={classes.container}>
				<div className={classes.logoContainer}>
					<img
						src={theme.palette.type === 'light' ? logoLight : logoDark}
						className={classes.logo}
						alt={`${process.env.REACT_APP_NAME_SYSTEM}`}
					/>
				</div>

				<div className={classes.hero}>
					<Typography variant="h3" className={classes.heroTitle} gutterBottom>
						Transforme sua comunicação com nosso sistema
					</Typography>
					<Typography variant="h6" className={classes.heroSubtitle}>
						Experimente gratuitamente por {trial} dias todas as funcionalidades
						da nossa plataforma. Sem necessidade de cartão de crédito.
					</Typography>
				</div>

				<div className={classes.formContainer}>
					<Stepper activeStep={activeStep} className={classes.stepper}>
						{steps.map((label, index) => (
							<Step key={label}>
								<StepLabel
									StepIconProps={{
										style: {
											color: activeStep === index ? theme.palette.primary.main : theme.palette.text.disabled
										}
									}}
									className={classes.stepLabel}
								>
									{label}
								</StepLabel>
							</Step>
						))}
					</Stepper>

					<div className={classes.stepContent}>
						{activeStep === 0 ? (
							<Fade in={activeStep === 0} timeout={500}>
								<Grid container spacing={3} justifyContent="center">
									{plans.map((plan) => (
										<Grid item xs={12} sm={6} md={4} key={plan.id}>
											<Card
												className={`${classes.pricingCard} ${selectedPlan?.id === plan.id ? classes.pricingCardSelected : ''
													}`}
												onClick={() => handlePlanSelect(plan)}
											>
												{popularPlan?.id === plan.id && (
													<div className={classes.popularBadge}>
														<Star fontSize="small" /> POPULAR
													</div>
												)}
												<CardHeader
													title={plan.name}
													titleTypographyProps={{
														align: 'center',
														className: classes.pricingCardTitle,
														variant: 'h6',
													}}
													className={classes.pricingCardHeader}
												/>

												<CardContent>
													<div className={classes.pricingCardPrice}>
														<Typography
															component="h2"
															variant="h3"
															className={classes.pricingCardPriceAmount}
														>
															R$ {plan.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
														</Typography>
														<Typography variant="body1" color="textSecondary">
															/mês
														</Typography>
													</div>
													<div className={classes.pricingCardFeatures}>
														<div className={classes.pricingCardFeature}>
															<CheckCircle className={classes.featureIcon} />
															<Typography variant="body2">
																<strong>{plan.connections}</strong> Conexões WhatsApp
															</Typography>
														</div>
														<div className={classes.pricingCardFeature}>
															<CheckCircle className={classes.featureIcon} />
															<Typography variant="body2">
																<strong>{plan.users}</strong> Usuários
															</Typography>
														</div>
														<div className={classes.pricingCardFeature}>
															<CheckCircle className={classes.featureIcon} />
															<Typography variant="body2">
																Campanhas <strong>{plan.useCampaigns ? 'Sim' : 'Não'}</strong>
															</Typography>
														</div>
														<div className={classes.pricingCardFeature}>
															<CheckCircle className={classes.featureIcon} />
															<Typography variant="body2">
																Agendamentos <strong>{plan.useSchedules ? 'Sim' : 'Não'}</strong>
															</Typography>
														</div>
														<div className={classes.pricingCardFeature}>
															<CheckCircle className={classes.featureIcon} />
															<Typography variant="body2">
																Chat Interno <strong>{plan.useInternalChat ? 'Sim' : 'Não'}</strong>
															</Typography>
														</div>
														<div className={classes.pricingCardFeature}>
															<CheckCircle className={classes.featureIcon} />
															<Typography variant="body2">
																API Extern <strong>{plan.useExternalApi ? 'Sim' : 'Não'}</strong>
															</Typography>
														</div>
														<div className={classes.pricingCardFeature}>
															<CheckCircle className={classes.featureIcon} />
															<Typography variant="body2">
																Kanban <strong>{plan.useKanban ? 'Sim' : 'Não'}</strong>
															</Typography>
														</div>
														<div className={classes.pricingCardFeature}>
															<CheckCircle className={classes.featureIcon} />
															<Typography variant="body2">
																Open AI (chatGPT) <strong>{plan.useOpenAi ? 'Sim' : 'Não'}</strong>
															</Typography>
														</div>
														<div className={classes.pricingCardFeature}>
															<CheckCircle className={classes.featureIcon} />
															<Typography variant="body2">
																Integrações <strong>{plan.useIntegrations ? 'Sim' : 'Não'}</strong>
															</Typography>
														</div>
														<div className={classes.pricingCardFeature}>
															<CheckCircle className={classes.featureIcon} />
															<Typography variant="body2">
																<strong>{trial} dias</strong> grátis
															</Typography>
														</div>
													</div>
												</CardContent>

												<CardActions>
													<Button
														fullWidth
														variant={selectedPlan?.id === plan.id ? "contained" : "outlined"}
														color="primary"
														size="large"
														style={{
															margin: theme.spacing(0, 2, 2),
															borderRadius: 12,
															textTransform: 'none',
															fontWeight: 600,
															padding: theme.spacing(1.5),
															fontSize: '1rem',
														}}
													>
														{selectedPlan?.id === plan.id ? 'Selecionado' : 'Selecionar'}
													</Button>
												</CardActions>
											</Card>
										</Grid>
									))}
								</Grid>
							</Fade>
						) : (
							<Slide direction="left" in={activeStep === 1} mountOnEnter unmountOnExit>
								<Paper elevation={0} className={classes.paper}>
									<Button
										startIcon={<ArrowBack />}
										onClick={handleBack}
										className={classes.backButton}
										style={{ textTransform: 'none' }}
									>
										Voltar para planos
									</Button>

									{selectedPlan && (
										<div className={classes.planSummary}>
											<Typography variant="body1">
												Plano selecionado: <span className={classes.planName}>{selectedPlan.name}</span>
											</Typography>
											<Typography variant="body1" fontWeight="600">
												R$ {selectedPlan.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês
											</Typography>
										</div>
									)}

									<Avatar className={classes.avatar}>
										<LockOutlined style={{ fontSize: 30 }} />
									</Avatar>
									<Typography component="h1" variant="h5" className={classes.title}>
										Cadastre sua empresa
									</Typography>

									<Formik
										initialValues={initialState}
										enableReinitialize={true}
										validationSchema={UserSchema}
										onSubmit={(values, actions) => {
											setTimeout(() => {
												handleSignUp(values);
												actions.setSubmitting(false);
											}, 400);
										}}
									>
										{({ touched, errors, isSubmitting, values }) => (
											<Form className={classes.form}>
												<Grid container spacing={3}>
													<Grid item xs={12}>
														<Field
															as={TextField}
															autoComplete="name"
															name="name"
															error={touched.name && Boolean(errors.name)}
															helperText={touched.name && errors.name}
															variant="outlined"
															fullWidth
															id="name"
															label="Nome da Empresa"
															placeholder="Digite o nome da sua empresa"
															className={classes.inputField}
															InputProps={{
																startAdornment: (
																	<Business color="action" style={{ marginRight: 12 }} />
																),
															}}
														/>
													</Grid>

													<Grid item xs={12}>
														<Field
															as={TextField}
															variant="outlined"
															fullWidth
															id="email"
															label="Email"
															name="email"
															error={touched.email && Boolean(errors.email)}
															helperText={touched.email && errors.email}
															autoComplete="email"
															placeholder="seu@email.com"
															required
															className={classes.inputField}
															InputProps={{
																startAdornment: (
																	<Email color="action" style={{ marginRight: 12 }} />
																),
															}}
														/>
													</Grid>

													<Grid item xs={12}>
														<Field name="phone">
															{({ field, form }) => (
																<InputMask
																	mask="(99) 99999-9999"
																	value={field.value}
																	onChange={field.onChange}
																	onBlur={field.onBlur}
																>
																	{() => (
																		<TextField
																			variant="outlined"
																			fullWidth
																			id="phone"
																			label="Telefone"
																			error={touched.phone && Boolean(errors.phone)}
																			helperText={touched.phone && errors.phone}
																			placeholder="(00) 00000-0000"
																			required
																			className={classes.inputField}
																			InputProps={{
																				startAdornment: (
																					<Phone color="action" style={{ marginRight: 12 }} />
																				),
																			}}
																		/>
																	)}
																</InputMask>
															)}
														</Field>
													</Grid>

													<Grid item xs={12}>
														<Field
															as={TextField}
															variant="outlined"
															fullWidth
															name="password"
															error={touched.password && Boolean(errors.password)}
															helperText={touched.password && errors.password}
															label="Senha"
															type="password"
															id="password"
															placeholder="Mínimo 5 caracteres"
															autoComplete="new-password"
															required
															className={classes.inputField}
															InputProps={{
																startAdornment: (
																	<VpnKey color="action" style={{ marginRight: 12 }} />
																),
															}}
														/>
													</Grid>
												</Grid>

												<Button
													type="submit"
													fullWidth
													variant="contained"
													color="primary"
													className={classes.submit}
													disabled={isSubmitting}
													size="large"
												>
													{isSubmitting ? 'Criando conta...' : `Iniciar teste de ${trial} dias`}
												</Button>

												{/*<Typography variant="body2" color="textSecondary" align="center" style={{ marginTop: 16 }}>
                          Ao se registrar, você concorda com nossos{' '}
                          <Link href="#" color="primary" fontWeight="600">Termos de Serviço</Link> e{' '}
                          <Link href="#" color="primary" fontWeight="600">Política de Privacidade</Link>.
                        </Typography>*/}

												<Box mt={3} textAlign="center">
													<Typography variant="body2">
														Já tem uma conta?{' '}
														<Link
															component={RouterLink}
															to="/login"
															color="primary"
															style={{ fontWeight: '600' }}
														>
															Faça login aqui
														</Link>
													</Typography>
												</Box>
											</Form>
										)}
									</Formik>
								</Paper>
							</Slide>
						)}
					</div>
				</div>
			</Container>

			<Box mt={4} mb={4}>
				<Copyright />
			</Box>
		</div>
	);
};

export default SignUp;