import React from 'react';
import styled from 'styled-components';
import ee from 'event-emitter';
// get our fontawesome imports
import { faBell, faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Container = styled.div`
    background-color: #${props => props.color};
    border-radius: 20px;
    color: white;
    padding: 16px;
    position: absolute;
    top: ${props => props.top}px;
    right: 16px;
    z-index: 999;
    transition: top 0.5s ease;
`;

const emitter = new ee();

export const notify = (msg, isSuccess) => {
    //can add another argument
    emitter.emit('notification', msg, isSuccess);
}

export default class Notifications extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = {
            top: -100,
            msg: ''
        };

        this.timeOut = null;

        emitter.on('notification', (msg, isSuccess) => {
            this.onShow(msg, isSuccess);
        });
    }

    onShow = (msg, isSuccess) => {
        if(this.timeOut) {
            clearTimeout(this.timeOut);
            this.setState({ top: -100 }, () => {
                this.timeOut = setTimeout(() => {
                    this.showNotification(msg, isSuccess);
                }, 500);
            });
        } else {
            this.showNotification(msg, isSuccess);
        }
    }

    showNotification = (msg, isSuccess) => {
        this.setState({
            top: 16,
            msg: msg,
            isSuccess: isSuccess
        }, () => {
            this.timeOut = setTimeout(() => {
                this.setState({
                    top: -100
                })
            }, 3000);
        });
    }

    render() {

        if(this.state.isSuccess === "success") {
            return (
                <Container top={this.state.top} color="5bc0de">
                    <FontAwesomeIcon icon={faBell}></FontAwesomeIcon>&nbsp;{this.state.msg}
                </Container>
            );
        } else {
            return (
                <Container top={this.state.top} color="cc0000">
                    <FontAwesomeIcon icon={faExclamationCircle}></FontAwesomeIcon>&nbsp;{this.state.msg}
                </Container>
            );
        }
        
    }
}