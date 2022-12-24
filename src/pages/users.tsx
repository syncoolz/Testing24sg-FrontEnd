import { SyntheticEvent, useEffect, useState } from 'react'
import { Button } from 'react-bulma-components'
import { User } from '../components/entities/user.entity'
import CreateUser from '../components/create_user'
import UpdateUser from '../components/update_user'
import SearchUsers from '../components/search_user'
import Url from '../config/url'
import Pagination from './pagination'
import './users.css'
type Props = {}


export default function Users({ }: Props) {
    const [usersData, setUsersData] = useState<User[] | []>([])
    const [popupCreate, setPopupCreate] = useState<boolean>(false)
    const [popupUpdate, setPopupUpdate] = useState<boolean>(false)
    const [popupSearch, setPopupSearch] = useState<boolean>(false)
    const [dataUpdateId, setDataUpdateId] = useState<User | null>(null)

    let popup_create = null
    if (popupCreate) {
        popup_create = <CreateUser setUserData={setUsersData} usersData={usersData} setPopupCreate={setPopupCreate} />
    }
    let popup_update = null
    if (popupUpdate && dataUpdateId) {
        popup_update = <UpdateUser setUserData={setUsersData} usersData={usersData} oldUserData={dataUpdateId} setPopupUpdate={setPopupUpdate} />
    }
    let popup_search = null
    if (popupSearch) {
        popup_search = <SearchUsers setUserData={setUsersData} setPopupSearch={setPopupSearch} />
    }

    const deleteUser = (event: SyntheticEvent , id: Number) => {
        event.preventDefault()
        const controller = new AbortController()
        const signal = controller.signal
        const requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            signal
        }
        fetch(`${Url}/users/${id}`, requestOptions)
            .then(response => response.json())
            .then((data) => { console.log(data) })
            .catch(err => console.log(err))
        const updateUserdata = usersData.filter(user => user.id !== id)
        setUsersData(updateUserdata)
        return () => {
            controller.abort()
        }
    }

    useEffect(() => {
        fetch(`${Url}/users`)
            .then(response => response.json())
            .then(response => setUsersData(response))
    }, [])

    return (
        <div className="container">
            <div className="container main-content">
                <div className="tile is-parent">
                    <article className="tile is-child notification head">
                        <p className="title">Users Information Page</p>
                        <p className="subtitle">Testing</p>
                        <Button color="primary" onClick={() => { setPopupCreate(true) }}>Create User</Button>
                        <Button color="primary" onClick={() => { setPopupSearch(true) }}>Search Users</Button>
                    </article>
                </div>
            </div>
            <div className="container main-content">
                <div className="tile is-parent">
                    <article className="tile is-child notification head">
                        {usersData && usersData.length > 0 &&
                            <Pagination usersData={usersData} setPopupUpdate={setPopupUpdate} setDataUpdateId={setDataUpdateId} deleteUser={deleteUser} />
                        }
                    </article>
                </div>
            </div>
            <div className="container main-content">
                <div className="tile is-parent article">
                    <table className="tables">
                        <thead className='thead'>
                            <tr>
                                <td>Avatar</td>
                                <td>Id</td>
                                <td>Name</td>
                                <td>Age</td>
                                <td>Email</td>
                                <td>Actions</td>
                            </tr>
                        </thead>
                        <tbody className='tbody'>
                            {usersData && usersData.length > 0 && usersData.map((user, index) => {
                                return (
                                    <tr key={index}>
                                        <img className='image' src={user.avatarUrl}></img>
                                        <td>{user.id}</td>
                                        <td>{user.name}</td>
                                        <td>{user.age}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            <Button fullwidth={true} color="primary" onClick={() => {
                                                setPopupUpdate(true)
                                                setDataUpdateId(user)
                                            }}>Update</Button><br />
                                            <Button fullwidth={true} color="danger" onClick={(event:SyntheticEvent) => { deleteUser(event,user.id) }}>Delete</Button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>

                    </table>
                </div>
            </div>
            {popup_search}                
            {popup_update}
            {popup_create}
        </div>

    )
}