import { useEffect, useState } from "react"
import {io} from 'socket.io-client'

const socket = io(import.meta.env.VITE_REACT_APP_SERVER_URL)

export default function  App  (){
  const [data, setData]= useState({name:'',age:0})
  const [form,setForm] = useState([])

  useEffect(()=>{
      socket.on("connect",(s)=>{
     console.log('o>',s)
     console.log(socket.id)
    })
      socket.on('reply',(dataReturn)=>{
      console.log('server replay > ',dataReturn)
      setForm([...dataReturn])
    })
    socket.on('data',(data)=>{
      setForm(data)
    })
    return ()=>{
      socket.off('connect')
      socket.off('reply')
    }
  },[])

  useEffect(()=>{
    console.log('ef >',form)
  },[form])

  const handleSubmit = (e)=>{
    e.preventDefault()
    // console.log(data)
    socket.emit('data',{id: Date.now(),...data})
    // setForm([...form,{...data}])
  }
  const handleDelete = (e,id)=>{
    e.preventDefault()
    socket.emit('delete',{id})
  }



   return(
   <>
       <form onSubmit={handleSubmit}>
      <label htmlFor="emailData">username</label>
      <input id="emailData"  type="text" value={data.name} onChange={(e)=> setData({...data,name:e.currentTarget.value})} />
       <label htmlFor="ageData">age</label>
      <input id="ageData"  type="text" value={data.age} onChange={(e)=> setData({...data,age:e.currentTarget.value})} />
      <button type="submit">Submit</button>
    </form>
  <table style={{
  border: '2px solid red',
  borderCollapse: 'collapse',
  width: '10rem',
  height: '5rem',
  textAlign: 'center',
}}>
  <thead style={{ backgroundColor: 'orange' }}>
    <tr>
      <th style={{ border: '1px solid red', padding: '4px' }}>No</th>
      <th style={{ border: '1px solid red', padding: '4px' }}>Name</th>
      <th style={{ border: '1px solid red', padding: '4px' }}>Age</th>
    </tr>
  </thead>
  <tbody>
   {Array.isArray(form) && form.map((cu,i)=>(
     <tr key={cu.id}>
      <td style={{ border: '1px solid red', padding: '4px' }}>{i+1}</td>
      <td style={{ border: '1px solid red', padding: '4px' }}>{cu.name}</td>
      <td style={{ border: '1px solid red', padding: '4px' }}>{cu.age}</td>
      <td style={{ border: '1px solid red', padding: '4px' }} onClick={(e)=> handleDelete(e,cu.id)}>Delete</td>
      <td style={{ border: '1px solid red', padding: '4px' }}>Edit</td>
    </tr>
   ))}
  </tbody>
</table>

   </>

   )
}