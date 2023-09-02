import ProfileIcon from '../assets/person.jpeg';
import Avatar from 'react-avatar';
import { Menu, Item, useContextMenu } from 'react-contexify';
import axios from 'axios';
import "react-contexify/dist/ReactContexify.css";
import { BiBell, BiSearch } from 'react-icons/bi';
import { BiChevronDown } from 'react-icons/bi';
import '../components/main-menu.css'
import { useContext } from 'react';
import { AuthContext } from '../hooks/auth-hook';
import pinkbotit from '../assets/pink-botit.png';
import { NavLink } from 'react-router-dom';
export default function MainMenu() {
    const authContext = useContext(AuthContext);

    const { show: showProfilePicker } = useContextMenu({ id: 'user-profile-context' });

    const logout = () => {
        axios.post('/logout')
            .finally(() => {
                authContext.setUser(null);
            });
    }
    let name = authContext.user.name;
    const parts = name.split(' ');
    name = parts[0];

    return (
        <div>
            <NavLink to={`/orders`} style={{ textDecoration: "none" }}>
                <img className="image" src={pinkbotit} />
            </NavLink>
            <span className='menu'>

                <div className='menu_item'>
                    <p>Welcome Back, {name}</p>
                </div>

                <div className='rightContent'>
                    <BiSearch />
                    <BiBell />
                    <span className='user' >
                        <Avatar src={ProfileIcon} round={true} size='40' />  <span className='username'>{authContext.user.name}</span>
                    </span>
                    <span onClick={(e) => { showProfilePicker({ event: e }); }}><BiChevronDown /></span>
                </div>

                <Menu id={`user-profile-context`}>
                    <Item onClick={(ev) => logout()}>{'Logout'}</Item>
                </Menu>
            </span>
        </div>




    )
}