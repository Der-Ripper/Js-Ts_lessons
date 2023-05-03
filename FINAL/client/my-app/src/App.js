import { CardContent, Typography, TextField, Button, CardHeader, Avatar, IconButton, Card, CardActions, Collapse} from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import LogoutIcon from '@mui/icons-material/Logout';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PaletteIcon from '@mui/icons-material/Palette';
import FolderIcon from '@mui/icons-material/Folder';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import {useState, useCallback, useEffect} from 'react';


function App() {
  const URL = "http://localhost:3100/";

  const [contentColor, setContentColor] = useState("#05bf02");
  const [outerColor, setOuterColor] = useState("blue");
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userId, setUserId] = useState(localStorage.getItem('userId'));
  const [isAuthorized, setAuthorizedStatus] = useState(!!localStorage.getItem('token'));
  const [isRegisted, setRegistedStatus] = useState(false);
  const [todoList, setToDoList] = useState([]);
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [repPassword, setRepPassword] = useState(null);
  const [title, setTitle] = useState(null);
  const [description, setDescripion] = useState(null);
  const [currTodoId, setCurrTodoId] = useState(null);
  const [needLoad, setLoadStatus] = useState(true);
  const [buttonText, setButtonText] = useState('Create ToDo');
  const [greeting, setGreeting] = useState(localStorage.getItem('greeting'));
  const [expanded, setExpanded] = useState(false);
  const [expandedNum, setExpandedNum] = useState(null);


  useEffect(() => {
    console.log("TOKEN IN EFFECT", token);
    console.log("USERID IN EFFECT", userId);
    if(needLoad) {
      getToDoList();
    };
  });

  const firstNameChanged = useCallback((event) => setFirstName(event.target.value), []);

  const lastNameChanged = useCallback((event) => setLastName(event.target.value), []);

  const emailChanged = useCallback((event) => setEmail(event.target.value), []);

  const passwordChanged = useCallback((event) => setPassword(event.target.value), []);

  const repPasswordChanged = useCallback((event) => setRepPassword(event.target.value), []);

  const titleChanged = useCallback((event) => setTitle(event.target.value), []);

  const descriptionChanged = useCallback((event) => setDescripion(event.target.value), []);


  const getToDoList = async() => {
    try{
      console.log("TOKEN IN STORAGE", localStorage.getItem('token'));
      const lsToken = localStorage.getItem('token');
      const lsUserId = localStorage.getItem('userId');
      const res = await fetch(URL+"todos/", {
        method: "get",
        headers: {
          'Content-Type':'application/json',
          'Authentication': lsToken,
          'userId': lsUserId
        }
      });
      if(res.status === 200) {
        setLoadStatus(false);
        const resJSON = await res.json();
        setToDoList(resJSON.todoList.reverse());
        setAuthorizedStatus(true);
      }
    } catch(error) {
      console.log(error);
    }
  };



  const todoCreate = async() => {
    if(buttonText === 'Create ToDo') {
      if (title && description) {
        try{
          const lsToken = localStorage.getItem('token');
          const lsUserId = localStorage.getItem('userId');
          const res = await fetch(URL+"todos/", {
            method: 'post',
            headers: {
              'Content-Type':'application/json',
              'Authentication': lsToken,
              'userId': lsUserId
            },
            body: JSON.stringify({userId: userId, title: title, description: description})
          });
          const resJSON = await res.json();
          showToastMessage(resJSON.message, 'cToDo');
          setTitle('');
          setDescripion('');
          await getToDoList();
        } catch {
          console.log("TODO CREATE FAILED");
        }
      }
      else {
        showToastMessage("Fill title and description", 'eToDo');
      }
    } else {
      todoUpdate();
    }
  };


  const cardUpdate = (id, title, description) => {
    setTitle(title);
    setDescripion(description);
    setCurrTodoId(id);
    setButtonText('Update ToDo');
  };

  const todoUpdate = async() => {
    try {
      const lsToken = localStorage.getItem('token');
      const lsUserId = localStorage.getItem('userId');
      const res = await fetch(URL + "todos/" + currTodoId, {
        method: 'PATCH',
        headers: {
          'Content-Type':'application/json',
          'Authentication': lsToken,
          'userId': lsUserId
        },
        body: JSON.stringify({title: title, description: description})
      });
      const resJSON = await res.json();
      showToastMessage(resJSON.message, 'cToDo');
      setButtonText('Create ToDo');
      setTitle('');
      setDescripion('');
      await getToDoList();
    } catch {
      console.log("UPDATE FAILED");
    }
  };

  const todoRemove = async(id) => {
    try{
      const lsToken = localStorage.getItem('token');
      const lsUserId = localStorage.getItem('userId');
      const res = await fetch(URL+"todos/"+id, {
        method: 'delete',
        headers: {
          'Authentication': lsToken,
          'userId': lsUserId
        }
      });
      const resJSON = await res.json();
      showToastMessage(resJSON.message, 'rToDo');
      await getToDoList();
    } catch {
      console.log("TODO REMOVEFAILED");
    }
  }

  const dbDelete = async() => {
    try{
      const lsToken = localStorage.getItem('token');
      const lsUserId = localStorage.getItem('userId');
      const res = await fetch(URL + "todos/", {
        method: 'delete',
        headers: {
          'Authentication': lsToken,
          'userId': lsUserId
        }
      });
      const resJSON = await res.json();
      showToastMessage(resJSON.message, 'rAll')
      await getToDoList();
    } catch {
      console.log("DBDELETE FAILED");
    }
  };


  const login = async() => {
    try{
      const res = await fetch(URL + "auth", {
        method: 'post',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({email: email, password: password})
      });
      const resJSON = await res.json();
      if (res.status === 200) {
        localStorage.setItem('token', resJSON.token);
        localStorage.setItem('userId', resJSON.userId);
        localStorage.setItem('greeting', resJSON.lastName + ' ' + resJSON.firstName);
        setToken(resJSON.token);
        setUserId(resJSON.userId);
        setGreeting(resJSON.lastName + ' ' + resJSON.firstName)
        setLoadStatus(true);
      } else {
        showToastMessage("INCORRECT", 'accessDenied');
      }
    } 
    catch(error) {
      showToastMessage("AUTHENTICATION FAILED", 'accessDenied');
    }
  };

  const showToastMessage = (message, type) => {
    if (type === 'accessDenied') {
      toast.error(message, {
        position: toast.POSITION.TOP_RIGHT,
        style: {backgroundColor: "transparent", color: contentColor}
      });
    }
    if (type === 'access') {
      toast.error(message, {
        position: toast.POSITION.TOP_RIGHT,
        style: {backgroundColor: "transparent", color: contentColor}
      });
    }
    if (type === 'cToDo') {
      toast.success(message, {
        position: toast.POSITION.BOTTOM_LEFT,
        style: {backgroundColor: "transparent", color: contentColor}
      });
    }
    if (type === 'rToDo') {
      toast.warning(message, {
        position: toast.POSITION.BOTTOM_LEFT,
        style: {backgroundColor: "transparent", color: contentColor}
      });
    }
    if (type === 'eToDo') {
      toast.error(message, {
        position: toast.POSITION.BOTTOM_LEFT,
        style: {backgroundColor: "transparent", color: contentColor}
      });
    }
    if (type === 'rAll') {
      toast.warning(message, {
        position: toast.POSITION.BOTTOM_LEFT,
        style: {backgroundColor: "transparent", color: contentColor}
      });
    }
    
  };

  const toRegistration = () => {
    setRegistedStatus(true);
  };

  const registration = async() => {
    if (password === repPassword) {
      try {
        const res = await fetch(URL + "registration", {
          method: 'post',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({firstName: firstName, lastName: lastName, email: email, password: password})
        });
        const resJSON = await res.json();
        if (res.status === 200) {
          setRegistedStatus(false);
          showToastMessage(resJSON.message, 'access');
        }
        else {
          showToastMessage(resJSON.message, 'accessDenied');
        }
      } catch(error) {
        showToastMessage("REGISTRATION FAILED", 'accessDenied');
      }
    }
    else {
      showToastMessage("Passwords not the same", 'accessDenied');
    }
  };


  const logout = async() => {
    try{
      await fetch(URL + "logout", {
        method: 'post',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({token: token})
      });
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      setToken(null);
      setUserId(null);
      setAuthorizedStatus(false);
      setTitle(null);
      setDescripion(null);
      setGreeting(null);
    } catch(error) {
      console.log("LOGOUT FAILED");
    }
  }
  

  const themeChanged = (newContentColor, newOuterColor) => {
    setContentColor(newContentColor);
    setOuterColor(newOuterColor);
  }

  const showMore = (id) => {
    setExpanded(!expanded);
    if(id !== expandedNum) {
      setExpandedNum(id);
    }
    else {
      setExpanded(!expanded);
    }
  }

  if(!isAuthorized && !isRegisted) {
    return (
      <>
      <div className='Form' style={{outline:"3px solid " + outerColor}}>
        <div>
          <Typography sx={{ fontSize: 40, color: contentColor, marginTop: '5%' }}>
            AUTHENTICATION
          </Typography>
        </div>
        <div className='TextField'>
          <TextField inputProps={{style: { color: contentColor}}} sx={{color: outerColor, border: '3px solid ' + outerColor, width: '50%'}} id='email' label='email' variant="filled" value={email} onChange={emailChanged}/>
        </div>
        <div className='TextField'>
          <TextField inputProps={{style: { color: contentColor}}} sx={{color: outerColor, border: '3px solid ' + outerColor, width: '50%'}} id='password' label='password' variant="filled" type="password" value={password} onChange={passwordChanged}/>
        </div>
        <div className='FormButton'>
          <Button style={{backgroundColor: "transparent", color: contentColor, border: '3px solid ' + outerColor, width: '50%'}} size="small" variant="outlined" color="success" onClick={login}>
            Login
          </Button>
        </div>
        <div className='FormButton'>
          <Button style={{backgroundColor: "transparent", color: contentColor, border: '3px solid ' + outerColor, width: '50%'}} size="small" variant="outlined" color="success" onClick={toRegistration}>
            Register
          </Button>
        </div>
      </div>
      <ToastContainer/>
    </>
    );
  }
  if(!isAuthorized && isRegisted) {
    return (
      <>
      <div className='Form'>
        <div>
          <Typography sx={{ fontSize: 40, color: contentColor, marginTop: '5%'}}>
            REGISTRATION
          </Typography>
        </div>
        <div className='TextField'>
          <TextField inputProps={{style: { color: contentColor}}} sx={{color: outerColor, border: '3px solid ' + outerColor, width: '50%'}} id='firstName' label='first name' value={firstName} onChange={firstNameChanged}/>
        </div>
        <div className='TextField'>
          <TextField inputProps={{style: { color: contentColor}}} sx={{color: outerColor, border: '3px solid ' + outerColor, width: '50%'}} id='lastName' label='last name' value={lastName} onChange={lastNameChanged}/>
        </div>
        <div className='TextField'>
          <TextField inputProps={{style: { color: contentColor}}} sx={{color: outerColor, border: '3px solid ' + outerColor, width: '50%'}} id='email' label='email' value={email} onChange={emailChanged}/>
        </div>
        <div className='TextField'>
          <TextField inputProps={{style: { color: contentColor}}} sx={{color: outerColor, border: '3px solid ' + outerColor, width: '50%'}} id='password' label='password' type="password" value={password} onChange={passwordChanged}/>
        </div>
        <div className='TextField'>
          <TextField inputProps={{style: { color: contentColor}}} sx={{color: outerColor, border: '3px solid ' + outerColor, width: '50%'}} id='repPassword' label='repeat password' type="password" value={repPassword} onChange={repPasswordChanged}/>
        </div>
        <div className='FormButton'>
          <Button style={{backgroundColor: "transparent", color: contentColor, width: '50%'}} size="small" variant="filled" onClick={registration}>
            Registration
          </Button>
        </div>
      </div>
      <ToastContainer/>
    </>
    );
  }
  if(isAuthorized) {
    return(
      <>
        <div className="Greeting">
          <Typography noWrap sx={{ fontSize: 18, color: contentColor, marginTop: '10%'}}>HI, {greeting.toUpperCase()}!</Typography>
          <Typography noWrap sx={{ fontSize: 18, color: contentColor, marginTop: '2%'}}>WELCOME TO TODO-TRACKER</Typography>
          <Typography sx={{ fontSize: 15, color: contentColor, marginTop: '15%'}}>HERE YOU CAN VIEW YOUR TODO-LIST, CREATE</Typography>
          <Typography sx={{ fontSize: 15, color: contentColor, marginTop: '5%'}}>NEW ONES AND EDIT OR DELETE EXISTING ONES</Typography>
          <Typography noWrap sx={{ fontSize: 15, color: contentColor, marginTop: '5%'}}>ID: {userId.toUpperCase()}</Typography>
        </div>
        <div className="Input">
          <div className='TextField'>
            <TextField inputProps={{style: { color: contentColor}}} sx={{color: outerColor, border: '3px solid ' + outerColor, width: '98%'}} id="title" label="Title" variant="filled" color='success' value={title} onChange={titleChanged}/>
          </div>
          <div className='TextField'>
            <TextField inputProps={{style: { color: contentColor}}} sx={{color: outerColor, border: '3px solid ' + outerColor, width: '98%'}} id="description" label="Description" multiline variant="filled" color='success' rows="15" value={description} onChange={descriptionChanged}/>
          </div>
          <div className="CreateButton">
            <Button style={{backgroundColor: "transparent", color: contentColor, border: '3px solid ' + contentColor, width: '100%'}} size="small" variant="outlined" onClick={todoCreate}>
              {buttonText}
            </Button>
          </div>
          <div className="DeleteButton">
            <Button style={{backgroundColor: "transparent", color: outerColor, border: '3px solid ' + outerColor, width: '100%'}} size="small" variant="outlined" onClick={dbDelete}>
              DELETE ALL
            </Button>
          </div>
          <div className="LogoutButton">
            <Button style={{backgroundColor: "transparent", color: contentColor, width: '100%'}} size="small" onClick={logout}>
              LOGOUT<LogoutIcon sx={{color: contentColor}}></LogoutIcon>
            </Button>
          </div>
        </div>
        {todoList.map(todo => (
          <Card sx={{ border: '3px solid ' + outerColor, backgroundColor: 'transparent', margin: '40px', maxWidth: 500, marginLeft: 'auto', marginRight: 'auto' }}>
            <CardHeader
              avatar={
                <Avatar style={{backgroundColor: "transparent", border: '3px solid ' + outerColor}} aria-label="recipe">
                  <FolderIcon sx={{ color: outerColor}}/>
                </Avatar>
              }
              action={
                <IconButton>
                  <EditIcon sx={{ color: outerColor}} onClick={() => cardUpdate(todo.id, todo.title, todo.description)}/>
                  <DeleteForeverIcon sx={{ color: outerColor}} onClick={() => todoRemove(todo.id)}/>
                </IconButton>
              }
              title = {
                <Typography sx={{ fontSize: 18, color: contentColor}}>
                  {todo.title}
                </Typography>
              }
              subheader = {
                <>
                  <Typography sx={{ fontSize: 11, color: contentColor}}>
                    {todo.date}
                  </Typography>
                </>
              }
            />
            <CardContent>
              <Typography sx={{ fontSize: 14, color: contentColor}}>
                {todo.description.substr(0, 60)}
              </Typography>
            </CardContent>
            <CardActions disableSpacing sx={{justifyContent: "flex-end", padding: 0}}>
              <Typography sx={{ fontSize: 11, color: contentColor}}>{todo.id}</Typography>
              <IconButton>
                <ExpandMoreIcon sx={{ color: outerColor}} onClick={() => showMore(todo.id)}/>
              </IconButton>
            </CardActions>
            <Collapse in={expandedNum === todo.id && expanded} timeout="auto" unmountOnExit>
              <CardContent>
                <Typography style={{ wordWrap: "break-word", color: contentColor}}>{todo.description}</Typography>
              </CardContent>
            </Collapse>
          </Card>
        ))}
        <ToastContainer limit={6}/>
        <div className='ThemeLabel'>
          <div className='ThemeButton'>
            <PaletteIcon sx={{ color: '#05bf02'}} onClick={() => themeChanged("#05bf02", "blue")}/>
          </div>
          <div className='ThemeButton'>
            <PaletteIcon sx={{ color: '#e00047'}} onClick={() => themeChanged("#e00047", "#94de00")}/>
          </div>
          <div className='ThemeButton'>
            <PaletteIcon sx={{ color: 'blue'}} onClick={() => themeChanged("blue", "red")}/>
          </div>
          <div className='ThemeButton'>
            <PaletteIcon sx={{ color: '#94de00'}} onClick={() => themeChanged("#94de00", "#e00047")}/>
          </div>
        </div>
      </>
    );
  }
}

export default App;
