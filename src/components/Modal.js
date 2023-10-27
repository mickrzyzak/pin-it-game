import { useApp } from "../contexts/AppContext";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

function Modal() {
  const { app } = useApp();

  return (
    <Dialog maxWidth="sm" open={app.modal !== null}>
      {app.modal?.title && <DialogTitle>{app.modal.title}</DialogTitle>}
      {app.modal?.content && (
        <DialogContent>
          <DialogContentText>{app.modal.content}</DialogContentText>
        </DialogContent>
      )}
      {app.modal?.actions && <DialogActions>{app.modal.actions}</DialogActions>}
    </Dialog>
  );
}

export default Modal;
