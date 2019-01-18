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
        {/* Main Container */}
        <div> 
          <section className="section-connected-users"> 
            <div>status: {this.state.isConnected ? 'connected' : 'disconnected'}</div>
            <button onClick={()=>this.socket.emit('ping!')}>Ping</button>
            <h1> Peeps : {this.state.peeps.length} </h1>
            {this.state.peeps.map((x, i) => <div key={i}> {x} </div>)}
          </section>
          <section className="section-chat">
            {this.state.old_messages.slice(10, this.state.old_messages.length).map((x, i) => <div className="div-message" key={i}> <div> <h4>{x.name} <row>{x.date}</row></h4> </div> <div>{x.text}</div> </div>)}
          
          {/* Message Form  */}
          <form> 
            <textarea type="text" name="msgbox" onChange={e => this.setState({ new_message: e.target.value })} />
            <button onClick={()=>this.socket.emit("message", {text: this.state.new_message, id: this.state.id, name: this.state.name})}>Send a message</button>
          </form>
          </section>
        </div>
    </div>
    );
  }
}

/*
please send the message "answer" with the answer to 90 + 25 + 16. You may send the answer as a string. You may also get a hint.
*/

export default App;
