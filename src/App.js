import React, { Component } from 'react';
import './App.css';

class Card extends React.Component{
  constructor(props) {
    super(props);

  this.state = {
   forks : [],
  }
}
componentDidMount(){
    
  //fetch('http://localhost:3000/forks.json')
  fetch(this.props.forks_url)
    .then((response) => response.json())
    .then((data) =>{
        this.setState({forks:data});   
    })
    .catch(error =>console.log(error));
}
render(){
  let firstKey = Object.keys(this.props.files)[0];
  let tagColor ={
    'text/plain' :'label-default',
    'text/html' : 'label-primary',
    'text/javascript' : 'label-success',
  }
  let allForks = [];
  let ss = this.state.forks;
  
  if(ss.length > 0 ){
    console.log(ss);
    let limit = (ss.length>2) ? 3 : ss.length;
    for(let i=0;i<limit;i++){
      allForks.push(  
        <a className="fork" href={ss[i].html_url} key={ss[i].id}>
          <p>{ss[i].owner.login}</p>
          <img alt="avatar" style={{ width: '30px' }} src={ss[i].owner.avatar_url} />
        </a>
      )
    }
  }
  return (
    <div className="gist">
    <a href={this.props.html_url} target="_blank">
      <img src={this.props.owner.avatar_url}/>
        
      <p> {this.props.html_url}</p>
    </a>
    {(allForks.length >0) && <div className="forked-by"> 
    <em>Forked By</em>
    {allForks }
    </div>}
    
    
       <span className={"label "+ tagColor[this.props.files[firstKey].type]}>{this.props.files[firstKey].type}</span>
    
    </div>
  )
}
}

const CardList = props => {
  return <div>{props.gits.map(git => <Card {...git} key={git.id} />)}</div>
}



class Form extends React.Component {
  constructor(props) {
    super(props);
    this. state = {
      userName: ''
    }
}
  handleSubmit = event => {
    event.preventDefault()
let API  = `https://api.github.com/users/${this.state.userName}/gists`;
//let API = 'http://localhost:3000/json.json'
    
      fetch(API)
      .then((response) =>{
        if(response.status != 200){
          document.getElementById('msg').classList.add('active');
          throw Error(response.statusText);      
        }
       return   response.json(); 
      }
      )
      .then((data) =>{
        this.props.onSubmit(data)
      }).catch(function(error) {
        console.log(error);
    })
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          type="text"
          onChange={event => this.setState({ userName: event.target.value })}
          placeholder="Search.."
          required
        />
        <button type="submit">Search</button>
      </form>
    )
  }
}

class App extends React.Component {
  state = {
    gits: []
  }

  ShowGist = cardInfo => {
    this.setState({
      gits:cardInfo
    })
  }

  render() {
    return (
      <div>
      <p className="msg-error" id="msg">Network error rate limiting by github <a href="https://api.github.com/rate_limit" target="_blank">Check Hier</a> / Or wrong name </p>
        <Form onSubmit={this.ShowGist} />
        <CardList gits={this.state.gits} />
      </div>
    )
  }
}



export default App;
