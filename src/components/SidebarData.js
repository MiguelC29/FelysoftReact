import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';

const mapIcon = (iconName) => {
    switch (iconName) {
        case "home":
            return <AiIcons.AiFillHome />;
        case "inventory_2":
            return <FaIcons.FaWarehouse />;
        case "shopping_cart":
            return <FaIcons.FaShoppingCart />;
        case "local_shipping":
            return <FaIcons.FaTruck />;
        case "event_available":
            return <FaIcons.FaCalendarCheck />;
        case "deployed_code":
            return <FaIcons.FaBoxes />;
        case "monitoring":
            return <FaIcons.FaChartBar />;
        case "group":
            return <IoIcons.IoMdPeople />;
        case "settings":
            return <IoIcons.IoMdSettings />;
        case "logout":
            return <AiIcons.AiOutlineLogout />;
        default:
            return null;
    }
};

export const SidebarData = [
    {
        title: 'Inicio',
        path: '/',
        icon: <AiIcons.AiFillHome />,
        cName: 'nav-text'
    },
    {
        title: 'Reports',
        path: '/reports',
        icon: <IoIcons.IoIosPaper />,
        cName: 'nav-text'
    },
    {
        title: 'Products',
        path: '/products',
        icon: <FaIcons.FaCartPlus />,
        cName: 'nav-text'
    },
    {
        title: 'Team',
        path: '/team',
        icon: <IoIcons.IoMdPeople />,
        cName: 'nav-text'
    },
    {
        title: 'Messages',
        path: '/messages',
        icon: <FaIcons.FaEnvelopeOpenText />,
        cName: 'nav-text'
    },
    {
        title: 'Support',
        path: '/support',
        icon: <IoIcons.IoMdHelpCircle />,
        cName: 'nav-text'
    }
];

export default SidebarData;
