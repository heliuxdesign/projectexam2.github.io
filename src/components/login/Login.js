import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { saveToken, saveUser, saveName } from '../Storage.js';
import Heading from '../layout/Heading';
import { Form } from 'react-bootstrap';
import { useState } from 'react';


const schema = yup.object().shape({
    name: yup.string().required("Please enter a username"),
    email: yup.string().required("Please enter an email address").email("Please enter a valid email address"),
    password: yup.string().required("Please enter a password")
});

function Login() {
    const navigate = useNavigate();
    const [loginError, setLoginError] = useState(null);

    async function LoginUser(loginData) {
        const url = "https://api.noroff.dev/api/v1/social/auth/login";
        const options = {
            method: "POST",
            body: JSON.stringify(loginData),
            headers: {
                "Content-Type": "application/json",
            }
        };
        
        try {
            const response = await fetch(url, options);
            const json = await response.json();
            
            if(json.accessToken) {
                saveToken(json.accessToken);
                if (json.email) {
                    saveUser(json.email);
                }
                if (json.name) {
                    saveName(json.name);
                }
                navigate("/Home");
            }
            
            if(json.errors) {
                setLoginError(json.errors[0].message);
            }
        }
        catch(error) {
            setLoginError("Unable to login");
        }
    }

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });

    function onSubmit(data) {
        LoginUser(data); 
    }

    return (
        <>
        <Heading />
        <Form onSubmit={handleSubmit(onSubmit)}>
            <input className="input-group" type="text" placeholder="Name" {...register("name")} />
            <input className="input-group" type="text" placeholder="Email" {...register("email")} />
            <input className="input-group" type="password" placeholder="Password" {...register("password")} />
            {loginError && <span>{loginError}</span>}
            <button className="button-red">Login</button>
        </Form>
        </>
    );
}

export default Login;