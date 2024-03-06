import { Navigate } from "react-router-dom";
import { useContext } from 'react'
import { SubscriptionContext, UserContext } from '../../context/user.context.jsx'

const StripePayment = () => {
    const { currentUser } = useContext(UserContext);
    const {isSubscribed} = useContext(SubscriptionContext)

    if(!currentUser){
        //if not logged in,redirect to the login page
        return<Navigate to="/" />;
    }
    //if the user is logged in,redirect based on subscription status
    return (
        <div>
            {currentUser && isSubscribed ? (
                // If subscribed, redirect to the home page
                <Navigate to={"/home"} />
            ) : (
                // If not subscribed, redirect to the upgrade page
                <Navigate to={"/upgrade"}></Navigate>
            )}
        </div>
    )
}

export default StripePayment;
