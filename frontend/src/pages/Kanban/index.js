import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import api from "../../services/api";
import { AuthContext } from "../../context/Auth/AuthContext";
import Board from 'react-trello';
import { toast } from "react-toastify";
import LaneTitle from "../../components/Kanban/LaneTitle";
import CardTitle from "../../components/Kanban/CardTitle";
import FooterButtons from "../../components/Kanban/FooterButtons";
import {
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tooltip
} from "@material-ui/core";
import { MoreVert, Archive, Delete } from "@material-ui/icons";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    padding: theme.spacing(2),
    height: "calc(100vh - 64px)",
    // Matching Dashboard Background (Clean Light Grey)
    background: "#F4F6F8",
    fontFamily: "'Outfit', sans-serif",
    overflow: "hidden",
    [theme.breakpoints.down('sm')]: {
      height: "auto",
      minHeight: "100vh",
      padding: theme.spacing(1),
    }
  },
  boardContainer: {
    width: "100%",
    fontFamily: "'Outfit', sans-serif",
    "& .smooth-dnd-container": {
      minHeight: "60vh",
    },
    "& .react-trello-lane": {
      background: "rgba(255, 255, 255, 0.6) !important", // Visible glass background
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(0, 0, 0, 0.05)",
      borderRadius: "25px",
      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.05)",
      margin: "0 14px",
      [theme.breakpoints.down('sm')]: {
        margin: "8px 0",
        width: "100% !important",
      }
    },
    "& .react-trello-card": {
      // Very Light Green for Cards
      background: "#EFFBF5 !important",
      border: "1px solid #C8E6C9", // Subtle green border
      borderRadius: "20px",
      marginBottom: "14px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.03)",
      transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
      fontFamily: "'Outfit', sans-serif",
      "&:hover": {
        transform: "translateY(-5px) scale(1.02)",
        boxShadow: "0 10px 20px rgba(0, 105, 92, 0.12)",
        borderColor: "#00695C",
      }
    },
    "& .react-trello-card-draggable": {
      cursor: "grab",
    },
    "& .react-trello-card-title": {
      fontSize: "15px",
      fontWeight: "700", // Thicker font
      color: "#2D3436", // Strong dark text for maximum contrast
      fontFamily: "'Outfit', sans-serif",
      lineHeight: "1.4",
      marginBottom: "8px",
    },
    "& .react-trello-lane-header": {
      // Deep Green Gradient
      background: "linear-gradient(135deg, #00695C 0%, #004D40 100%)",
      padding: "16px 20px",
      color: "#FFFFFF",
      fontWeight: "800",
      fontSize: "18px",
      fontFamily: "'Outfit', sans-serif",
      borderTopLeftRadius: "25px",
      borderTopRightRadius: "25px",
      boxShadow: "0 4px 15px rgba(0, 105, 92, 0.3)", // Glow effect
      marginBottom: "16px",
      textAlign: "center",
      letterSpacing: "0.5px"
    },
    cardActions: {
      display: "flex",
      justifyContent: "flex-end",
      padding: "8px 0 0 0",
      opacity: 0.8,
      transition: "opacity 0.2s",
      "&:hover": {
        opacity: 1,
      }
    },
  }
}));

const Kanban = () => {
  const classes = useStyles();
  const { user } = useContext(AuthContext);
  const jsonString = user.queues.map(queue => queue.UserQueue.queueId);

  const [tags, setTags] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [laneQuantities, setLaneQuantities] = useState({});
  const [file, setFile] = useState({ lanes: [] });
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [actionType, setActionType] = useState('');

  const fetchTags = async () => {
    try {
      const response = await api.get("/tags/kanban");
      const fetchedTags = response.data.lista || [];
      setTags(fetchedTags);
    } catch (error) {
      console.log(error);
      toast.error("Erro ao carregar tags");
    }
  };

  const fetchTickets = async () => {
    try {
      const { data } = await api.get("/ticket/kanban", {
        params: {
          queueIds: JSON.stringify(jsonString),
          teste: true
        }
      });
      setTickets(data.tickets);
    } catch (err) {
      console.log(err);
      toast.error("Erro ao carregar tickets");
      setTickets([]);
    }
  };

  const handleMenuClick = (event, ticket) => {
    setAnchorEl(event.currentTarget);
    setSelectedTicket(ticket);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleActionClick = (type) => {
    setActionType(type);
    setOpenDialog(true);
    handleMenuClose();
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedTicket(null);
  };

  const confirmAction = async () => {
    try {
      if (actionType === 'archive') {
        // Remove todas as tags sem deletar o ticket
        await api.delete(`/ticket-tags/${selectedTicket.id}`);
        toast.success('Ticket arquivado com sucesso');
      } else if (actionType === 'delete') {
        // Aqui você pode implementar a lógica para deletar se necessário
        // await api.delete(`/tickets/${selectedTicket.id}`);
        toast.error('Função de deletar desativada para proteger as conversas');
      }

      fetchTickets();
      fetchTags();
    } catch (err) {
      console.log(err);
      toast.error('Erro ao processar ação');
    } finally {
      handleDialogClose();
    }
  };

  useEffect(() => {
    fetchTags();
    fetchTickets();
  }, []);

  useEffect(() => {
    const newQuantities = {};

    newQuantities["0"] = tickets.filter(ticket => ticket.tags.length === 0).length;

    tags.forEach(tag => {
      const count = tickets.filter(ticket => ticket.tags.some(t => t.id === tag.id)).length;
      newQuantities[tag.id.toString()] = count;
    });

    setLaneQuantities(newQuantities);
  }, [tags, tickets]);

  useEffect(() => {
    const lanes = [
      {
        id: "0",
        title: <LaneTitle firstLane quantity={laneQuantities["0"]}>Em aberto</LaneTitle>,
        style: {
          backgroundColor: "#f0f2f5",
          borderTop: "4px solid #6c757d"
        },
        cards: tickets.filter(ticket => ticket.tags.length === 0).map(ticket => ({
          id: ticket.id.toString(),
          title: <CardTitle ticket={ticket} userProfile={user.profile} />,
          label: (
            <div className={classes.cardActions}>
              <Tooltip title="Ações">
                <IconButton
                  size="small"
                  onClick={(e) => handleMenuClick(e, ticket)}
                >
                  <MoreVert fontSize="small" />
                </IconButton>
              </Tooltip>
            </div>
          ),
          description: <FooterButtons ticket={ticket} />,
          draggable: true,
          href: "/tickets/" + ticket.uuid,
        })),
      },
      ...tags.map(tag => ({
        id: tag.id.toString(),
        title: <LaneTitle squareColor={tag.color} quantity={laneQuantities[tag.id.toString()]}>{tag.name}</LaneTitle>,
        style: {
          backgroundColor: `${tag.color}10`,
          borderTop: `4px solid ${tag.color}`
        },
        cards: tickets.filter(ticket => ticket.tags.some(t => t.id === tag.id)).map(ticket => ({
          id: ticket.id.toString(),
          title: <CardTitle ticket={ticket} userProfile={user.profile} />,
          label: (
            <div className={classes.cardActions}>
              <Tooltip title="Ações">
                <IconButton
                  size="small"
                  onClick={(e) => handleMenuClick(e, ticket)}
                >
                  <MoreVert fontSize="small" />
                </IconButton>
              </Tooltip>
            </div>
          ),
          description: <FooterButtons ticket={ticket} />,
          draggable: true,
          href: "/tickets/" + ticket.uuid,
        })),
      })),
    ];

    setFile({ lanes });
  }, [tags, tickets, laneQuantities]);

  const handleCardMove = async (sourceLaneId, targetLaneId, cardId) => {
    try {
      await api.delete(`/ticket-tags/${cardId}`);
      if (targetLaneId !== "0") {
        await api.put(`/ticket-tags/${cardId}/${targetLaneId}`);
      }
      toast.success('Ticket movido com sucesso');

      fetchTickets();
      fetchTags();
    } catch (err) {
      console.log(err);
      toast.error('Erro ao mover ticket');
    }
  };

  return (
    <div className={classes.root}>
      <div className={classes.boardContainer}>
        <Board
          data={file}
          onCardMoveAcrossLanes={handleCardMove}
          laneStyle={{
            maxHeight: "80vh",
            minWidth: "280px",
            width: "280px"
          }}
          cardStyle={{
            backgroundColor: "white",
            padding: "12px",
            marginBottom: "12px"
          }}
          hideCardDeleteIcon
          style={{
            backgroundColor: 'transparent',
            height: "100%",
            fontFamily: "'Roboto', sans-serif",
          }}
          responsive
          collapsibleLanes
        />
      </div>

      {/* Menu de ações */}
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleActionClick('archive')}>
          <Archive fontSize="small" style={{ marginRight: 8 }} />
          Finalizar
        </MenuItem>
      </Menu>

      {/* Dialog de confirmação */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>
          {actionType === 'archive' ? 'Desvincular Ticket' : 'Excluir Ticket'}
        </DialogTitle>
        <DialogContent>
          {actionType === 'archive' ? (
            <p>Tem certeza que deseja desvincular este ticket de todas as tags kanban? O chat permanecerá intacto.</p>
          ) : (
            <p>Atenção: Esta ação é irreversível. Todas as mensagens serão perdidas.</p>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={confirmAction} color="secondary" variant="contained">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Kanban;