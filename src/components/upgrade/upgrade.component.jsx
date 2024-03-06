import { getCheckoutUrl } from "../../utils/stripe/stripe.utils";
import { app, signOutFromApp } from '../../utils/firebase/firebase.utils'
import { useContext } from "react";
import { CreditContext, SubscriptionContext,UserContext } from "../../context/user.context";
import { Navigate } from "react-router-dom";
import './upgrade.styles.scss'

const Upgrade = () => {
    const {currentUser} = useContext(UserContext)
    const {credit} = useContext(CreditContext)
    const { isSubscribed, setSubscription } = useContext(SubscriptionContext)
    
    const handleCheckout = async () => {
        const price_id = "price_1Oc7JxLSwB1ux576UUecmg1v"
        const url = await getCheckoutUrl(app, price_id);
        //window.open(url, '_blank');
        window.location.href=url;
        setSubscription(true)
    }

    return (
        <div className="upgrade-container">
      {currentUser ? (
        !isSubscribed || credit === '0' ? (
          <div className="upgrade-content">
            <h2 className="upgrade-heading">Subscribe to Continue</h2>
            <p className="upgrade-description">Unlock premium features for an enhanced experience.</p>
            <button onClick={handleCheckout} className="upgrade-btn">Upgrade to Premium</button>
            <button onClick={signOutFromApp} className="sign-out-btn">Sign Out</button>
          </div>
        ) : (
          <Navigate to="/home" />
        )
      ) : (
        <Navigate to="/" />
      )}
    </div>

    )
}

export default Upgrade;