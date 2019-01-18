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
      console.log(messages)
      this.setState({old_messages:messages})
    })

    this.socket.on('pong!',(additionalStuff)=>{
      console.log('Phil is testing', additionalStuff)
    })  

    this.socket.emit('whoami'); // Auto Update
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
          <div className="members"><b>Status: {this.state.isConnected ? 'connected' : 'disconnected'},
          </b> Peeps : {this.state.peeps.length}</div>
        </div>
        <ol className="chat">
          {this.state.old_messages.map((x, i) => 
          x.name === "Phil" ?
          <li key={i} className="self">
              <div className="msg">
                <div className="user">{x.name}</div>
                <p>{x.text}</p>
                <time>{x.date}</time>
              </div>
          </li>
          :
          <li key={i} className="other">
              <div className="msg">
                <div className="user">{x.name}</div>
                <p>{x.text}</p>
                <time>{x.date}</time>
              </div>
          </li>
          )}
        </ol>
        <div className="typezone">
          <form>
              <textarea 
                placeholder="Hep Hep..." 
                type="text" 
                name="msgbox" 
                onChange={e => this.setState({ new_message: e.target.value })} 
                onKeyPress={this.handleKeyPress}/>
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
