import React from 'react'
import { useAuth } from '../../hooks/useAuth';
import classes from './dashboard.module.css';
import { Link } from 'react-router-dom';

export default function Dashboard() {
    const { user } = useAuth();

  return (
    <div className={classes.container}>
        <div className={classes.menu}>
            {allItems
                // if user is admin, show everything, otherwise only show items not for admins
                .filter(item => user.isAdmin || !item.forAdmin)
                .map(item => (
                    <Link
                        key={item.title}
                        to={item.url}
                        style={{
                            backgroundColor: item.bgColor,
                            color: item.color,
                        }}
                    >
                        <img src={item.imageUrl} alt={item.title} />
                        <h2>{item.title}</h2>
                    </Link>
            ))}
        </div>
    </div>
  )
}

const allItems = [
    {
      title: 'Orders',
      imageUrl: '/icons/orders.png',
      url: '/orders',
      bgColor: '#ec407a',
      color: 'white',
    },
    {
      title: 'Profile',
      imageUrl: '/icons/profile.png',
      url: '/profile',
      bgColor: '#1565c0',
      color: 'white',
    },
    {
      title: 'Users',
      imageUrl: '/icons/users.png',
      url: '/admin/users',
      forAdmin: true,
      bgColor: '#00bfa5',
      color: 'white',
    },
    {
      title: 'Foods',
      imageUrl: '/icons/foods.png',
      url: '/admin/foods',
      forAdmin: true,
      bgColor: '#7DC8FB',
      color: 'white',
    },
];