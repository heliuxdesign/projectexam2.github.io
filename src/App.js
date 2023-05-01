import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LandingPage from './components/landingPage/LandingPage';
import Home from './components/home/Home';
import Posts from './components/posts/Posts';
import Profiles from './components/profiles/Profiles';
import Post from './components/posts/Post';
import CreatePost from './components/posts/CreatePost';
import Profile from './components/profiles/Profile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" exact element={<LandingPage />} />
        <Route path="/Profiles" exact element={<Profiles />} />
        <Route path="/Posts" exact element={<Posts />} />
        <Route path="/Home" exact element={<Home />} />
        <Route path="/Posts/Post/:id" exact element={<Post />} />
        <Route path="/Profiles/Profile/:name" exact element={<Profile />} />
        <Route path="/Posts/CreatePost" exact element={<CreatePost />} />
      </Routes>
    </BrowserRouter>
  );  
}

export default App;
