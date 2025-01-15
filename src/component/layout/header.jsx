import './header.css'
import { Link } from 'react-router-dom';
const HeaderLayout= ()=>{
    // tab a = anchor khi ta sử dụng thể a thì ngày lập từ website bị load lại trang khi chuyển đường link 
    // vì vậy tả chuyển qua component <Link>
    return(
         <>
            <ul className="menu_bar">
                <li><Link class="active" to="/">Home</Link></li>
                <li><Link to="/user">User</Link></li>
                <li><Link to="/product">Product</Link></li>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Register</Link></li>
            </ul>
        </>
    );
}

export default HeaderLayout;