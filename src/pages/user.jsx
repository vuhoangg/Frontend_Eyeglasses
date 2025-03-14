import HeaderLayout from "../component/layout/header";
import UserForm from "../component/user/user.form";
import UserTable from "../component/user/user.table";
import { useState, useEffect} from 'react';
import { fetchAllUserAPI } from "../services/api.service";
const UserPage = () =>{

    const [dataUsers , setDataUser ] = useState([]);
    // empty array => run once 
     useEffect(() => {
      console.log('Effect is running 111 ');
      loadUser();
    }, []
    );

    const loadUser = async () =>{
        const res = await fetchAllUserAPI();
        setDataUser( res.data.data);
        console.log ("check data ", res.data.data )
      }
    
    return(
        <>
        <div>
            <UserForm
             loadUser={loadUser}
            />
            <UserTable
            dataUsers={dataUsers}
            loadUser={loadUser}
            />
        </div>
        </>
    );
}

export default UserPage;