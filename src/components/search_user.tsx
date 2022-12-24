import { useState, useEffect, SyntheticEvent } from 'react'
import { ResponseUser, User } from './entities/user.entity'
import '../pages/users.css'
import Url from '../config/url'


interface Props {
    setUserData: (val: User[]) => void;
    setPopupSearch: (val: boolean) => void;
}
const SearchUsers = ({ setUserData, setPopupSearch }: Props) => {
    const [inputName, setInputName] = useState('')
    const [inputEmail, setInputEmail] = useState('')
    const [inputPage, setInputPage] = useState(1)
    const [inputLimit, setInputLimit] = useState(100)

    const [result, setResult] = useState<ResponseUser>({
        statusCode: 0,
        message: "",
        data: []
    })

    const closePopup = () => {
        setPopupSearch(false)
    }

    useEffect(() => {        
        return () => {
            console.log("return useEffect")
            if (result && result.data.length > 0) {
                console.log(result.data)
                setUserData(result.data)  
            } 
        }
    }, [result])

    const search = (event:SyntheticEvent) => {
        event.preventDefault()
        const controller = new AbortController()
        const signal = controller.signal
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            signal
        }

        fetch(`${Url}/users/filters?name=${inputName}&email=${inputEmail}&page=${inputPage}&limit=${inputLimit}`, requestOptions)
            .then(response => response.json())
            .then((data) => {
                setResult({ ...result, ...data })
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
                    <h1 className="label">Search users data by</h1>
                    <h1 className="label closepopup" onClick={closePopup}>X</h1>
                </div>
                <div className="field">
                    <label className="label">Filter Name</label>
                    <div className="control">
                        <input className="input" onChange={(e) => { setInputName(e.target.value) }} placeholder="Marry" value={inputName} />
                    </div>
                </div>

                <div className="field">
                    <label className="label">Filter Email</label>
                    <div className="control">
                        <input className="input" type="email" placeholder="xxx@email.com" onChange={(e) => { setInputEmail(e.target.value) }} value={inputEmail} />
                    </div>
                </div>

                <div className="field">
                    <label className="label">Filter Page</label>
                    <div className="control">
                        <input className="input" onChange={(e) => { setInputPage(Number(e.target.value)) }} placeholder="18" value={inputPage} />
                    </div>
                </div>

                <div className="field">
                    <label className="label">Filter Limit</label>
                    <div className="control">
                        <input className="input" placeholder="https://i.pravatar.cc/150?img=15" onChange={(e) => { setInputLimit(Number(e.target.value)) }} value={inputLimit} />
                    </div>
                </div>

                {result.message !== "" && result.message === "success" ? <h3 className="st-success">Success to search</h3> : <h3 className="st-failed">{result.message}</h3>}

                <button className="button is-primary" onClick={(event:SyntheticEvent)=>search(event)}>Search Users</button>
            </form>
        </div>
    )
}

export default SearchUsers