import { Drawer, Button,  notification, message  } from  'antd';
import { useEffect, useState } from 'react';
import { handleUploadFile , updateProductAPI} from '../../../services/api.product'


const ProductDetail = (props) =>{


const {isDetailOpen, setIsDetailOpen, dataDetail, setDataDetail, reloadProducts } = props;
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
//   console.log(">> check file :", preview  );

  const handleUpdateProductImage = async()=>{
    // step 1: upload file 
 
        const resUpload = await handleUploadFile(selectedFile, "product");
        console.log(">> check file :", resUpload);
        if(resUpload.data){
            const newImage = resUpload.data.fileName;
            const resUpdateImage = await updateProductAPI(dataDetail.id, dataDetail.name , dataDetail.description , dataDetail.price ,dataDetail.stock_quantity , dataDetail.category_id , dataDetail.brand_id,  newImage, dataDetail.sku )
            console.log(">> newImage :", newImage);

            if (resUpdateImage.data){
                setIsDetailOpen(false);
                setSelectedFile(null)
                setPreview(null)
                reloadProducts();
                notification.success({
                    message: "Update product Image ",
                    description: "Cập nhật thành công"
                })
            }else{
                notification.error({
                    message: "Error upload Image  ",
                    description: "Cập nhật thật bại "
                })
            }
        }

  


    // step 2: update product

  }

  return (
    <>
      <Drawer width={"40vw"} title="Profile" onClose={onClose} open={isDetailOpen} maskClosable={false} >
        {dataDetail ? <>
            <p>{dataDetail?.id}</p><br/>
            <p>{dataDetail.name}</p><br/>
            <p>{dataDetail.description}</p><br/>
            <p>{dataDetail.price}</p><br/>
            <p>{dataDetail.stock_quantity}</p><br/>
            <p>{dataDetail.category_id}</p><br/>
            <p>{dataDetail.brand_id}</p><br/>
            <p>{dataDetail.sku}</p><br/>
            <p>Image: </p><br/>

            <div style={{ marginTop: "10px", height: "200px", width: "150px", border: "1px solid #ccc"}}>
                <img  style={{  height: "100%", width: "100%", objectFit: "contain"}}
                src={`http://localhost:8082/images/product/${dataDetail.imageProduct}`}/>
{/* src={`${import.meta.env.VITE_BACKEND_URL}/images/avatar/${dataDetail.avatar}`} */}
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
                    Upload Image
                </label>
            <input hidden id='btnUpload' type="file"
             onChangeCapture={(event)=> handleOnChangeFile(event)}

             accept="image/png, image/jpeg" />
            </div>


            {preview && 
                <>
                    <div style={{ marginTop: "10px", height: "200px", width: "150px", border: "1px solid #ccc"}}>
                        <img  style={{  height: "100%", width: "100%", objectFit: "contain"}}
                        src={preview}/>
                    </div>
                    <Button type='primary' 
                    onClick={()=> handleUpdateProductImage() }
                     >Save</Button>
                </>
            }
            
        </>: 
        <> <p> không có dữ liệu nào </p>
        </>}
      </Drawer>
    </>
  );
};



export default ProductDetail;