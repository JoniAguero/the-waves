import React from 'react';
import UserLayout from '../../Hoc/UserLayout';
import MyButton from '../utils/button';

const UserDashboard = () => {
    return (
        <UserLayout>
            <div>
                
                <div className="user_nfo_panel">
                    <h1>User information</h1>
                    <div>
                        <span>name</span>
                        <span>lastname</span>
                        <span>email</span>
                    </div>
                    <MyButton
                        type="default"
                        title="Edit account info"
                        linkTo="/user/user_profile"
                    />
                </div>

                <div className="user_nfo_panel">
                    <h1>History purchases</h1>
                    <div className="user_product_block_wrapper">
                            history
                    </div>            
                </div>
                
            </div>
        </UserLayout>
        
    );
};

export default UserDashboard;