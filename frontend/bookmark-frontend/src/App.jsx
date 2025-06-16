import React, {useState,useEffect} from 'react'
import axios from 'axios';
import { Plus,Pencil, Save} from "lucide-react";
const App= ()=>{
    const [qlid, setQlid] =useState("");
    const [data, setData] = useState([]);
    const [editing, setEditing] = useState({});
    const [temp, setTemp] = useState({});
    const [addFieldIndex, setAddFieldIndex] = useState(null);
    const [newFieldKey,setNewFieldKey] = useState("");
    const [newFieldValue, setNewFieldValue] = useState("");
    const [showComponentInput, setShowComponentInput] = useState(false);
    const [newComponentName,setNewComponentName] = useState("");
    const [showJsonEditor, setShowJsonEditor] = useState(false);
    const [rawJson, setRawJson] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        const savedQlid = localStorage.getItem("Qlid");
        if(!savedQlid)
        {
            const userQlid = prompt('Please enter your Quick look Id:');
            if(userQlid && userQlid.trim() !== ''){
                localStorage.setItem("Qlid",userQlid);
                setQlid(userQlid);  
            }
            else {
                alert('Qlid is required to continue.');
            }

        }
        else
        {
            setQlid(savedQlid);      
        }
        fetchData(savedQlid);    
    },[])
    const fetchData = async (qlid)=>{
      qlid =localStorage.getItem("Qlid");
        if(!qlid) return;
        setLoading(true)
        try{
            const res = await axios.get(`https://bookmark-app-1.onrender.com/data/${qlid}`);
            setData(res.data);
        }catch(err)
        {
            console.log(err);
            setData([]);
        }
        finally{
            setLoading(false)
        }
    };
    const handleAddComponent = ()=>{
        setShowComponentInput(true);
        setNewComponentName("");
    }
    const handleKeyDown = (e,idx,key) =>{
      if(e.key === "Enter") {
        e.preventDefault();
        saveEditedField(idx,key);
      }
    }
    const SaveComponent = ()=>{
        if(!newComponentName.trim()) return;
        const updated = [...data,{name:newComponentName.trim()}]
        setData(updated);
        saveData(updated);
        setShowComponentInput(false);
    }
    const handleAddNewField = (idx)=>{
        setAddFieldIndex(idx);
        setNewFieldKey("");
        setNewFieldValue("");
    }
    const handleAddField = (idx)=>{
        if(!newFieldKey) return;
        const updated = [...data]
        updated[idx][newFieldKey] = newFieldValue;
        setData(updated);
        saveData(updated)
        setAddFieldIndex(null);
    }
    const toggleEdit = (idx,key) => {
        const editKey = `${idx}-${key}`;
        setEditing((prev)=>({...prev,[editKey]:true}));
        if(key === 'name')
        {
            setTemp((prev)=>({...prev,[editKey]:data[idx][key]}));
        }
        else
            setTemp((prev)=>({...prev,[`${editKey}-value`]:data[idx][key],[`${editKey}-key`]:key}));
    }
    const handleFieldChange = (idx,key,value) =>{
        if(key=="name")
            setTemp((prev)=>({...prev,[`${idx}-${key}`]:value}));
        else
            setTemp((prev)=>({...prev,[`${idx}-${key}-value`]:value}));
    }
    const handleFieldNameChange = (idx,key,value)=>{
        setTemp((prev)=>({...prev,[`${idx}-${key}-key`]:value}))
    }
    const saveEditedField = async (idx,key)=>{
        const updatedData = [...data];
        if(key =="name")
        {
            updatedData[idx][key] = temp[`${idx}-${key}`];
        }
        else
        {
            const newvalue = temp[`${idx}-${key}-value`];
            const newKey = temp[`${idx}-${key}-key`]
            const component = updatedData[idx]
            const reordered = {};
            if(key === newKey)
                component[key] = newvalue;
            else{
                for(const k in component)
                {
                    if(k=== key){
                        reordered[newKey] = newvalue
                    }
                    else{
                        reordered[k] = component[k]
                    }
                }
                updatedData[idx] = reordered;
            }
            console.log("save",updatedData);
        }
        setData(updatedData);
        setEditing((prev)=>({
            ...prev,
            [`${idx}-${key}`]:false
        }));
        saveData(updatedData);
    }
    /*https://bookmark-app-1.onrender.com*/
    const saveData = async (newData)=>
        {
        try{
                await fetch(`https://bookmark-app-1.onrender.com/data/${qlid}`,{
                    method:"POST",
                    headers:{"Content-Type":"application/json"},
                    body:JSON.stringify(newData)
                })
            }catch(err)
            {
                console.error("error saving to json file",err);
            }
        }

    return(
        <div className='p-6 font-sans bg-gray-50 min-h-screen'>
            <div className='max-w-6xl mx-auto'>
            <div className='flex items-center justify-between mb-6'>
                <h1 className='text-3xl font-bold text-center flex-1 text-center'>Bookmark Page</h1>
                <button
                  className='bg-yellow-500 text-white px-4 py-2 rounded mb-4'
                  onClick={() => {
                    setRawJson(JSON.stringify(data, null, 2));
                    setShowJsonEditor(true);
                  }}
                >
                  Edit Raw JSON
                </button>
                </div>
                {loading ? (
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {Array.from({length:3}).map((_,i)=>(
                            <div key={i} className='p-4 bg-gray-100 rounded-lg animate-pulse space-y-4'>
                                <div className='h-4 bg-gray-300 rounded w-1/2'></div>
                                <div className='h-3 bg-gray-300 rounded w-3/4'></div>
                                <div className='h-3 bg-gray-300 rounded w-2/3'></div>
                                <div className='h-3 bg-gray-300 rounded w-full'></div>
                            </div>
                        ))}
                        </div>
                ):
                    (
                    <div>
                        {showJsonEditor && (
                          <div className='bg-white border rounded p-4 shadow-md mb-6'>
                            <h2 className='text-xl font-semibold mb-2'>Raw JSON Editor</h2>
                            <textarea
                              className='w-full h-64 p-2 border rounded font-mono text-sm'
                              value={rawJson}
                              onChange={(e) => setRawJson(e.target.value)}
                            />
                            <div className='flex justify-end gap-2 mt-2'>
                              <button
                                className='bg-gray-400 text-white px-4 py-2 rounded'
                                onClick={() => setShowJsonEditor(false)}
                              >
                                Cancel
                              </button>
                              <button
                                className='bg-green-600 text-white px-4 py-2 rounded'
                                onClick={() => {
                                  try {
                                    const parsed = JSON.parse(rawJson);
                                    setData(parsed);
                                    saveData(parsed); // Save to backend
                                    setShowJsonEditor(false);
                                  } catch (err) {
                                    alert("Invalid JSON format!");
                                  }
                                }}
                              >
                                Save Changes
                              </button>
                            </div>
                          </div>
                        )}
                        {showComponentInput ? (
                            <div className='mb-6 flex flex-wrap items-center gap-3 justify-center'>
                                <input type='text' placeholder='Componet name...' value={newComponentName} onChange={(e)=>setNewComponentName(e.target.value)}
                                className='p-2 border border-gray-300 rounded w-64 focus:outline-none focus:ring-2 focus:ring-blue-400' />
                                <button className='bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded' onClick={SaveComponent}>
                                    <Save size={16} className='inline-block mr-1'/>
                                </button>
                            </div>
                        ) : (
                            <div className='mb-6 text-center'>
                            <button className='bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center justify-between' onClick={handleAddComponent}>
                                <Plus size={18} className='mr-2'/>
                                Add Component
                            </button>
                            </div>
                        )}
                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {data.map((component,idx)=>(
                            <div key={idx} className='bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 shadow-md hover:shadow-lg rounded-xl p-4 w-full transition-all duration-300'>
                                <div >
                                    {editing[`${idx}-name`] ? (
                                        <div className='mb-4 flex items-center gap-2'>
                                            <input className='border p-2 rounded w-full' value= {temp[`${idx}-name`] || ""}
                                            onChange={(e)=>handleFieldChange(idx,"name",e.target.value)} onKeyDown={(e)=>handleKeyDown(e,idx,"name")}/>
                                            <button onClick = {()=> saveEditedField(idx,"name")} className='text-green-600 hover:text-green-800'>
                                                <Save size={18} />
                                            </button>
                                        </div>
                                    ): (
                                        <div className='mb-4 flex items-center justify-between'>
                                            <h2 className='text-xl font-semibold text-gray-800'>{component.name}</h2>
                                            <button onClick={ ()=> toggleEdit(idx,"name")} className='text-blue-500 hover:text-blue-700'>
                                                <Pencil size={18} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            <div className='space-y-3'>
                            {Object.entries(component).map(([key,value])=>{
                                if(key === "name") return null;
                                const editKey =`${idx}-${key}`;
                                return(
                                    <div key={editKey} className='mb-2'>
                                        {editing[editKey] ? (
                                            <div className='flex flex-col gap-2'>
                                                <input className='border p-2 rounded w-full' value= {temp[`${editKey}-key`] || ""}
                                                onChange={(e)=>handleFieldNameChange(idx,key,e.target.value)}  onKeyDown={(e)=>handleKeyDown(e,idx,key)}/>
                                                <input className='border p-2 rounded w-full' value= {temp[`${editKey}-value`] || ""}
                                                onChange={(e)=>handleFieldChange(idx,key,e.target.value)} onKeyDown={(e)=>handleKeyDown(e,idx,key)}/>
                                                <button onClick = {()=> saveEditedField(idx,key)} className='text-green-600
                                                 hover:text-green-800'>
                                                    <Save size={16} />
                                                </button>
                                        </div>
                                        ):(
                                            <div className='flex flex-row'>
                                                {/* <span className='text-sm text-gray-500 font-medium'>{key}</span>
                                                <div className='flex justify-between items-start gap-2'>
                                                <p className='text-sm text-gray-800 break-words'>{value}</p> */}
                                                <a href={value} className='text-ml w-120 text-blue-600 hover:underline mr-4' target='_blank'>{key}</a>
                                                <button onClick={ ()=> toggleEdit(idx,key)} className='text-gray-500
                                                 hover:text-gray-700'>
                                                    <Pencil size={16} />
                                                </button>
                                                {/* </div> */}
                                            </div>
                                        )}
                                    </div>  
                                );
                            })}
                            {addFieldIndex === idx ? (
                                <div className='mt-3 space-y-2'>
                                    <input type="text" placeholder='field name' value ={newFieldKey} onChange={(e)=>setNewFieldKey(e.target.value)}
                                    className='border p-2 rounded w-full' />
                                    <input type="text" placeholder='field value' value ={newFieldValue} onChange={(e)=>setNewFieldValue(e.target.value)}
                                    className='border p-2 rounded w-full' />
                                    <button className='bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded' onClick={()=>handleAddField(idx)}>
                                        <Plus size={14} className='inline-block mr-1'/>
                                        Add
                                    </button>
                                </div>
                            ):(
                                <button onClick={()=>handleAddNewField(idx)}
                                className='mt-4 text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded'>
                                    <Plus size={14} className='inline-block mr-1'/>
                                    Add Field
                                </button>
                            )}
                            </div>
                            </div>
                        ))}
                    </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default App;