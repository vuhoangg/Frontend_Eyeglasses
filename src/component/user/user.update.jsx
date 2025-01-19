import { Input } from 'antd';
import { Button, Modal} from 'antd';
import { useEffect, useState } from 'react';
import { createUserAPI } from '../../services/api.service';
import { notification } from 'antd';
const UpdateUserModal =(props)=>{

    const [id, setId] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    // const [password, setPassword] = useState("");
    const [address, setAddress] = useState("");

     
    // console.log("check props ", props );
    // const {loadUser} = props ;
    const {isModalUpdate, setIsModalUpdate, dataUpdate, setDataUpdate} = props;

    useEffect(()=> {
        console.log( "check data update props useEffect ", dataUpdate)
        if (dataUpdate)
        {
            setId(dataUpdate._id);
            setName(dataUpdate.name);
            setEmail(dataUpdate.email);
            setAddress(dataUpdate.address);
        }
    },[dataUpdate])

 



    const showModal = () => {
      setIsModalUpdate(true);
    };
    const handleOk = () => {

        handleClickBtn();
      setIsModalUpdate(false);
    };
    const handleCancel = () => {
      setIsModalUpdate(false);
    };

   
   
    const handleClickBtn =  async () => {
       const res = await  createUserAPI(name, email, password, address )
       setId("");
       setName("");
       setEmail("");
       setPassword("");
       setAddress("");
      
       if(res.data){ 
        notification.success({
            message: "create user ",
            description : " tạo user thành công "
         
        })
        // await loadUser();
       }else{
        {
            setIsModalUpdate(true);
            notification.error({
                message: "Error create user ",
                description:JSON.stringify(res.message)
            })

        } 
       }
    }
    console.log(">> check data update prop ",dataUpdate )
    return (
        <>
                    <Modal title="Update  User" 
                    open={isModalUpdate}
                    onOk={handleOk}
                      onCancel={handleCancel}
                      maskClosable={false}
                      okText={"Update"}
                      >

<div className="user-form" style={{ margin: "20px 20px " }}>
                        <div style={{
                        display: "flex",
                        marginLeft: "10px",
                        gap: "10px",
                        flexDirection: "column"
                    }}>
                    <div>
                        <div>Id</div>
                        <Input
                            disabled
                            value={id}
                        />
                    </div>
                    <div>
                        <div>Name</div>
                        <Input
                            placeholder=""
                            onChange={(event) => setName(event.target.value)}
                            value={name}
                        />
                    </div>
                    <div>
                        <div>Email</div>
                        <Input
                            placeholder=""
                            onChange={(event) => setEmail(event.target.value)}
                            value={email}
                        />
                    </div>
                    {/* <div>
                        <div>PassWord</div>
                        <Input.Password
                          placeholder=""
                            onChange={(event) => setPassword(event.target.value)}
                            value={password}
                        />
                    </div> */}
                    <div>
                        <div>Address</div>
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
                  
        </>

    );
}
export default UpdateUserModal ;