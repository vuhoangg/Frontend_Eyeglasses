import { Input } from 'antd';
import { Button, Modal} from 'antd';
import { useState } from 'react';
import axios from 'axios';
import { createUserAPI } from '../../services/api.service';
import success from 'react';
import { notification } from 'antd';
const UserForm = (props) => {
    
    // console.log("check props ", props );
    const {loadUser} = props ;

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [address, setAddress] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
      setIsModalOpen(true);
    };
    const handleOk = () => {

        handleClickBtn();
      setIsModalOpen(false);
    };
    const handleCancel = () => {
      setIsModalOpen(false);
    };

   
   
    const handleClickBtn =  async () => {
       const res = await  createUserAPI(name, email, password, address )
       setName("");
       setEmail("");
       setPassword("");
       setAddress("");
      
       if(res.data){ 
        notification.success({
            message: "create user ",
            description : " tạo user thành công "
         
        })
        await loadUser();
       }else{
        {
            notification.error({
                message: "Error create user ",
                description:JSON.stringify(res.message)
            })
        } 
       }
    }

    // Hàm cập nhật một thuộc tính trong object company
    const handleCompanyChange = (field, value) => {
        setCompany((prevCompany) => ({
            ...prevCompany,
            [field]: value
        }));
   
    };

    return (
        <>
          
           <div style={{ display: "flex", justifyContent: "space-between"}}>
                        <h3> Table User</h3>
            <Button type="primary" onClick={showModal}>
                  + ADD User 
                </Button>
                    <Modal title="ADD User" 
                    open={isModalOpen}
                    onOk={handleOk}
                      onCancel={handleCancel}
                      maskClosable={false}
                      okText={"Create"}
                      >

                    <div className="user-form" style={{ margin: "20px 0 " }}>
                <div style={{
                        display: "flex",
                        marginLeft: "10px",
                        gap: "10px",
                        flexDirection: "column"
                    }}>
                    <div>
                        <span> Full Name </span>
                        <Input
                            placeholder=""
                            type="text"
                            onChange={(event) => setName(event.target.value)}
                            value={name}
                        />
                    </div>

                    <div>
                        <span> Email </span>
                        <Input
                            placeholder=""
                            onChange={(event) => setEmail(event.target.value)}
                            value={email}
                        />
                    </div>
                    <div>
                        <span> PassWord </span>
                        <Input.Password
                            onChange={(event) => setPassword(event.target.value)}
                            value={password}
                        />
                    </div>
                    <div>
                        <span> Address </span>
                        <Input
                            placeholder=""
                            onChange={(event) => setAddress(event.target.value)}
                            value={address}
                        />
                    </div>

                   
        

                    <div style={{ display: "flex", justifyContent: "space-between"}}>
                        <h3></h3>
                  

              
                        
                    </div>
                </div>
            </div>
                    </Modal>
                    </div>
        </>
    );
};

export default UserForm;
