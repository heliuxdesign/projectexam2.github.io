import { useEffect, useState } from 'react';
import Heading from '../layout/Heading';
import { useCheckCredentials } from '../../utils/checkCredentials';
import Navigation from '../layout/Layout';
import { Link } from 'react-router-dom';
import { profilesUrl } from '../../constants/api';
import { getToken } from '../Storage.js';
import { Card, Container, Row, Col, Button } from 'react-bootstrap';
import Footer from '../layout/Footer';

export default function Contact() {
    useCheckCredentials();
    const [profileData, setProfileData] = useState([]);
    const [profileError, setProfileError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

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
                const response = await fetch(profilesUrl + "?limit=30&offset=" + offset, options);
                if (response.ok) {
                    const data = await response.json();
                    if (data.errors){
                        setProfileError("Could not fetch content from API");
                    }
                    else{
                        setProfileData(data);
                    }                    
                }
                else {
                    setProfileError("Could not fetch content from API");
                }
            } catch(error) {
                setProfileError("Could not fetch content from API");
            } 
        })();
    }, [currentPage]);
  
  return (
  <>
    <Navigation />
    <Heading /> 
    <Container>
      <Row>
          <h1>Profiles</h1>
          {profileError ? ( <div>Error: {profileError}</div>) : (
          profileData.map(item => (
            <Col xs={12} md={4} className="mb-4">
                 <Card className="h-100" style={{ height: "250px" }}>
                    <Card.Body>
                        <Card.Title>{item.name}</Card.Title>
                         <Link className="my-link" to={`/Profiles/Profile/${item.name}`}>Go to Profile</Link>  
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
            <Button className="button-green"  disabled={profileData.length < 30} onClick={handleNextPage}>
              Next
            </Button>
          </Col>
        </Row>
    </Container>
    <Footer />
  </>
  )      
}



