import { useState, useEffect, SyntheticEvent } from 'react'
import { User } from '../components/entities/user.entity'
import { Button, Card } from 'react-bulma-components'
import Navigate from './navigate'

type Props = {
    usersData: User[];
    setPopupUpdate: (val: boolean) => void;
    setDataUpdateId: (val: User) => void;
    deleteUser: (event: SyntheticEvent , val: number) => void;
}

export default function Pagination({ usersData, setPopupUpdate, setDataUpdateId, deleteUser }: Props) {
    const [blogPosts, setBlogPosts] = useState<User[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(3);    

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = blogPosts.slice(indexOfFirstPost, indexOfLastPost);

    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const previousPage = () => {
        if (currentPage !== 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const nextPage = () => {
        if (currentPage !== Math.ceil(blogPosts.length / postsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    // const compareDelete = (ownData:User) => {
    //     const datacompare = blogPosts.filter(user=>user.id !== ownData.id)
    //     setBlogPosts(datacompare)
    // }

    useEffect(() => {
        setBlogPosts(usersData)
        return () => {}
    }, [usersData])

    return (
        <div className="container">
            <div className="userposts">
                {currentPosts && currentPosts.map((user: User, index) => {
                    return (
                        <Card className="card-users" key={index}>
                            <Card.Image className="image" src={user.avatarUrl} />
                            <Card.Content>
                                <ul>User ID : {user.id}</ul>
                                <ul>Name : {user.name}</ul>
                                <ul>Age : {user.age}</ul>
                                <ul>Email : {user.email}</ul>
                            </Card.Content>
                            <Card.Footer>
                                <Button fullwidth={true} color="primary" onClick={() => {
                                    setPopupUpdate(true)
                                    setDataUpdateId(user)
                                }}>Update</Button><br />
                                <Button fullwidth={true} color="danger" onClick={(event:SyntheticEvent) => { 
                                    deleteUser(event ,user.id) 
                                    // compareDelete(user)
                                }}>Delete</Button>
                            </Card.Footer>
                        </Card>
                    )
                })
                }
            </div>
            <div className="navigate">
                {currentPosts &&
                    <Navigate
                        postsPerPage={postsPerPage}
                        totalPosts={blogPosts.length}
                        paginate={paginate}
                        previousPage={previousPage}
                        nextPage={nextPage}
                    />
                }
            </div>
        </div>
    )
}