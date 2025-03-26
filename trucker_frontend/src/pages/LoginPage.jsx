import LoginForm from "../components/Form"
import Header from "../components/Header";
import Footer from "../components/Footer";

const LoginPage = () => {
    return (
      <div>
        <Header/>
        <LoginForm route="/" method="login"/>
        <Footer/>
      </div>
    )
  }
  
  export default LoginPage;