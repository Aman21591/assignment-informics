import './App.css';
import {useState,useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert';
import * as XLSX from 'xlsx';
function App() {
  const [data,setData]=useState([]);
  const [show, setShow] = useState(false);
  const [option,setOption]=useState("ADD");
  const [msg,setMsg]=useState(null);
  const [values,setValues]=useState({
      id:null,
      first_name:"",
      last_name:"",
      email:"",
      gender:"Male",
      race:"",
   })
  const resetValues={
      id:null,
      first_name:"",
      last_name:"",
      email:"",
      gender:"Male",
      race:"",
   }
  const handleClose = () => setShow(false);
  const handleAdd = () => {setOption("ADD");setShow(true)};
  const handleUpdate=(id)=>{
        setOption("EDIT")
        setShow(true)
         const updateData=data.find(user=>user.id===id);
        setValues(updateData)
  }
  const handleSubmit=(id)=>{
      console.log("new",values,option)
    switch(option){
        case "ADD":
          const addExist=data.some(user=>user.email===values.email);
        if(values.first_name!="" && values.last_name!="" && values.email!="" && values.race!=""){
          if(!addExist ){
          values.id=data.length > 0 ? data[data.length-1].id+1:0
          console.log(values.id);
          setData([...data,values])         
          setValues(resetValues)
          setMsg({success:"Create Succcesfully",error:""})
          
          }else{
            setMsg({success:"",error:"Already Exist"})
          }
        }else{
            setMsg({success:"",error:"Fields Is Required"})
          }
          setShow(false)
          break;
        case "EDIT":
         console.log("update",id)
         const exist=data.some(user=>user.id===id);
        if(exist){
         console.log("update 2",id)
         const selectUser=data.findIndex(user=>user.id==id)
         let editData=data;
          editData[selectUser]={...editData[selectUser],...values}
         setData(editData)
         setMsg({success:"Update Succcesfully",error:""})
         
         setShow(false);
         setValues(resetValues)
       }
       break;
   }
     
  }
  const handleChange=(e)=>{
    setValues({...values,[e.target.name]:e.target.value})
  }
  const [raceOptions,setRaceOpt]=useState([]);
  const xlsxtojson=(e)=>{
    e.preventDefault();
    console.log("file",e.target.files[0]);
    const myFile=e.target.files[0];
    if (myFile) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = e.target.result;
            const workbook = XLSX.read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            console.log(jsonData);
            setData(jsonData)
           let raceOption=[];
          jsonData && jsonData.map((user)=>{
             if(raceOption.indexOf(user.race)===-1){
                  raceOption.push(user.race)
              }
          })
          setRaceOpt(raceOption);
          console.log("op",raceOption);
        };
        reader.readAsArrayBuffer(myFile);
      
    }
  }
  const RaceOption=()=>{
        return(<Form.Select aria-label="Default select example">
                {raceOptions.map((raceItem,index)=>{
                  return <option value={raceItem} key={index}>{raceItem}</option>     
                })}
            </Form.Select>)
  }
  useEffect(()=>{
     if(!show){
       setTimeout(()=>setMsg(null),3000);
       
      }
  },[data,raceOptions,option,show])
  return (
    <div className="App">
    <div className="container mt-5">
   
     <Form>
      <Form.Group className="mb-3">
        <input className="form-control" onChange={xlsxtojson} type="file"/>
      </Form.Group>
     </Form>
       {msg && <Alert variant={msg.error ? 'danger':'success'}>{msg.success ?msg.success:msg.error}</Alert>}
      {data.length > 0 &&
        (
        <>
        <div className="text-right" style={{textAlign:"right"}}>
         <Button variant="success" onClick={handleAdd}>Add</Button>
        </div>
      <Table bordered hover>
      <thead className="bg-primary text-white ">
        <tr>
          <th>#</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Email</th>
          <th>Gender</th>
          <th>Race</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
      {data && data.map((user,index)=>{
       const {id,first_name,last_name,email,gender,race}=user
       return ( <tr key={index}>
          <td>{id}</td>
          <td>{first_name}</td>
          <td>{last_name}</td>
          <td>{email}</td>
          <td>{gender}</td>
          <td>
            <Form.Select defaultValue={race} aria-label="Default select example">
                {raceOptions.map((raceItem,index)=>{
                  return <option value={raceItem} key={index}>{raceItem}</option>     
                })}
            </Form.Select>
          </td>
         <td>
           <div className="d-flex gap-2 text-center justify-center">
            <Button variant="warning" onClick={()=>handleUpdate(id)}>Edit</Button>
           </div>
         </td>
        </tr>)
       })}
      </tbody>
    </Table></>)}
     
     <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form>
	      <Form.Group className="mb-3" controlId="formFirstName">
		<Form.Label>Firstname</Form.Label>
		<Form.Control name="first_name" defaultValue={option==="EDIT" ? values.first_name:""} onChange={handleChange} type="text" placeholder="Enter firstname" />
	      </Form.Group>
               <Form.Group className="mb-3" controlId="formlastName">
		<Form.Label>Lastname</Form.Label>
		<Form.Control name="last_name" onChange={handleChange} defaultValue={option==="EDIT" ? values.last_name:""} type="text" placeholder="Enter lastname" />
	      </Form.Group>
              <Form.Group className="mb-3" controlId="formEmail">
		<Form.Label>Email</Form.Label>
		<Form.Control name="email" onChange={handleChange} defaultValue={option==="EDIT" ? values.email:""} type="email" placeholder="Enter email" />
	      </Form.Group>
             <Form.Group className="mb-3" controlId="formGender">
		<Form.Label>Gender</Form.Label>
                 <Form.Check
                   type="radio"
                   name="gender"
                   label="male"
                   value="Male"
                   id={`male-radio`}
                   onChange={handleChange}
                   checked={values.gender==="Male"}
                 />
                  <Form.Check
                   type="radio"
                   name="gender"
                   label="Female"
                   value="Female"
                   id={`female-radio`}
                   onChange={handleChange}
                   checked={values.gender==="Female"}
                 />
	      </Form.Group>
               <Form.Group className="mb-3" controlId="formRace">
		<Form.Label>Race</Form.Label>
               <Form.Select name="race" onChange={handleChange} defaultValue={values.race} aria-label="Default select example">
                    <option selected >Open this select menu</option>
                     {raceOptions.map((raceItem,index)=>{
                       return <option value={raceItem} key={index}>{raceItem}</option>     
                     })}
               </Form.Select>
	      </Form.Group>
         </Form>
       </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={()=>{handleSubmit(values?.id)}}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
    <div>
    {data.length > 0 && (
        <textarea
          cols={70}
          rows={30}
          value={JSON.stringify(data, null, 2)}
          readOnly
          className='text-area'
        />
      )}
    </div>
  </div>
  );
}

export default App;
