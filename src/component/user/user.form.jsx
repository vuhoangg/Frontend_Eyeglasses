import { Input } from 'antd';
import { Button } from 'antd';
import { useState } from 'react';
import axios from 'axios';
import { createUserAPI } from '../../services/api.service';
import success from 'react';
import { notification } from 'antd';
const UserForm = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [address, setAddress] = useState("");

    // const [age, setAge] = useState("");
    // const [gender, setGender] = useState("");
    // const [role, setRole] = useState("");
    // const [company, setCompany] = useState({
    //     _id: "",
    //     name: "",
    // });

   
    // hứng kết quả Promise là gì ? sử dụng async và await
    const handleClickBtn =  async () => {
       const res = await  createUserAPI(name, email, password, address )
       if(res.data){ 
        notification.success({
            message: "create user ",
            description : " tạo user thành công "
        })
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
            <div className="user-form" style={{ margin: "20px 0 " }}>
                <div
                    style={{
                        display: "flex",
                        marginLeft: "10px",
                        gap: "10px",
                        flexDirection: "column"
                    }}
                >
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

                    {/* các trường bổ sung  */}

                    {/* <div>
                        <span> Age </span>
                        <Input
                            placeholder=""
                            onChange={(event) => setAge(event.target.value)}
                            value={age}
                        />
                    </div>
                    <div>
                        <span> Gender </span>
                        <Input
                            placeholder=""
                            onChange={(event) => setGender(event.target.value)}
                            value={gender}
                        />
                    </div>

                    <div>
                        <span> Role </span>
                        <Input
                            placeholder=""
                            onChange={(event) => setRole(event.target.value)}
                            value={role}
                        />
                    </div>

                
                    <div>
                        <span> Company Id  </span>
                        <Input
                            placeholder="Enter _id"
                            onChange={(event) =>
                                handleCompanyChange("_id", event.target.value)
                            }
                            value={company._id}
                        />
                    </div>
                    <div>
                        <span> Company Name </span>
                        <Input
                            placeholder="Enter company name"
                            onChange={(event) =>
                                handleCompanyChange("name", event.target.value)
                            }
                            value={company.name}
                        />
                    </div> */}

                    

                    <div>
                        <Button type="primary" onClick={handleClickBtn}>
                            Create User
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserForm;
