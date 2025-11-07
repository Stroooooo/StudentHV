import { LoginForm } from "../login-form";

export default function LoginPage() {
    return (
        <div className="min-w-screen min-h-screen bg-muted bg-center flex flex-col items-center justify-center bg-[url('https://d1ssu070pg2v9i.cloudfront.net/pex/nescol/2019/10/30135658/City-Campus-2019-c-WEB.jpg')]">
            <div className="min-w-screen min-h-screen backdrop-blur-md flex flex-col items-center justify-center p-6 md:p-10">
                <div className="w-full max-w-sm md:max-w-3xl ">
                    <LoginForm />
                </div>        
            </div>
        </div>
    )
}