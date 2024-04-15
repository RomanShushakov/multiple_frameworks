import { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [username, usernameupdate] = useState('');
    const [password, passwordupdate] = useState('');
   

    const usenavigate = useNavigate();
    
    const ProceedLogin = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (validate()) {
            fetch("http://localhost:3001/user/" + username).then((res) => {
                return res.json();
            }).then((resp) => {
                console.log(resp)
                if (Object.keys(resp).length === 0) {
                    //toast.error('Please Enter valid username');
                } else {
                    if (resp.password === password) {
                        sessionStorage.setItem('username',username);
                       // sessionStorage.setItem('userrole',resp.role);
                        usenavigate('/')
                    }
                }
            }).catch((err) => {
                toast.error('Login Failed due to :' + err.message);
            });
        }
    }
    const validate = () => {
        let result = true;
        if (username === '' || username === null) {
            result = false;
        }
        if (password === '' || password === null) {
            result = false;
        }
        return result;
    }
  return (
    <div className="offset-lg-3 col-lg-6" style={{ marginTop: '100px' }}>
        <form onSubmit={ProceedLogin} className="container">
                <div className="card">
                        <div className="card-header">
                            <h2>User Login</h2>
                        </div>
                        <div className="card-body">
                            <div className="form-group">
                                <label>User Name <span className="errmsg">*</span></label>
                                <input value={username} onChange={e => usernameupdate(e.target.value)} className="form-control" required></input>
                                <div className="invalid-feedback"> Looks good!</div>
                            </div>
                            <div className="form-group">
                                <label>Password <span className="errmsg">*</span></label>
                                <input type="password" value={password} onChange={e => passwordupdate(e.target.value)} className="form-control"></input>
                            </div>
                        </div>
                        <div className="card-footer">
                            <button type="submit" className="btn btn-primary">Login</button>
                        </div>
                </div>
        </form>
    </div>
  )
}

export default Login