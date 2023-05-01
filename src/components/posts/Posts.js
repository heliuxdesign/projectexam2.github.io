import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Heading from '../layout/Heading';
import { useCheckCredentials } from '../../utils/checkCredentials';
import Navigation from '../layout/Layout';
import { postsUrl } from '../../constants/api';
import { getToken, getUsername } from '../Storage.js';
import { Button, Card, Container, Row, Col } from 'react-bootstrap';
import Footer from '../layout/Footer';


export default function Posts() {
    useCheckCredentials();

    const [postData, setPostData] = useState([]);
    const [postError, setPostError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [postDeleted, setPostDeleted] = useState(false);

    const handleNextPage = () => {
        setCurrentPage(currentPage + 1);
    };

    const handlePrevPage = () => {
        setCurrentPage(currentPage - 1);
    };

    useEffect(() => {
        (async ()=> {
            const limit = 30;
            const offset = (currentPage - 1) * limit; 
            const options = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + getToken()
                }
            };
            try {
                const url = postsUrl +"?_author=true" + "&limit=30&offset=" + offset;
                const response = await fetch(url, options);
                if (response.ok) {
                    const data = await response.json();
                    if (data.errors)
                    {
                        setPostError("Could not fetch content from API");
                    }
                    else
                    {
                        setPostData(data);
                    }
                }
                else {
                    setPostError("Could not fetch content from API");
                }
            } catch(error) {
                setPostError(error);
            }          
        })();
    }, [currentPage, postDeleted]);

    const handleDeleteClick = async (e) => {
        const id = e.currentTarget.id;
        const options = {
            method: "DELETE",
            headers: {
               "Content-Type": "application/json",
               "Authorization": "Bearer " + getToken()
            }
        }
        try {
            const response = await fetch(postsUrl + "/" + id, options);
            if (response.ok) {
                setPostDeleted(!postDeleted);
            }
            else {
                console.log("Post could not be deleted");
            }
        } catch(error) {
            console.log("Post could not be deleted");
        }
    }
  
  return (
  <>
    <Navigation />
    <Heading /> 
    <Container>
      <Row >
          <h1>Posts</h1>
          <p className="centered">Create your own post here: <Link to={`/Posts/CreatePost`} className="my-link"><h2>Create post</h2></Link></p>
          {postError ? ( <div>Error: {postError}</div>) : (
          postData.map(item => (
            <Col xs={12} md={4} className="mb-4">
                <Card className="h-100" style={{ height: "250px" }}>
                    {item.media && <Card.Img variant="top" src={item.media} alt="some alt image" style={{ height: "225px", objectFit: "cover" }}/>}
                    <Card.Body>
                        <Card.Title>{item.title}</Card.Title>
                        <Card.Text>{item.body}</Card.Text>
                        <Link className="my-link" to={`/Posts/Post/${item.id}`}>Go to Post</Link> 
                        {(getUsername() === item.author?.email) && <Button className="button-red" id={item.id} onClick={handleDeleteClick}>Delete Post</Button>}
                    </Card.Body>
                </Card>
            </Col>
        )))}
      </Row>
    </Container>
    <Container className="layout-container">
        <Row>
          <Col xs={12}>
            <Button className="button-green"  disabled={currentPage === 1} onClick={handlePrevPage}>
              Previous
            </Button>{" "}
            <Button className="button-green"  disabled={postData.length < 30} onClick={handleNextPage}>
              Next
            </Button>
          </Col>
        </Row>
    </Container>
    <Footer />
  </>
  )      
}

