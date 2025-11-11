import { LoginForm } from "../login-form";

export default function LoginPage() {
    const BACKGROUND = process.env.NEXT_PUBLIC_LOGIN_BACKGROUND_IMAGE

    return (
        <div className={"min-w-screen min-h-screen bg-muted bg-center flex flex-col items-center justify-center"} style={{backgroundImage: `url(${BACKGROUND})`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
            <div className="min-w-screen min-h-screen backdrop-blur-md flex flex-col items-center justify-center p-6 md:p-10">
                <div className="w-full max-w-sm md:max-w-3xl ">
                    <LoginForm />
                </div>        
            </div>
        </div>
    )
}