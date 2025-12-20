import React, { useContext, useState, useEffect, useRef } from "react";
import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import Typography from "@material-ui/core/Typography";
import { Button } from "@material-ui/core";

import SpeedIcon from "@material-ui/icons/Speed";
import GroupIcon from "@material-ui/icons/Group";
import AssignmentIcon from "@material-ui/icons/Assignment";
import PersonIcon from "@material-ui/icons/Person";
import CallIcon from "@material-ui/icons/Call";
import MobileFriendlyIcon from '@material-ui/icons/MobileFriendly';
import StoreIcon from '@material-ui/icons/Store';
import RecordVoiceOverIcon from "@material-ui/icons/RecordVoiceOver";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import HourglassEmptyIcon from "@material-ui/icons/HourglassEmpty";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ForumIcon from "@material-ui/icons/Forum";
import FilterListIcon from "@material-ui/icons/FilterList";
import ClearIcon from "@material-ui/icons/Clear";
import SendIcon from "@material-ui/icons/Send";
import MessageIcon from "@material-ui/icons/Message";
import AccessAlarmIcon from "@material-ui/icons/AccessAlarm";
import TimerIcon from "@material-ui/icons/Timer";

import { makeStyles } from "@material-ui/core/styles";
import { grey, blue } from "@material-ui/core/colors";
import { toast } from "react-toastify";

import Chart from "./Chart";
import ButtonWithSpinner from "../../components/ButtonWithSpinner";
import CardCounter from "../../components/Dashboard/CardCounter";
import TableAttendantsStatus from "../../components/Dashboard/TableAttendantsStatus";
import { isArray } from "lodash";

import { AuthContext } from "../../context/Auth/AuthContext";

import useDashboard from "../../hooks/useDashboard";
import useTickets from "../../hooks/useTickets";
import useUsers from "../../hooks/useUsers";
import useContacts from "../../hooks/useContacts";
import useMessages from "../../hooks/useMessages";
import { ChatsUser } from "./ChartsUser";

import Filters from "./Filters";
import { isEmpty } from "lodash";
import moment from "moment";
import { ChartsDate } from "./ChartsDate";
import ChartsAppointmentsAtendent from "./ChartsAppointmentsAtendent";
import ChartsRushHour from "./ChartsRushHour";
import ChartsDepartamentRatings from "./ChartsDepartamentRatings";

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    fontFamily: "'Outfit', sans-serif",
  },
  card: {
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    height: "100%",
    borderRadius: 20, // Modern curve
    boxShadow: theme.palette.type === 'light'
      ? '0 8px 32px 0 rgba(31, 38, 135, 0.15)' // Light Shadow
      : '0 8px 32px 0 rgba(0, 0, 0, 0.3)', // Dark Shadow
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "translateY(-5px)",
      boxShadow: theme.palette.type === 'light'
        ? '0 12px 40px 0 rgba(31, 38, 135, 0.25)'
        : '0 12px 40px 0 rgba(0, 168, 132, 0.3)', // Green glow on hover in dark mode
    },
    // Glassmorphism logic
    background: theme.palette.type === 'light'
      ? 'rgba( 255, 255, 255, 0.75 )'
      : 'rgba( 30, 30, 30, 0.60 )',
    backdropFilter: 'blur( 12px )',
    webkitBackdropFilter: 'blur( 12px )',
    border: '1px solid rgba( 255, 255, 255, 0.18 )',
    color: theme.palette.text.primary, // Use text color instead of white-always
    position: "relative",
    overflow: "hidden",
  },
  cardContent: {
    display: "flex",
    alignItems: "center",
    flex: 1,
    zIndex: 1,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: "0.9rem",
    fontWeight: 500,
    marginBottom: theme.spacing(0.5),
    opacity: 0.8,
    textTransform: "uppercase",
    letterSpacing: "1px",
    fontFamily: "'Outfit', sans-serif",
  },
  cardValue: {
    fontSize: "2.5rem",
    fontWeight: 700,
    lineHeight: 1,
    marginTop: theme.spacing(1),
    color: theme.palette.type === 'light' ? theme.palette.primary.main : '#FFFFFF',
    fontFamily: "'Outfit', sans-serif",
    textShadow: theme.palette.type === 'dark' ? '0 0 20px rgba(0, 255, 127, 0.4)' : 'none',
  },
  cardIcon: {
    fontSize: "3rem",
    marginLeft: theme.spacing(2),
    opacity: 0.2, // Subtle watermark effect
    position: "absolute",
    right: 16,
    bottom: 16,
    transform: "rotate(-15deg)",
    color: theme.palette.primary.main,
  },
  fixedHeightPaper: {
    padding: theme.spacing(3),
    borderRadius: 20,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    background: theme.palette.type === 'light'
      ? 'rgba( 255, 255, 255, 0.75 )'
      : 'rgba( 30, 30, 30, 0.60 )',
    backdropFilter: 'blur( 12px )',
    webkitBackdropFilter: 'blur( 12px )',
    border: '1px solid rgba( 255, 255, 255, 0.18 )',
    boxShadow: theme.palette.type === 'light'
      ? '0 8px 32px 0 rgba(31, 38, 135, 0.15)'
      : '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
  },
  filterSection: {
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    borderRadius: 20,
    background: theme.palette.type === 'light'
      ? 'rgba( 255, 255, 255, 0.75 )'
      : 'rgba( 30, 30, 30, 0.60 )',
    backdropFilter: 'blur( 12px )',
    webkitBackdropFilter: 'blur( 12px )',
    border: '1px solid rgba( 255, 255, 255, 0.18 )',
    boxShadow: theme.palette.type === 'light'
      ? '0 4px 16px 0 rgba(31, 38, 135, 0.1)'
      : '0 4px 16px 0 rgba(0, 0, 0, 0.2)',
  },
}));

const Dashboard = () => {
  const classes = useStyles();

  const [counters, setCounters] = useState({});
  const [attendants, setAttendants] = useState([]);
  const [period, setPeriod] = useState(0);
  const [filterType, setFilterType] = useState(1);
  const [dateFrom, setDateFrom] = useState(moment("1", "D").format("YYYY-MM-DD"));
  const [dateTo, setDateTo] = useState(moment().format("YYYY-MM-DD"));
  const [loading, setLoading] = useState(false);

  const { find } = useDashboard();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    async function firstLoad() {
      await fetchData();
    }
    setTimeout(() => {
      firstLoad();
    }, 1000);
  }, []);

  async function handleChangePeriod(value) {
    setPeriod(value);
  }

  async function handleChangeFilterType(value) {
    setFilterType(value);
    if (value === 1) {
      setPeriod(0);
    } else {
      setDateFrom("");
      setDateTo("");
    }
  }

  async function fetchData() {
    setLoading(true);

    let params = {};

    if (period > 0) {
      params = { days: period };
    }

    if (!isEmpty(dateFrom) && moment(dateFrom).isValid()) {
      params = { ...params, date_from: moment(dateFrom).format("YYYY-MM-DD") };
    }

    if (!isEmpty(dateTo) && moment(dateTo).isValid()) {
      params = { ...params, date_to: moment(dateTo).format("YYYY-MM-DD") };
    }

    if (Object.keys(params).length === 0) {
      toast.error("Parametrize o filtro");
      setLoading(false);
      return;
    }

    const data = await find(params);
    setCounters(data.counters);
    setAttendants(isArray(data.attendants) ? data.attendants : []);
    setLoading(false);
  }

  function formatTime(minutes) {
    return moment()
      .startOf("day")
      .add(minutes, "minutes")
      .format("HH[h] mm[m]");
  }

  const GetUsers = () => {
    return attendants.filter(user => user.online).length;
  };

  const GetContacts = (all) => {
    let props = all ? {} : {};
    const { count } = useContacts(props);
    return count;
  };

  function renderFilters() {
    if (filterType === 1) {
      return (
        <>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Data Inicial"
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              InputLabelProps={{ shrink: true }}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Data Final"
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              InputLabelProps={{ shrink: true }}
              variant="outlined"
            />
          </Grid>
        </>
      );
    } else {
      return (
        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="period-selector-label">Período</InputLabel>
            <Select
              labelId="period-selector-label"
              value={period}
              onChange={(e) => handleChangePeriod(e.target.value)}
              label="Período"
            >
              <MenuItem value={0}>Nenhum selecionado</MenuItem>
              <MenuItem value={3}>Últimos 3 dias</MenuItem>
              <MenuItem value={7}>Últimos 7 dias</MenuItem>
              <MenuItem value={15}>Últimos 15 dias</MenuItem>
              <MenuItem value={30}>Últimos 30 dias</MenuItem>
              <MenuItem value={60}>Últimos 60 dias</MenuItem>
              <MenuItem value={90}>Últimos 90 dias</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      );
    }
  }

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Grid container spacing={3}>
        {/* Cards Section */}
        <Grid container item xs={12} spacing={3} justifyContent="space-between">
          {/* Conexões Ativas */}
          {user.super && (
            <Grid item xs={12} sm={6} md={3}>
              <Paper className={classes.card}>
                <div className={classes.cardContent}>
                  <div className={classes.cardText}>
                    <Typography variant="subtitle2" className={classes.cardTitle}>
                      Conexões Ativas
                    </Typography>
                    <Typography variant="h4" className={classes.cardValue}>
                      {counters.totalWhatsappSessions || 0}
                    </Typography>
                  </div>
                  <MobileFriendlyIcon className={classes.cardIcon} />
                </div>
              </Paper>
            </Grid>
          )}

          {/* Empresas */}
          {user.super && (
            <Grid item xs={12} sm={6} md={3}>
              <Paper className={classes.card}>
                <div className={classes.cardContent}>
                  <div className={classes.cardText}>
                    <Typography variant="subtitle2" className={classes.cardTitle}>
                      Empresas
                    </Typography>
                    <Typography variant="h4" className={classes.cardValue}>
                      {counters.totalCompanies || 0}
                    </Typography>
                  </div>
                  <StoreIcon className={classes.cardIcon} />
                </div>
              </Paper>
            </Grid>
          )}

          {/* Em Conversa */}
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Paper className={classes.card}>
              <div className={classes.cardContent}>
                <div className={classes.cardText}>
                  <Typography variant="subtitle2" className={classes.cardTitle}>
                    Em Conversa
                  </Typography>
                  <Typography variant="h4" className={classes.cardValue}>
                    {counters.supportHappening || 0}
                  </Typography>
                </div>
                <CallIcon className={classes.cardIcon} />
              </div>
            </Paper>
          </Grid>

          {/* Aguardando */}
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Paper className={classes.card}>
              <div className={classes.cardContent}>
                <div className={classes.cardText}>
                  <Typography variant="subtitle2" className={classes.cardTitle}>
                    Aguardando
                  </Typography>
                  <Typography variant="h4" className={classes.cardValue}>
                    {counters.supportPending || 0}
                  </Typography>
                </div>
                <HourglassEmptyIcon className={classes.cardIcon} />
              </div>
            </Paper>
          </Grid>

          {/* Novos Contatos */}
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Paper className={classes.card}>
              <div className={classes.cardContent}>
                <div className={classes.cardText}>
                  <Typography variant="subtitle2" className={classes.cardTitle}>
                    Novos Contatos
                  </Typography>
                  <Typography variant="h4" className={classes.cardValue}>
                    {GetContacts(true) || 0}
                  </Typography>
                </div>
                <GroupAddIcon className={classes.cardIcon} />
              </div>
            </Paper>
          </Grid>

          {/* T.M. de Conversa */}
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Paper className={classes.card}>
              <div className={classes.cardContent}>
                <div className={classes.cardText}>
                  <Typography variant="subtitle2" className={classes.cardTitle}>
                    T.M. de Conversa
                  </Typography>
                  <Typography variant="h4" className={classes.cardValue}>
                    {formatTime(counters.avgSupportTime || 0)}
                  </Typography>
                </div>
                <AccessAlarmIcon className={classes.cardIcon} />
              </div>
            </Paper>
          </Grid>

          {/* Finalizados */}
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Paper className={classes.card}>
              <div className={classes.cardContent}>
                <div className={classes.cardText}>
                  <Typography variant="subtitle2" className={classes.cardTitle}>
                    Finalizados
                  </Typography>
                  <Typography variant="h4" className={classes.cardValue}>
                    {counters.supportFinished || 0}
                  </Typography>
                </div>
                <CheckCircleIcon className={classes.cardIcon} />
              </div>
            </Paper>
          </Grid>

          {/* T.M. de Espera */}
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Paper className={classes.card}>
              <div className={classes.cardContent}>
                <div className={classes.cardText}>
                  <Typography variant="subtitle2" className={classes.cardTitle}>
                    T.M. de Espera
                  </Typography>
                  <Typography variant="h4" className={classes.cardValue}>
                    {formatTime(counters.avgWaitTime || 0)}
                  </Typography>
                </div>
                <TimerIcon className={classes.cardIcon} />
              </div>
            </Paper>
          </Grid>
        </Grid>

        {/* Filters Section */}
        <Grid item xs={12}>
          <Paper className={classes.filterSection}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="filter-type-label">Tipo de Filtro</InputLabel>
                  <Select
                    labelId="filter-type-label"
                    value={filterType}
                    onChange={(e) => handleChangeFilterType(e.target.value)}
                    label="Tipo de Filtro"
                  >
                    <MenuItem value={1}>Filtro por Data</MenuItem>
                    <MenuItem value={2}>Filtro por Período</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {renderFilters()}

              <Grid item xs={12} sm={6} md={4}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={fetchData}
                  disabled={loading}
                  size="large"
                >
                  Filtrar
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Attendants Status */}
        {attendants.length > 0 && (
          <Grid item xs={12}>
            <TableAttendantsStatus attendants={attendants} loading={loading} />
          </Grid>
        )}

        {/* Charts Section */}
        <Grid item xs={12}>
          <Paper className={classes.fixedHeightPaper}>
            <ChatsUser />
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper className={classes.fixedHeightPaper}>
            <ChartsDate />
          </Paper>
        </Grid>

        <ChartsAppointmentsAtendent />
        <ChartsRushHour />
        <ChartsDepartamentRatings />
      </Grid>
    </Container>
  );
};

export default Dashboard;