import HeaderLayout from "../component/layout/header";
import UserForm from "../component/user/user.form";
import UserTable from "../component/user/user.table";

const UserPage = () =>{


    
    return(
        <>
        <div>
            <UserForm/>
            <UserTable/>
        </div>
        </>
    );
}

export default UserPage;