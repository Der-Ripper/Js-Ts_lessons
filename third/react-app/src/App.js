import './App.css';
import React from 'react';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { CardActions, CardContent, Typography } from '@mui/material';

class App extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      todos: []
    };
  }

  componentDidMount() {
    fetch("https://jsonplaceholder.typicode.com/todos")
    .then(response => response.json())
    .then(data => this.setState({ todos: data }));
  }

  todoRemove = title => {
    console.log(title);
    this.setState(
      {
        todos: this.state.todos.filter(todo => todo.title !== title)
      })
  };

  render() {
    const { todos } = this.state;
    return (
      <div className="App">
        {todos.map(todo => (
          <Card sx={{margin: 5, maxWidth: 500, marginLeft: 'auto', marginRight: 'auto'}}>
            <CardContent>
              <Typography>
                UserId:{todo.userId}, ID:{todo.id}
              </Typography>
              <Typography>
                Title: {todo.title}
              </Typography>
            </CardContent>
            <CardActions disableSpacing sx=
              {{
                justifyContent: "flex-end",
                padding: 0,
              }}>
              <Button size="small" variant="outlined" color="error" onClick={() => this.todoRemove(todo.title)}>
                DELETE CARD
              </Button>
            </CardActions>
          </Card>
        ))}
      </div>
    );
  }
}

export default App;
