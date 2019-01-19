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
  }
  socket = null

  sendMsg = () =>
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

  groupMessage = (msgList) =>
  {
    // if (!msgList)
    //   return toast.error("Unable to load old messages");

    var owner = "";
    var msgarray = [];
    var structure = [];
    var j = 0;
    // Loop on all messages
    msgList.map((data, i) => {
      // if it's not the first message and the owner is the same as last one get in this
      // !We Start by the else 
      if (i !== 0 && data.name === msgList[i - 1].name) {
      {
        // Once we have our structure build an array with all the old/new messages. since it's a loop we can identify the owner just before filling that structure.
        structure[owner].text.splice(i, 0, data.text);
        // @Todo Find index of last msg for owner and get his date
        // This works but unefficient
        if (structure[owner].date !== data.date) {
          structure[owner].date = data.date;
        }
      }
      // Fill a new structure based on the amount of conversation 
      } else {
        owner = j; // !Without that we can't fill the message at the right place
        structure.push({
          id: data.id,
          name: data.name,
          text: [data.text].concat(msgarray),
          date: data.date
        });
        j++; // !Update the owner when the job is done.
      }
    })

    return structure;
  }

  handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.sendMsg();
    }
  }
  
  onSubmit = (event) => {
    event.preventDefault();
    this.sendMsg();
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
      this.setState({old_messages: messages})
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

  componentDidUpdate(){
  }

  componentWillUnmount(){
    this.socket.close()
    this.socket = null
  }

  render() {
    // ! Modify the old list so we can print all message at once
    const msgList = this.groupMessage(this.state.old_messages);
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
          {msgList.map((x, i) =>
          <li key={i} className={x.name === this.state.name ? "self" : "other"}>
              <div className="msg">
                <div className="user"> <h2>{x.name === this.state.name ? x.name : `${x.name} - ${x.id}`} </h2>
                {x.text.map((x, i) => 
                <p key={i}>
                  <Emoji text={x}></Emoji>
                </p>
                )
                }
                <time>{x.date}</time>
                </div>
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
          </form>
          <div className="emojis"></div>
        </div>
    </div>
    );
  }
}

export default App;
