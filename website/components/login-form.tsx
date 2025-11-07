"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { venv } from "@/config/env"
import { Spinner } from "./ui/shadcn-io/spinner"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const queryClient = useQueryClient()
  
  const mutation = useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      const response = fetch(venv.SERVER + "/auth/authenticate", {
        method: "POST",
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: credentials.username, 
          password: credentials.password
        })
      })

      const json = await response
      return json.json()
    },
    onSuccess: (data) => {
      queryClient.refetchQueries({queryKey: ["auth"]})
      // window.location.reload()
      console.log("Login successful:", data)
    },
    onError: (error) => {
      console.error("Login failed:", error)
    }
  })

  const login = (form: React.FormEvent<HTMLFormElement>) => {
    form.preventDefault()
    const formData = new FormData(form.currentTarget)

    const out = mutation.mutate({
      username: formData.get("username")?.toString() ?? "",
      password: formData.get("password")?.toString() ?? ""
    })
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={login}>
            <div className="flex flex-col gap-6 h-[400px] justify-center">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground text-balance">
                  Login using your computing lab account
                </p>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="username">Student Number</Label>
                <Input
                  id="username"
                  name="username"
                  placeholder="30211935"
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>

                  <AlertDialog>
                    <AlertDialogTrigger className="ml-auto">
                      <a
                        href="#"
                        className="text-sm underline-offset-2 hover:underline"
                      >
                        Forgot your password?
                      </a>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Please contact your lecturer</AlertDialogTitle>
                        <AlertDialogDescription>
                          Only a lecturer can change your password it cannot be done via this software
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction>Continue</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
                <Input id="password" name="password" type="password" required />
              </div>
              <Button disabled={mutation.isPending} type="submit" className="w-full">
                {
                  mutation.isPending ?
                    <Spinner />
                  :
                    "Login"
                }       
              </Button>
            </div>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src="https://images.pexels.com/photos/442150/pexels-photo-442150.jpeg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-white *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to not be stupid with our network{" "}
      </div>
    </div>
  )
}
