import { Link } from 'react-router-dom';
import logo from '../../images/logo.png';


function Footer() {
  return (
    <footer>
      <p>SOME for everyone! <Link to={`/Home/`} className="my-link"><img src={logo} alt="Some logo" className="footer-logo"></img></Link></p>
    </footer>
  );
}

export default Footer;