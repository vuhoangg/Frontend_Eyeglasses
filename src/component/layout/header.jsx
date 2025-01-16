import './header.css'
import { Link, NavLink} from 'react-router-dom';
const HeaderLayout= ()=>{
  
    return(
         <>
            <ul className="menu_bar">
                <li><NavLink to="/">Home</NavLink></li>
                <li><NavLink to="/user">User</NavLink></li>
                <li><NavLink to="/product">Product</NavLink></li>
                <li><NavLink to="/login">Login</NavLink></li>
                <li><NavLink to="/register">Register</NavLink></li>
            </ul>
        </>
    );
}

export default HeaderLayout;