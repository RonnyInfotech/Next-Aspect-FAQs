import React, { useRef, useState } from 'react';
import { Button, Avatar, Menu } from 'primereact';
import LicenseExpired from '../LicenseExpired/LicenseExpired';
import './Header.css';

const Header = () => {
    const [isVisible, setIsVisible] = useState(false);
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
                    icon: 'pi pi-id-card',
                    command: () => {
                        // setIsVisible(true);
                    }
                },
            ]
        }
    ];

    return (
        <div>
            <header className="header">
                <nav className="navbar">
                    <p className='m-0 font-medium'>FAQs</p>
                    <div className="flex">
                        <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png" shape="circle" onClick={(event) => menuRight.current.toggle(event)} />
                        <Menu model={items} popup ref={menuRight} id="popup_menu_right" popupAlignment={'right'} />
                    </div>
                </nav>
            </header>
            {isVisible && <LicenseExpired licenseShow={isLicenseShow} />}
        </div>
    );
};

export default Header;