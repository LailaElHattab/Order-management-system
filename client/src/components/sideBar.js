import './sideBar.css';
import { MdOutlineExplore } from 'react-icons/md';
import { HiOutlineShoppingBag } from 'react-icons/hi';
import { BsBoxes } from 'react-icons/bs';
import { FiSettings, FiLogOut } from 'react-icons/fi';
import axios from 'axios';
import { AuthContext } from '../hooks/auth-hook';
import { useContext } from 'react';

const Sidebar = () => {
    const authContext = useContext(AuthContext);

    const logout = () => {
        axios.post('/logout')
            .finally(() => {
                authContext.setUser(null);
            });
    }
    return (
        <div className="sidebar" style={{ borderRight: "1px solid #E6EDFF" }}>

            <div className="sidebar-menu">

                <ul className='content'>
                    <a href='/orders' style={{ textDecoration: "none", color: "var(--bg)" }}><li style={{ borderRight: "3px solid var(--bg)" }}><MdOutlineExplore className='icon' style={{ color: "var(--bg)" }} />Overview</li></a>
                    <a href='/orders' style={{ textDecoration: "none", color: "#7C8DB5" }}><li><BsBoxes className='icon' />Orders</li></a>
                    <li><HiOutlineShoppingBag className='icon' />Product</li>
                    <li><FiSettings className='icon' />Setting</li>
                </ul>
                <ul className='content2'>
                    <li onClick={(ev) => logout()}><FiLogOut className='icon2' />Logout</li>
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;
