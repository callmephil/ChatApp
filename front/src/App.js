import React, { Component } from 'react';
import io from 'socket.io-client';

class App extends Component {
  state = {
    isConnected:false,
    id:null,
    peeps: []
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
    this.socket.on('room', old_messages => console.log(old_messages))

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
  }

  componentWillUnmount(){
    this.socket.close()
    this.socket = null
  }

  render() {
    return (
      <div className="App">
        <div>status: {this.state.isConnected ? 'connected' : 'disconnected'}</div>
        <button onClick={()=>this.socket.emit('ping!')}>Ping</button>
        <button onClick={()=>this.socket.emit('whoami')}>Who am I?</button>
        <button onClick={()=>this.socket.emit('give me next')}>Give me next</button>
        <h4> Hello: {this.state.id} </h4>
        <ul> {this.state.peeps ? this.state.peeps.map(x => <li key={x}> {x} </li>) : "null" }</ul>
      </div>
    );
  }
}

export default App;
