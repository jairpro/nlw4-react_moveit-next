import styles from '../styles/pages/PageLoader.module.css'
import { getRandomIntInclusive } from '../utils/random';

//import Loader from 'react-loaders'
var Loader = require('react-loaders').Loader;

export default function PageLoader() {
  return (
    <div className={styles.pageLoaderContainer}>
      <img src={
        //"/logo.png"
         getRandomIntInclusive(0,1) ? "/icons/body.svg" : "/icons/eye.svg"
        //"/logo-login.svg"
      } alt="Moveit"/>

      <div className={styles.reactLoader}>
        <Loader 
          type="ball-triangle-path" 
          active={true}
          style={{transform: 'scale(7)'}}
        />
      </div>
    </div>
  )
}