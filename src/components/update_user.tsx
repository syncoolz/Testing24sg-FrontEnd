import { useState, useEffect, SyntheticEvent } from 'react'
import { ResponseUser, User } from '../components/entities/user.entity'
import '../pages/users.css'
import Url from '../config/url'


interface Props {
    setUserData: (val: User[]) => void;
    usersData: User[];
    oldUserData: User;
    setPopupUpdate: (val: boolean) => void;
}
const UpdateUser = ({ setUserData, usersData, oldUserData, setPopupUpdate }: Props) => {
    const [inputName, setInputName] = useState(oldUserData.name)
    const [inputAge, setInputAge] = useState(oldUserData.age)
    const [inputEmail, setInputEmail] = useState(oldUserData.email)
    const [inputAvatar, setInputAvatar] = useState(oldUserData.avatarUrl)

    const [result, setResult] = useState<ResponseUser>({
        statusCode: 0,
        message: "",
        data: []
    })

    const closePopup = () => {
        setPopupUpdate(false)
    }

    useEffect(() => {        
        return () => {
            console.log("return useEffect")
            if (result && result.data.length > 0) {
                let updateNewData = usersData.map(user=>{
                    if (user.id === result.data[0].id) return result.data[0]
                        return user
                })
                setUserData(updateNewData)        
            } 
        }
    }, [result])

    const update = (event:SyntheticEvent) => {
        event.preventDefault()
        const controller = new AbortController()
        const signal = controller.signal
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: inputName,
                age: inputAge,
                email: inputEmail,
                avatarUrl: inputAvatar
            }),
            signal
        }

        fetch(`${Url}/users/${oldUserData.id}`, requestOptions)
            .then(response => response.json())
            .then((data) => {
                setResult({ ...result, ...data })
                console.log(data)
            })
            .catch(err => setResult({ ...result, ...err }))

        return () => {
            controller.abort()
        }
    }

    return (
        <div className="box popup-content ">
            <form className="box">
                <div className='popup-header'>
                    <h1 className="label">Update User</h1>
                    <h1 className="label closepopup" onClick={closePopup}>X</h1>
                </div>
                <div className="field">
                    <label className="label">Name</label>
                    <div className="control">
                        <input className="input" onChange={(e) => { setInputName(e.target.value) }} placeholder="Marry" value={inputName} />
                    </div>
                </div>

                <div className="field">
                    <label className="label">Age</label>
                    <div className="control">
                        <input className="input" onChange={(e) => { setInputAge(Number(e.target.value)) }} placeholder="18" value={inputAge} />
                    </div>
                </div>

                <div className="field">
                    <label className="label">Email</label>
                    <div className="control">
                        <input className="input" type="email" placeholder="xxx@email.com" onChange={(e) => { setInputEmail(e.target.value) }} value={inputEmail} />
                    </div>
                </div>

                <div className="field">
                    <label className="label">AvatarUrl</label>
                    <div className="control">
                        <input className="input" placeholder="https://i.pravatar.cc/150?img=15" onChange={(e) => { setInputAvatar(e.target.value) }} value={inputAvatar} />
                    </div>
                </div>

                {result.message !== "" && result.message === "success" ? <h3 className="st-success">Success to updated</h3> : <h3 className="st-failed">{result.message}</h3>}

                <button className="button is-primary" onClick={(event:SyntheticEvent)=>update(event)}>Update User</button>
            </form>
        </div>
    )
}

export default UpdateUser