import React, { Component } from 'react';
import io from 'socket.io-client';

class App extends Component {
  state = {
    isConnected:false,
    id:null,
    peeps: [],
    old_messages: [],
    answer: "" 
  }
  socket = null

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

    this.socket.on('youare',(answer)=>{
      this.setState({id:answer.id})
    })

    this.socket.on('peeps',(answer)=>{
      this.setState({peeps:answer})
    })

    this.socket.on('next',(message_from_server) =>
      console.log(message_from_server)
    )

    this.socket.on('addition',(message_from_server) =>
      console.log(message_from_server)
    )

    this.socket.emit('addition');
  }

  componentWillUnmount(){
    this.socket.close()
    this.socket = null
  }

  render() {
    const test = {text: "Phil is searching the answer", id: this.state.id, name: "Phil"};
    // const {date, id, name, text} = this.state.old_messages;
    return (
      <div className="App">
        <div>status: {this.state.isConnected ? 'connected' : 'disconnected'}</div>
        <button onClick={()=>this.socket.emit('ping!')}>Ping</button>
        <button onClick={()=>this.socket.emit('whoami')}>Who am I?</button>
        <button onClick={()=>this.socket.emit('give me next')}>Give me next</button>
        <h4> Hello: {this.state.id} </h4>
        <ul> {this.state.peeps ? this.state.peeps.map(x => <li key={x}> {x} </li>) : "null" }</ul>
        
        <button onClick={()=>this.socket.emit("message", test)}>Send a message</button>
        <div>
          {console.log("Test", this.state.old_message ? this.state.old_messages : "null")}
          {/* {this.state.old_messages.map(msg => {
            <div key={msg.id}> {msg.text} </div>
          })} */}
        </div>

        <input type="text" name="answer" onChange={e => this.setState({ answer: e.target.value })} />
        <button onClick={()=>this.socket.emit('answer',this.state.answer)}>submit answer</button>

      </div>
    );
  }
}

/*
please send the message "answer" with the answer to 90 + 25 + 16. You may send the answer as a string. You may also get a hint.
*/

export default App;
