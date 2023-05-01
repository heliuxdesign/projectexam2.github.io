import { useEffect, useState } from 'react';
import Heading from '../layout/Heading';
import { useCheckCredentials } from '../../utils/checkCredentials';
import Navigation from '../layout/Layout';
import { postsUrl, profilesUrl } from '../../constants/api';
import { getName, getToken } from '../Storage.js';
import { Card, Container, Row, Col, Button } from 'react-bootstrap';
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link } from 'react-router-dom';
import Footer from '../layout/Footer';



export default function Home() {
    useCheckCredentials();

    const [postData, setPostData] = useState([]);
    const [postError, setPostError] = useState(null);

    const [profileData, setProfileData] = useState([]);
    const [profileError, setProfileError] = useState(null);

    const [myProfileData, setMyProfileData] = useState([]);
    const [myProfileError, setMyProfileError] = useState(null);
    const [myProfileChanged, setMyProfileChanged] = useState(false);

    const myProfileUrl  = profilesUrl + "/" + getName();

    const apiCalls = [
        {url: postsUrl + "?_active=true", data: postData, setData: setPostData, error: postError, setError: setPostError},
        {url: profilesUrl, data: profileData, setData: setProfileData, error: setProfileError, setError: setProfileError},
        {url: myProfileUrl, data: myProfileData, setData: setMyProfileData, error: myProfileError, setError: setMyProfileError},
    ]

    const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + getToken()
        }
    };

    useEffect(() => {
        (async ()=> {
            for (const call of apiCalls) {
                try {
                    const response = await fetch(call.url, options);
                    if (response.ok) {
                        const data = await response.json();
                        if (data.errors)
                        {
                            call.setError("Could not fetch content from API");
                        }
                        else
                        {
                            call.setData(Array.isArray(data) ? data.slice(0, 3) : data);
                        }
                    }
                    else {
                        call.setError("Could not fetch content from API");
                    }
                } catch(error) {
                    call.setError("Could not fetch content from API");
                } 
            }
        })();
      }, [myProfileChanged]);

    const [hideForm, setHideForm] = useState(true);
    const [updateError, setUpdateError] = useState(null);

    const handleUpdateBannerAvatar = () => {
        setHideForm(false);
    }

    const schema = yup.object().shape({
        banner: yup.string(),
        avatar: yup.string(),
    });

    const updateMyProfile = async (data) => {
        const options = {
            method: "PUT",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + getToken()
            }
        };
        try {
            const response = await fetch(myProfileUrl + "/media", options);
            const json = await response.json();
            
            if (json.errors){
                setUpdateError(json.errors[0].message);
            }
            else {
                setHideForm(true);
                setMyProfileData(json);
                setUpdateError(null);
                setMyProfileChanged(!myProfileChanged);
            }
        }
        catch(error) {
            setUpdateError("Could not update profile");
        }
    } 

    const onSubmit = (data)=>{
        updateMyProfile(data);
    };

    const { register, handleSubmit } = useForm({
        resolver: yupResolver(schema),
    });
    
    return (
    <>
      <Navigation />
      <Heading /> 

      <Container className="layout-container">
        <Row>
        <Col xs={{ span: 12, order: 2 }} md={{ span: 6, order: 1 }}>
            <Card  style={{ width: '18rem' }}>
                <Card.Img />
                <Card.Body>
                <Card.Title>{myProfileData.name}</Card.Title>
                <Card.Text><img width="75" height="75" src={myProfileData.banner} alt="You are missing banner"/></Card.Text>
                <Card.Text><img width="75" height="75" src={myProfileData.avatar} alt="You are missing avatar"/></Card.Text>
                <Card.Text>E-mail: {myProfileData.email}</Card.Text>
                <Card.Text>Followers: {myProfileData._count ? myProfileData._count.followers : "fetching..."} </Card.Text>
                <Card.Text>Following: {myProfileData._count ? myProfileData._count.following : "fetching..."}</Card.Text>
                <Card.Text>Posts: {myProfileData._count ? myProfileData._count.posts : "fetching..."}</Card.Text>
                <Button onClick={handleUpdateBannerAvatar} className="button-green" >Update Banner and Avatar</Button>
                </Card.Body>
            </Card>
            {hideForm ? (<div></div>) : (
            <form onSubmit={handleSubmit(onSubmit)}>
                <input className="input-group" type="url" placeholder="Banner url" {...register("banner")} />
                <input className="input-group" type="url" placeholder="Avatar url"{...register("avatar")} />
                {updateError && <span>{updateError}</span>}
                <button className="button-red">Update</button>
            </form>)}           
        </Col>
        <Col xs={{ span: 12, order: 1 }} md={{ span: 6, order: 2 }}>
            <h1>My profile</h1>
            <p>Here you can update your banner and avatar.</p>
            <p>If you want to make a post go to <Link to={`/Posts/`} className="my-link">Posts</Link> page.</p>
        </Col>
        </Row>
      </Container>
      
      <Container>
        <Row>
            <h2>Latest posts</h2>
            {postError ? ( <div>Error: {postError}</div>) : (
            postData.map(item => (
                <Col xs={12} md={4} className="mb-4">
                    <Card className="h-100" style={{ height: "250px" }}>
                        {item.media && <Card.Img variant="top" src={item.media} alt="No image" style={{ height: "225px", objectFit: "cover" }}/>}
                        <Card.Body>
                            <Card.Title>{item.title}</Card.Title>
                            <Card.Text>{item.body}</Card.Text>
                            <Link className="my-link" to={`/Posts/Post/${item.id}`}>Go to the post</Link>
                        </Card.Body>
                    </Card>
                </Col>
            )))}
        </Row>
      </Container>

      <Container>
        <Row>
            <h2>Latest profiles</h2>
            {profileError ? ( <div>Error: {profileError}</div>) : (
            profileData.map(item => (
                <Col xs={12} md={4} className="mb-4" >
                    <Card className="h-100" style={{ height: "250px" }}>
                        {item.avatar &&<Card.Img variant="top" src={item.avatar} alt="some alt image"/> }
                        <Card.Body>
                            <Card.Title>{item.name}</Card.Title>
                            {item.banner && <Card.Text><img width="50" height="50" src={item.banner} alt="som alt banner"/></Card.Text>}
                            <Link className="my-link" to={`/Profiles/Profile/${item.name}`}>Go to the profile</Link>
                        </Card.Body>
                    </Card>
                </Col>
            )))}
        </Row>
      </Container>
      <Footer />
    </>
    )      
}
