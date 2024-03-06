import { useContext } from 'react'
import { signInWIthGoooglePopup } from '../../utils/firebase/firebase.utils.js'
import { Navigate } from 'react-router-dom'
import './sign-in.styles.scss'
import { UserContext, SubscriptionContext } from '../../context/user.context.jsx'

const SignIn = () => {

    const signInMiddleware = async () => {
        try {
            const res = await signInWIthGoooglePopup()
            console.log(res);
        } catch (error) {
            switch (error.code) {
                case 'auth/popup-closed-by-user':
                    <Navigate to={'/'}></Navigate>
                    break;
                case "auth/wrong-password":
                    alert("Incorrect Password");
                    break;
                case "auth/user-not-found":
                    alert("No user associated");
                    break;
                default:
                    console.log(error.message);
            }
        }

    }

    const { currentUser } = useContext(UserContext)
    const { isSubscribed } = useContext(SubscriptionContext)
    return (
        <div className='sign-in-container'>
            {
                currentUser ? (
                    isSubscribed ? (<Navigate to={"/home"}></Navigate>) : (<Navigate to={"/upgrade"}></Navigate>)

                ) : (
                    <div>
                        <h1 className='sign-in-heading'>Welcome!</h1>
                        <button onClick={signInMiddleware} className='sign-in-btn'>Sign In With Google</button>
                    </div>

                )
            }
        </div>
    )
}

export default SignIn;