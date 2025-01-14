import './header.css'
const HeaderLayout= ()=>{
    return(
         <>
            <ul className="menu_bar">
                <li><a class="active" href="/">Home</a></li>
                <li><a href="/user">User</a></li>
                <li><a href="/product">Product</a></li>
                <li><a href="/login">Login</a></li>
                <li><a href="/register">Register</a></li>
            </ul>
        </>
    );
}

export default HeaderLayout;