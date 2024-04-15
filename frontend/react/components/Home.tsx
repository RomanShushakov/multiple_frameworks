import { useEffect, useState } from 'react'
import Header from './header'
import { useNavigate } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import { Button } from 'react-bootstrap';

type User = {
    id: string,
    name: string,
    password: string,
    email: string,
    phone: string,
    country: string,
    address: string,
    role: string,
    gender: string
}

const Home = () => {
    const [user, userupdate] = useState({} as User);
    const usenavigate = useNavigate();
    useEffect(() => {
        if (sessionStorage.getItem('username') === null) {
            usenavigate('/login');
        } else {
           fetch("http://localhost:3001/user/" + sessionStorage.getItem('username')).then((res) => {
                return res.json();
            }).then((resp) => { userupdate(resp)})
        }
    }, []);
return (
    <>
      <Header/>
      <Card className="text-center mt-4">
      <Card.Header>Welcome Home, {user?.id}</Card.Header>
      <Card.Body>
        <Card.Title>Special title treatment</Card.Title>
        <Card.Text>
          With supporting text below as a natural lead-in to additional content.
        </Card.Text>
        <Button variant="primary">Go somewhere</Button>
      </Card.Body>
    </Card>
    </>
)
}

export default Home