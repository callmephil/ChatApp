import React, { Component } from 'react';
import io from 'socket.io-client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css'
import Emoji from 'react-emoji-render';

class App extends Component {
  state = {
    isConnected:false,
    id:null,
    peeps: [],
    old_messages: [],
    name: "Phil",
    new_message: "" 
  }
  socket = null

  send = () =>
  {
    if (!this.state.new_message.trim())
      toast.error("🦄 Text is required...")
    else {
      this.socket.emit("message", {
        text: this.state.new_message,
        id: this.state.id,
        name: this.state.name
      });
      this.setState({
        new_message: ""
      });
    }
  }

  handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      this.send();
    }
  }
  
  onSubmit = (event) => {
    event.preventDefault();
    this.send();
  }

  componentDidMount(){
    this.socket = io('http://codicoda.com:8000');

    this.socket.on('connect', () => {
      this.setState({isConnected:true})
    })

    this.socket.on('disconnect', () => {
      this.setState({isConnected:false})
    })

    /** this will be useful way, way later **/
    this.socket.on('room', (messages) => {
      this.setState({old_messages:messages})
    })

    this.socket.on("room_message",(messages)=> {
     if (messages.name !== this.state.name) 
        toast.info(`🦄 New message from ${messages.name}`);
      else
        toast.success('🦄 Message Sent');

      this.setState({old_messages: this.state.old_messages.concat(messages)});
    })

    if (this.state.id === null)
      this.socket.emit('whoami');
    
    this.socket.on('youare',(answer)=>{
      this.setState({id:answer.id})
    })

    this.socket.on('peeps',(answer)=>{
      this.setState({peeps:answer})
    })
  }

  componentWillUnmount(){
    this.socket.close()
    this.socket = null
  }

  render() {
    return (
      <div className="App">
        <ToastContainer 
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick={true}
          rtl={false}
          pauseOnVisibilityChange
          draggable
          pauseOnHover
        />

        <div className="menu">
          <div className="name">Codi Chat Room</div>
          <div className="members">
          <b>ID: {this.state.id}, Status: {this.state.isConnected ? `Connected` : 'Disconnected'}, </b> Peeps : {this.state.peeps.length}</div>
        </div>
        <ol className="chat">
          {this.state.old_messages.map((x, i) => 
          <li key={i} className={x.name === this.state.name ? "self" : "other"}>
              <div className="msg">
                <div className="user">{x.name === this.state.name ? x.name : `${x.name} - ${x.id}`}</div>
                <p><Emoji text={x.text}></Emoji></p>
                <time>{x.date}</time>
              </div>
          </li>
          )}
        </ol>

        <div className="typezone">
          <form onKeyPress={this.handleKeyPress} onSubmit={this.onSubmit}>
              <textarea 
                placeholder="Hep Hep..." 
                type="text" 
                value={this.state.new_message}
                name="msgbox"
                onChange={e => this.setState({ new_message: e.target.value })}
               />
               <button type="submit" className="send"/>
               <div class="emojis"></div>
          </form>
        </div>
    </div>
    );
  }
}

export default App;
