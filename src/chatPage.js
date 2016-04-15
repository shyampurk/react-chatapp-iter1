var React = require('react');
$=jQuery = require('jquery');

const subscribe_key = `sub-c-e30e886c-f4ba-11e5-ba5f-0619f8945a4f`,
    publish_key  = `pub-c-2ec32538-4d6b-4839-b527-2767e0070f94`

const pubnub = PUBNUB.init({                         
    publish_key   : publish_key,
    subscribe_key : subscribe_key
});
var ChatBody = React.createClass({
	render:function(){
		
			var messageList = this.props.data.map(function(message,index){
				return(

				     <li className="collection-item avatar" key={index} >
				       <img src={message.avatar_url} className="circle" />
				       <span className="title">Anonymous robot #{message.uid}</span>
				       <p><i className="prefix mdi-action-alarm"></i>
				       <span className="message-date">{message.createdTime}</span><br />{message.message}
				       </p>
				     </li>		     
    );
			});

		return (
				<ul className="collection">			
    				{messageList}  
    				  	</ul>	 	
			);
	}
});

var ChatForm = React.createClass({
	
	handleSubmit:function(e)
	{
		e.preventDefault();
		var message = this.refs.Message.value.trim();
		var time = new Date().getTime(),
		date = new Date(time),
		datestring = date.toUTCString().slice(0, -4);
		var avatar_url = "http://robohash.org/" + this.props.user + "?set=set2&bgset=bg2&size=70x70";
		var UUID = this.props.user;
		if(!message){
			return;
		}
		this.props.onMessageSubmit({message: message,createdTime:datestring,avatar_url:avatar_url,uid:UUID});
        this.refs.Message.value='';
        return;	
	},
	
	render:function(){
			var UUID = this.props.user;
			var avatar_url = "http://robohash.org/" + this.props.user + "?set=set2&bgset=bg2&size=70x70";
		return (
				<footer className="teal">
					<form  className="container" onSubmit= {this.handleSubmit}>
			       <div className="row">
			         <div className="input-field col s10">
			           <i className="prefix mdi-communication-chat"></i>
			           <input type="text" placeholder="Type your message" ref="Message
			           "/>
			           <span className="chip left">
			             <img src={avatar_url} />
			            Anonymous robot #{UUID}
			           </span>
			         </div>
			         <div className="input-field col s2">
			           <button  id="btn" type="submit" className="waves-effect waves-light btn-floating btn-large">
			             <i className="mdi-content-send"></i>
			           </button>
			         </div>
			       </div>
			      </form>
				</footer>
			);
	}
})

var Main = React.createClass({
	scrollDown:function(time){ 
	 var elem = $('.collection');
        $('body').animate({
            scrollTop: elem.height()
        }, time);
},  
	 sub:function(){
	 	pubnub.subscribe({
		  channel: 'chat_channel',
		  message : function (message, channel) {
		  	var messages = this.state.data;
    			var newMessages = messages.concat([message]);
     		 	this.setState({data:newMessages});
     		 	this.scrollDown(400);
   			 }.bind(this),
		    error: function (error) {
		      console.log(JSON.stringify(error));
		    }.bind(this),
 		});
	 },
	 pub:function(message){
		pubnub.publish({
    		channel: 'chat_channel',        
    		message: message,
    		callback : function(m){
    			// console.log(m);
    		}.bind(this)
		});
	 },

	handleMessageSubmit :function(message){
	var messages = this.state.data;
    var newMessages = messages.concat([message]);
     // this.setState({data:newMessages});
     this.pub(message);
	},

	getInitialState: function() {
    return {data: [],user:Math.floor(Math.random()*90000) + 10000,errors:''};
  },

  componentDidMount: function() {
 this.sub();
  },

 render:function(){
		return (
				<div >
				<ChatBody data ={this.state.data}  />
				<ChatForm onMessageSubmit={this.handleMessageSubmit} user = {this.state.user}  />
				</div>
			);
	}
});

module.exports = Main;
