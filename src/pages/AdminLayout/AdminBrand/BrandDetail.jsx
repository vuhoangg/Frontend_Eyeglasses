import { Drawer, Button,  notification, message  } from  'antd';
import { useEffect, useState } from 'react';
import { handleUploadFile , updateBrandAPI} from '../../../services/api.brand'


const BrandDetail = (props) =>{


const {isDetailOpen, setIsDetailOpen, dataDetail, setDataDetail, reloadBrands } = props;
const [selectedFile, setSelectedFile] = useState(null)
const [preview, setPreview] = useState(null)



  const showDrawer = () => {
    setIsDetailOpen(false);
  };
  const onClose = () => {
    setIsDetailOpen(false);
    setDataDetail(null);
  };

  const handleOnChangeFile =(event)=>{
    if (!event.target.files || event.target.files.length === 0) {
        setSelectedFile(null)
        setPreview(null)
        return
    }

    // I've kept this example simple by using the first image instead of multiple
    const file = event.target.files[0]
    if(file) {
        setSelectedFile(file)
        setPreview(URL.createObjectURL(file))
    }
    // console.log(">> check file :", file );

  }


  const handleUpdateBrandLogo = async()=>{
    // step 1: upload file

        const resUpload = await handleUploadFile(selectedFile, "brand");
        console.log(">> check file :", resUpload);
        if(resUpload.data){
            const newLogo = resUpload.data.fileName;
            const resUpdateLogo = await updateBrandAPI(dataDetail.id, dataDetail.name , dataDetail.description , newLogo )
            console.log(">> newLogo :", newLogo);

            if (resUpdateLogo.data){
                setIsDetailOpen(false);
                setSelectedFile(null)
                setPreview(null)
                reloadBrands();
                notification.success({
                    message: "Update brand logo ",
                    description: "Cập nhật thành công"
                })
            }else{
                notification.error({
                    message: "Error upload logo  ",
                    description: "Cập nhật thật bại "
                })
            }
        }




    // step 2: update product

  }

  return (
    <>
      <Drawer width={"40vw"} title="Brand Detail" onClose={onClose} open={isDetailOpen} maskClosable={false} >
        {dataDetail ? <>
            <p>Mã thương hiệu: {dataDetail?.id}</p><br/>
            <p>Tên thương hiệu: {dataDetail.name}</p><br/>
            <p>Mô tả: {dataDetail.description}</p><br/>
            <p>Logo thương hiệu: </p><br/>

            <div style={{ marginTop: "10px", height: "200px", width: "150px", border: "1px solid #ccc"}}>
                <img  style={{  height: "100%", width: "100%", objectFit: "contain"}}
                src={`http://localhost:8082/images/brand/${dataDetail.logo}`}/>
            </div>

            <div >
                <label htmlFor="btnUpload" style={{
                    display :"block",
                    width: "fit-content",
                    marginTop: "15px",
                    padding: "5px 10px ",
                    background : "orange",
                    borderRadius : "5px",
                    cursor: "pointer"
                }}>
                    Upload Logo
                </label>
            <input hidden id='btnUpload' type="file"
             onChangeCapture={(event)=> handleOnChangeFile(event)}
             />
            </div>


            {preview &&
                <>
                    <div style={{ marginTop: "10px", height: "200px", width: "150px", border: "1px solid #ccc"}}>
                        <img  style={{  height: "100%", width: "100%", objectFit: "contain"}}
                        src={preview}/>
                    </div>
                    <Button type='primary'
                    onClick={()=> handleUpdateBrandLogo() }
                     >Save</Button>
                </>
            }

        </>:
        <> <p> No data available </p>
        </>}
      </Drawer>
    </>
  );
};



export default BrandDetail;