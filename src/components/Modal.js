import { useApp } from "../contexts/AppContext";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

function Modal() {
  const { app, dispatch } = useApp();

  const handleClose = () => {
    dispatch({ type: "set_modal", payload: null });
  };

  return (
    <Dialog
      maxWidth="sm"
      fullWidth={true}
      open={app.modal !== null}
      onClose={handleClose}
    >
      {app.modal?.title && <DialogTitle children={app.modal.title} />}
      {app.modal?.content && (
        <DialogContent>
          <DialogContentText
            dangerouslySetInnerHTML={{
              __html: app.modal.content,
            }}
          />
        </DialogContent>
      )}
      {app.modal?.actions && (
        <DialogActions>
          {app.modal.actions.map((action, index) => (
            <Button
              variant="text"
              color={action.color}
              children={action.text}
              onClick={() => dispatch(action.action)}
              key={index}
            />
          ))}
        </DialogActions>
      )}
    </Dialog>
  );
}

export default Modal;
