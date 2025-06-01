import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

function Auth({ destination }) {

  const [result , setResult] = useState(false)
  const [loading , setLoading] = useState(true)

  useEffect(() => {
    async function result(){
      const res = await fetch("/backend", { credentials: "include" });
      setResult(res.ok)
      setLoading(false)
    }
    result()
  }, []);

  if(loading){
    return (<div>Loading...</div>)
  }
  else if(result){
    return destination
  }
  else{
    return(<Navigate to = "/login"/>)
  }

}

export default Auth;
