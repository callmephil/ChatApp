import React, { Component } from 'react';
import io from 'socket.io-client';
import './App.css'

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

  handleKeyPress = (event) => {
    if(event.key === 'Enter'){
      event.preventDefault();
      this.socket.emit("message", {text: this.state.new_message, id: this.state.id, name: this.state.name});
      alert("Message Sent !");
      this.setState({new_message: ""});
    }
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
      this.setState({old_messages: this.state.old_messages.concat(messages)});
    })

    this.socket.on('pong!',(additionalStuff)=>{
      console.log('Phil is testing', additionalStuff)
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
        <div className="menu">
          <div className="name">Codi Chat </div>
          <div className="members">
          <b>ID: {this.state.id}, Status: {this.state.isConnected ? `Connected` : 'Disconnected'}, </b> Peeps : {this.state.peeps.length}</div>
        </div>
        <ol className="chat">
          {this.state.old_messages.map((x, i) => 
          <li key={i} className={x.name === this.state.name ? "self" : "other"}>
              <div className="msg">
                <div className="user">{x.name}</div>
                <p>{x.text}</p>
                <time>{x.date}</time>
              </div>
          </li>
          )}
        </ol>

        <div className="typezone">
          <form  onKeyPress={this.handleKeyPress}>
              <textarea 
                placeholder="Hep Hep..." 
                type="text" value={this.state.new_message}
                name="msgbox" 
                onChange={e => this.setState({ new_message: e.target.value })} 
               />
              {/* <button onClick={()=>}>Send a message</button> */}
          </form>
        </div>
    </div>
    );
  }
}

/*
please send the message "answer" with the answer to 90 + 25 + 16. You may send the answer as a string. You may also get a hint.
*/

export default App;
