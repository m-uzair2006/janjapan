'use client'
import { useState,useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function LoginForm({ className, ...props }) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [tokenExists, setTokenExists] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      router.push("/")
      setTokenExists(true)
    }
  }, [router])

  if (tokenExists) {
    return null
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      const response = await fetch("https://invoice.njpurchase.com/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      })

      const data = await response.json()

      if (response.ok && data?.data?.token) {
        setSuccess("Login successful!")
        console.log("Token:", data.data.token)
        localStorage.setItem("token", data.data.token)
        router.push("/")
      } else {
        setError(data?.message || "Invalid login credentials")
   
      }
    } catch (err) {
      console.log(err)
      setError("Network error. Please try again.")
   
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className='bg-[#171717] w-[500px] text-white border-[#2e2f2f]'>
        <h1 className='text-7xl my-6 font-bold text-center'>Login</h1>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label className='text-2xl' htmlFor="username">Username</Label>
                <Input
                  id="username"
                  className='h-[50px]'
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter Username"
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label className='text-2xl' htmlFor="password">Password</Label>
                <Input
                  id="password"
                  className='h-[50px]'
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  required
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}
              {success && <p className="text-green-500 text-sm">{success}</p>}

              <div className="flex flex-col gap-3">
                <Button variant='login' type="submit" className="w-full" disabled={loading}>
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
