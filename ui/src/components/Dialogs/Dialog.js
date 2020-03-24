import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import ee from 'event-emitter';

const emitter = new ee();

export const showDialog = (open, msgType, func) => {
    //can add another argument
    emitter.emit('dialog', open, msgType, func);
}

export default class AlertDialog extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
            msg: '',
            callBackFunc: {}
        };

        emitter.on('dialog', (open, msgType, func) => {
            this.onShow(open, msgType, func);
        });

    }

    onShow = (open, msgType, func) => {
        this.setState({ open: open, callBackFunc: func });
        if(msgType === "add") {
            this.setState({ msg: "Do you really want to add this?" });
        } else if (msgType === "update") {
            this.setState({ msg: "Can you confirm your changes?" });
        } else {
            this.setState({ msg: "Are you sure you want to delete this?" });
        }
    }

    handleClose() {
        this.setState({ open: false });
    }

    handleConfirm() {
        this.setState({ open: false });
        this.state.callBackFunc(Promise.resolve(true));
    }

    render() {
        return(
            <>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose.bind(this)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        Confirmation    
                    </DialogTitle>
                    <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {this.state.msg}
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={this.handleClose.bind(this)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={this.handleConfirm.bind(this)} color="primary" autoFocus>
                        Confirm
                    </Button>
                    </DialogActions>
                </Dialog>
            </>
        );
    }
    
    /*const [open, setOpen] = useState(false);
    const [msg, setMsg] = useState('');

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        onLoad();
    }, []);

    function onLoad() {
        if(props.msgType === "add") {
            setMsg("Do you really want to add this?");
        } else if (props.msgType === "update") {
            setMsg("Can you confirm your changes?")
        } else {
            setMsg("Are you sure you want to delete this?")
        }
    }

    return (
        <div>
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                Confirmation    
            </DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-description">
                {msg}
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button onClick={handleClose} color="primary">
                Cancel
            </Button>
            <Button onClick={handleClose} color="primary" autoFocus>
                Confirm
            </Button>
            </DialogActions>
        </Dialog>
        </div>
    );*/
}