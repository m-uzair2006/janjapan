'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function Home() {
  const router = useRouter()
  const [tokenExists, setTokenExists] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
    } else {
      setTokenExists(true)
    }
  }, [router])

  if (!tokenExists) {
    return null // or loading spinner
  }

  return (
    <div id="test"  className="w-full h-screen    flex flex-col bg-black text-white">
      {/* Header */}
      <div className="flex p-3 w-full items-center justify-center">
        <h1 className="text-7xl">STOCK NO. #  E3</h1>
      </div>

      {/* Main Content */}
      <div id="tes" className="flex-1 h-fit flex w-full ">
    <div className=" w-full flex h-fit">
    <div className="w-[50%] mt-3 ml-10 max-[1030px]:ml-2 h-fit max-[1030px]:justify-start flex items-start justify-center">
          <div className="w-[80%] h-fit">
            {/* Info Section */}
            <div className="text-center">
              <h1 className="text-5xl text-yellow-600">ZRR70-0500467</h1>
              <h1 className="text-3xl text-red-500">TOYOTA VOXY</h1>
            </div>

            {/* Detail Rows */}
            <div className="flex w-full gap-3 justify-between mt-5 flex-col">
              {[
                { label: "Auction Date", value: "02-06-2025" },
                { label: "Year", value: "2010" },
                { label: "COLOR", value: "Pearl White" },
                { label: "TRANSMISSION", value: "AT" },
                { label: "DRIVE", value: "2wheel drive" },
                { label: "CC", value: "2000 CC" },
                { label: "MILEAGE", value: "81,745 KM" },
                { label: "STEERING", value: "Right" },
                { label: "DOORS", value: "5" },
                { label: "SEATS", value: "8" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between px-3 w-full"
                >
                  <h1 className="text-5xl max-[1600px]:text-3xl">{item.label} :</h1>
                  <h1 className="text-5xl max-[1600px]:text-3xl"> {item.value}</h1>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="h-full w-[50%] flex items-center justify-center flex-col max-[1486px]:mr-10 mt-10 gap-5 max-[1486px]:items-end">
          <Image className=" max-[1600px]:w-[400px]    " src='/car1.jpeg' alt="car" height={100} width={450} />
          <Image className=" max-[1600px]:w-[400px]    " src='/car2.jpeg' alt="car" height={600} width={450} />
        </div>
    </div>
      </div>

      {/* Footer */}
      <div className="w-full flex py-4 items-center justify-center gap-2">
        <Image src="/logo.png" height={120} width={120} alt="logo" />
        <h1 className="text-4xl text-yellow-600">WWW.NAZARJAPAN.COM</h1>
      </div>
    </div>
  )
}
