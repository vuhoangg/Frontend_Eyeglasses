import { Input } from 'antd';
import { Button, Flex } from 'antd';
import { useState } from 'react';
const UserForm = () =>{
    const [fullName, setfullName ] = useState("");
    const [email, setEmail ] = useState("");
    const [password, setPassword ] = useState("");
    const [phone, setPhone ] = useState("");
  
    
    
    const handleClickBtn = () =>{
            console.log(">> Check ", {fullName, email , password, phone}  )

        }
      
     
    return(
        <>
            <div className="user-form" style={{ margin :"20px 0 "}} >
                <div style={{ display: "flex", marginLeft: "10px", gap: "10px", flexDirection: "column"}}>
                <div>
                    <span> Full Name </span>
                     <Input placeholder=""  type="text" 
                     onChange={(event)=>{setfullName(event.target.value)}} 
                     value={fullName}
                     />
                </div>
                
                <div>
                     <span> Email1111 </span>
                     <Input placeholder=""
                      onChange={(event)=>{setEmail(event.target.value)}} 
                      value={email}
                     />
                </div>
                <div>
                     <span>PassWord </span>
                     <Input.Password 
                      onChange={(event)=>{setPassword(event.target.value)}} 
                      value={password}
                     />
                </div>
                <div>
                     <span>Phone Number </span>
                     <Input placeholder=""
                      onChange={(event)=>{setPhone(event.target.value)}} 
                      value={phone}
                     />
                </div>

                <div>
                <Button type="primary" onClick={handleClickBtn}>Create User </Button>
                </div>
                </div>
            </div>

        </>
    );
}

export default UserForm;