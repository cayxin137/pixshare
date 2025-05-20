import './App.scss';
import Home from '../home/home';
import Discovery from '../discovery/discovery';
import Chat from '../chat/chat';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import {
  BrowserRouter,
  Route,
  Link,
  Routes
} from 'react-router-dom';
import Login from '../login/login';
import Register from '../register/register';


import React from 'react';
import Post from '../../components/post/post';
import Profile from '../profile/profile';
import PostStore from '../postStore/postStore';
import ProfileEdit from '../profileEdit/profileEdit';




class App extends React.Component {
  render() {
    return (

      <BrowserRouter>
        <div className="App">
          <Routes>
            <Route index element={<Discovery />} />
            <Route path='/' element={<Home />}>
              <Route path='post/:id' element={<Post />} />
            </Route>
            <Route path='/discovery' element={<Discovery />} >
              <Route path='post/:id' element={<Post />} />
            </Route>
            <Route path='/:username' element={<Profile />}>
              <Route path='post/:id' element={<Post />} />
            </Route>
            <Route path='/edit/:username' element={<ProfileEdit />} />
            <Route path='/:username/store' element={<PostStore />}>
              <Route path='post/:id' element={<Post />} />
            </Route>
            <Route path='/chat' element={<Chat />} >
              <Route path='post/:id' element={<Post />} />
            </Route>
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
          </Routes>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light" />
          <ToastContainer />
        </div>
      </BrowserRouter>
    );
  }

}


export default App;

