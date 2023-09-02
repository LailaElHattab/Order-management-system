import { useContext, useState } from 'react';
import axios from 'axios';
import './login-page.css';
import { AuthContext } from '../hooks/auth-hook';
import Card from 'react-bootstrap/Card';
export default function LoginPage() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg] = useState('');

    const authContext = useContext(AuthContext);

    const submit = () => {
        if (!username || !password) return;
        axios.post('/login', { username, password })
            .then(resp => {
                const user = { name: resp.data.name };
                authContext.setUser(user);
            }).catch(err => {
                setErrMsg('Invalid Credential!');
            });
    }

    return (
        <Card style={{ width: "400px", height: "400px", position: 'absolute', top: '20%', left: '35%' }}>
            <div className='login'>
                <div className='login-error'>
                    {errMsg}
                </div>
                <div>
                    <label>Email</label>
                    <input type="username" className="form-control login-control"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label>Password</label>
                    <input type="password" className="form-control login-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="button" className="btn btn-danger login-button"
                    disabled={!username || !password}
                    onClick={() => submit()}
                >
                    Login
                </button>

            </div>
        </Card>
    )
}