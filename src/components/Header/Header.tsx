import React, { useContext, useRef, useState } from 'react';
import { Avatar, Menu, Image } from 'primereact';
import LicenseExpired from '../LicenseExpired/LicenseExpired';
import { useNavigate } from 'react-router-dom';
import { currentUserEmail, profileImageUrl } from '../../webparts/nextAspectFaqs/components/NextAspectFaqs';
import { FAQsContext } from '../../context/FAQsContext';
import FullscreenToggle from '../FullscreenToggle/FullscreenToggle';
import './Header.css';

const Header = () => {
    const { admin } = useContext(FAQsContext);
    const [isVisible, setIsVisible] = useState(false);
    const navigate = useNavigate();
    const menuRight = useRef(null);

    const isLicenseShow = (isLicense) => {
        setIsVisible(isLicense);
    };

    const items = [
        {
            label: "Options",
            items: [
                {
                    label: "License",
                    icon: 'pi pi-id-card',
                    command: () => {
                        setIsVisible(true);
                    }
                },
                {
                    label: "Manage FAQs",
                    icon: 'pi pi-send',
                    command: () => {
                        navigate('/manage-faq');
                    }
                },
            ]
        }
    ];

    return (
        <div>
            <header className="header">
                <nav className="navbar">
                    <Image src={require('../../webparts/nextAspectFaqs/assets/images/logo.png')} alt="Image" width="30" onClick={() => navigate('/')} imageStyle={{ marginBottom: '-8px', cursor: 'pointer' }} />
                    <div className="flex align-items-center">
                        <FullscreenToggle />
                        <Avatar image={profileImageUrl + currentUserEmail} shape="circle" onClick={(event) => menuRight?.current?.toggle(event)} />
                        {admin && <Menu model={items} popup ref={menuRight} id="popup_menu_right" popupAlignment={'right'} />}
                    </div>
                </nav>
            </header>
            {isVisible && <LicenseExpired licenseShow={isLicenseShow} />}
        </div>
    );
};

export default Header;