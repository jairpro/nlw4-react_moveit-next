import React, { useContext, useEffect, useState } from "react";
import { FaFacebook } from 'react-icons/fa';
import { LoginContext } from "../contexts/LoginContext";
import styles from '../styles/components/LoginFacebook.module.css';


/*export interface LoginFacebookButtonProps {
  children: any
}

export function LoginFacebookButton(props: LoginFacebookButtonProps) {
  return (
    <button>
      { props.children }
    </button>
  )
}*/

interface LoginFacebookProps {
  fbAppId: string
}

export default function LoginFacebook(props: LoginFacebookProps) {
  const [isLoggedFB, setIsLoggedFB] = useState(false)

  const { executeLoginFB, updatePlataform, initSessionFB } = useContext(LoginContext)

  function loadFbLoginApi() {
    //window.fbAsyncInit = function() {
    window['fbAsyncInit'] = function() {
      const FB = window['FB']

      FB.init({
        appId      : props.fbAppId,
        cookie     : true,
        xfbml      : true,
        version    : 'v10.0'
      });
        
      FB.AppEvents.logPageView();   
    };
  
    (function(d, s, id){
       var js, fjs = d.getElementsByTagName(s)[0];
       if (d.getElementById(id)) {return;}
       js = d.createElement(s); js.id = id;
       js.src = "https://connect.facebook.net/en_US/sdk.js";
       fjs.parentNode.insertBefore(js, fjs);
     }(document, 'script', 'facebook-jssdk'));
  }

  useEffect(function mount() {
    loadFbLoginApi();
  },[])

  /*function testApi() {
    const FB = window['FB']
    FB.api('/me', function(response: any) {
      //console.log('Successful login for: ', response);
    });
  }*/

  async function updateLogin(response: any) {
    if (response.status==='connected') {
      if (await executeLoginFB({
        userID: response.authResponse.userID,        
        accessToken: response.authResponse.accessToken        
      })) {
        console.log('session success')
        setIsLoggedFB(true)
        //initSessionFB()
      }
      else {
        console.log('session fail')
      }
    }

    setIsLoggedFB(false)
  }

  function statusChangeCallback(response: any) {
    //console.log('statusChangeCallback, response:', response);

    updateLogin(response)

    if (response.status === 'connected') {
      //testApi();
      return
    } else if (response.status === 'not_authorized') {
      //console.log("Please log into this app.");
    } else {
      //console.log("Please log into this facebook.");
    }
  }

  function checkLoginState() {
    const FB = window['FB']
    FB.getLoginStatus(function(response: any) {
      statusChangeCallback(response);
    }
    //.bind(this)
    )
  }

  function handleFBLogin() {
    const FB = window['FB']

    updatePlataform('fb')

    FB.getLoginStatus((response: any) => {
      if (response.status!=='connected') {
        FB.login(checkLoginState());
      }
      else {
        statusChangeCallback(response)
      }
    })
    //FB.login(checkLoginState());
  }

  return (
    <div className={styles.loginFacebookContainer}> 
      <button
        onClick = {handleFBLogin}
      >
        <FaFacebook size={48} />
        { isLoggedFB
          ? 'Continuar com o Facebook' 
          : 'Entrar com o Facebook '
        }
      </button>
    </div>
  )
}
