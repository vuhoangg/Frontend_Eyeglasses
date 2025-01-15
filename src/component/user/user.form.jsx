import { Input } from 'antd';
import { Button, Flex } from 'antd';
const UserForm = () =>{
    return(
        <>
            <div className="user-form" style={{ margin :"20px 0 "}} >
                <div style={{ display: "flex", marginLeft: "10px", gap: "10px", flexDirection: "column"}}>
                <div>
                    <span> Full Name </span>
                     <Input placeholder=""/>
                </div>
                
                <div>
                     <span> Email1111 </span>
                     <Input placeholder=""/>
                </div>
                <div>
                     <span>PassWord </span>
                     <Input.Password />
                </div>
                <div>
                     <span>Phone Number </span>
                     <Input placeholder=""/>
                </div>

                <div>
                <Button type="primary">Create User </Button>
                </div>
                </div>
            </div>

        </>
    );
}

export default UserForm;