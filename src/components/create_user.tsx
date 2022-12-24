import { useState, useEffect, SyntheticEvent } from 'react'
import { ResponseUser, User } from '../components/entities/user.entity'
import '../pages/users.css'
import Url from '../config/url'


interface Props {
    setUserData: (val: User[]) => void;
    usersData: User[];
    setPopupCreate: (val: boolean) => void
}
const CreateUser = ({ setUserData, usersData, setPopupCreate }: Props) => {
    const [inputName, setInputName] = useState('')
    const [inputAge, setInputAge] = useState(18)
    const [inputEmail, setInputEmail] = useState('')
    const [inputAvatar, setInputAvatar] = useState('')
    const [result, setResult] = useState<ResponseUser | null>(null)

    const closePopup = () => {
        setPopupCreate(false)
    }

    useEffect(() => {
        
        return () => {
            console.log("return useEffect")
            if (result && result.data.length > 0) {
                setUserData([...usersData, ...result.data])
            }
        }
    }, [result])

    const create = (event:SyntheticEvent) => {
        event.preventDefault()
        const controller = new AbortController()
        const signal = controller.signal
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: inputName,
                age: inputAge,
                email: inputEmail,
                avatarUrl: inputAvatar
            }),
            signal
        }

        fetch(`${Url}/users`, requestOptions)
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
                    <h1 className="label">Create User</h1>
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

                {result && result.message !== "" && result.message === "success" ? <h3 className="st-success">Success to create</h3> : <h3 className="st-failed">{result && result.message}</h3>}

                <button className="button is-primary" onClick={(event:SyntheticEvent)=>create(event)}>Create New User</button>
            </form>
        </div>
    )
}

export default CreateUser