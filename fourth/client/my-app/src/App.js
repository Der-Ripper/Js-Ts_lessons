import './App.css';
import React from 'react';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { CardActions, CardContent, Typography, TextField } from '@mui/material';


class App extends React.Component{

   URL = "http://localhost:3100/todos/";

  constructor(props) {
    super(props);
    this.state = {
      todos: [],
      newTitle: '',
      newDescription: '',
      nowID: null
    };
  }


  async componentDidMount() {
    await fetch(this.URL)
    .then(response => response.json())
    .then(data => this.setState({ todos: data.todo.reverse() }));
    this.setState({newTitle: '', newDescription: '', nowID: null});
  }

  cardRemove = id => {
    console.log(id);
    this.setState(
      {
        todos: this.state.todos.filter(todo => todo.id !== id)
      })
  };


  todoRemove = async id => {
    await fetch(this.URL+id, {
      method: 'delete'
    });
    this.componentDidMount();
  };


  todoCreate = async () => {
    await fetch(this.URL, {
      method: 'post',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({title: this.state.newTitle, description: this.state.newDescription})
    });
    this.componentDidMount();
  }

  titleCreate = event => {
    console.log(event.target.value);
    this.setState({newTitle: event.target.value});
  }

  descriptionCreate = event => {
    this.setState({newDescription: event.target.value});
  }


  cardUpdate = (id, title, description) => {
    this.setState({newTitle: title, newDescription: description, nowID: id});
  }

  todoUpdate = async() => {
    //this.setState({newTitle: title, newDescription: description});
    console.log(this.URL + this.state.nowID);
    await fetch(this.URL + this.state.nowID, {
      method: 'PATCH',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({title: this.state.newTitle, description: this.state.newDescription})
    });
    await this.componentDidMount();
  }

  dbDelete = async() => {
    await fetch(this.URL, {
      method: 'delete'
    });
    await this.componentDidMount();
  }

  render() {
    const { todos } = this.state;
    return (
      <>
        <div className="Input">
          <TextField id="title" label="Title" color="secondary" value={this.state.newTitle} onChange={this.titleCreate}/>
          <TextField id="description" label="Description" color="secondary" value={this.state.newDescription} onChange={this.descriptionCreate}/>
          <Button size="small" variant="outlined" color="success" onClick={() => this.todoCreate()}>
            Create new
          </Button>
          <Button size="small" variant="outlined" color="warning" onClick={() => this.todoUpdate()}>
            Update
          </Button>
          <Button size="small" variant="outlined" color="error" onClick={() => this.dbDelete()}>
            DELETE ALL
          </Button>
        </div>
        <div className="App">
          {todos.map(todo => (
            <Card sx={{ margin: 5, maxWidth: 500, marginLeft: 'auto', marginRight: 'auto' }}>
              <CardContent>
                <Typography>
                  ID:{todo.id}
                </Typography>
                <Typography>
                  Title: {todo.title}
                </Typography>
                <Typography>
                  Description: {todo.description}
                </Typography>
              </CardContent>
              <CardActions disableSpacing sx={{
                justifyContent: "flex-end",
                padding: 0,
              }}>
                <Button size="small" variant="outlined" color="error" onClick={() => this.cardRemove(todo.id)}>
                  DELETE CARD
                </Button>
                <Button size="small" variant="outlined" color="error" onClick={() => this.todoRemove(todo.id)}>
                  DELETE TODO
                </Button>
                <Button size="small" variant="outlined" color="error" onClick={() => this.cardUpdate(todo.id, todo.title, todo.description)}>
                  UPDATE TODO
                </Button>
              </CardActions>
            </Card>
          ))}
        </div>
      </>
    );
  }
}

export default App;
