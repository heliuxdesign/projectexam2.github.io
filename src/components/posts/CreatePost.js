import { useState } from 'react';
import Heading from '../layout/Heading';
import { useCheckCredentials } from '../../utils/checkCredentials';
import Navigation from '../layout/Layout';
import { postsUrl } from '../../constants/api';
import { getToken } from '../Storage.js';
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, Link } from "react-router-dom";
import { Form } from 'react-bootstrap';
import Footer from '../layout/Footer';

const schema = yup.object().shape({
    title: yup.string().required("Please enter a username"),
    body: yup.string().required("Please write some text"),
    media: yup.string()
});

export default function CreatePost() {
    useCheckCredentials();

    const [postError, setPostError] = useState(null);
    const navigate = useNavigate();

    async function SubmitPost(postData){
        const options = {
            method: "POST",
            body: JSON.stringify(postData),
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + getToken()
            }
        };
        try {
            const response = await fetch(postsUrl, options);
            const json = await response.json();
            
            if(response.ok) {
                navigate("/Posts")
            }
            else {
                setPostError(json.errors[0].message)
            }
        }
        catch(error) {
            console.log(error.errors[0].message);
        }        
    }

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });

    function onSubmit(data) { 
        SubmitPost(data);
    }

    return (
        <>
          <Navigation />
          <Heading title="CreatePost" /> 
          <p className="centered">Go back to <Link to={`/Posts/`} className="my-link">Posts</Link></p>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <input className="input-group" type="text" placeholder="Title"{...register("title")} />
            <input className="input-group" type="text" placeholder="Body"{...register("body")} />
            <input className="input-group" type="url" placeholder="Image url"{...register("media")} />
            {postError && <span>{postError}</span>}
            <button className="button-green">Submit</button>
          </Form>
          <Footer />
        </>
    )
}