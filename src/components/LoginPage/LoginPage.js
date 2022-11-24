import React, {useState } from 'react'
import { Await, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form';
import { async } from '@firebase/util';
import firebase from '../../firebase';
function LoginPage() {

    const {register, formState: { errors },handleSubmit} = useForm();

    const[errorFromSubmit,seterrorFromSubmit] = useState("");

    const [loading , setLoading] = useState(false);   

    const onSubmit = async(data) => {
        // 파이어베이스에 이메일과 아이디를 만들어준다 . 비동기 처리해줌
        try {  
          setLoading(true);

          await firebase.auth().signInWithEmailAndPassword(data.email, data.password);

          setLoading(false);
        } 
        
        catch (error) {
           seterrorFromSubmit(error.message)
           setLoading(false);
    setTimeout(() => {
        seterrorFromSubmit("")
    }, 5000);

        }
      
    }

  return (
    <div className = "auth-wrapper">

    <div style={{textAlign:'center'}}>
        <h3>Login</h3>
    </div>

        <form onSubmit={handleSubmit(onSubmit)}>  
   <label>Email</label>

    <input
    name = "email"
        type="email" 
        {...register("email",{required:true, pattern:/^\S+@\S+$/i })}
         />
      {errors.email && <p>This email field is required</p>}
    

    <label>Password</label>
    <input  
    name = "password"
    type= "password"
    {...register("password",{required:true, minLength:6})} />
    {errors.password && errors.password.type === "required" && <p>This password field is required</p>}
    {errors.password && errors.password.type === "minLength" && <p>This password must have at least 6ch</p>}
 
     {errorFromSubmit &&<p>{errorFromSubmit}</p>}
 
    <input type="submit" disabled = {loading} />

    <Link style={{color:'gray', textDecoration:'none'}} to="/register">아직 아이디가 없다면</Link>
  </form>


  </div>
  )
}

export default LoginPage