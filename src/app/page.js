'use client'

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function Home() {
  const router = useRouter()
  const [tokenExists, setTokenExists] = useState(false)
  const [cars, setCars] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [fade, setFade] = useState(true) // For fade animation
  const [showVideo, setShowVideo] = useState(false) // Show/hide video overlay
  const videoRef = useRef(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
    } else {
      setTokenExists(true)
    }
  }, [router])

  useEffect(() => {
    if (tokenExists) {
      fetchCars()
    }
  }, [tokenExists])

  useEffect(() => {
    if (!cars.length) return

    const interval = setInterval(() => {
      setFade(false)
      setTimeout(() => {
        setCurrentIndex(prev => (prev + 1) % cars.length)
        setFade(true)
      }, 500)
    }, 4000)

    return () => clearInterval(interval)
  }, [cars])

  // Toggle video overlay on SPACE press
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.code === "Space") {
        e.preventDefault()
        setShowVideo(prev => !prev)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Play/pause video depending on showVideo state
  useEffect(() => {
    if (showVideo) {
      videoRef.current?.play()
    } else {
      if (videoRef.current) {
        videoRef.current.pause()
        videoRef.current.currentTime = 0
      }
    }
  }, [showVideo])

  const fetchCars = async () => {
    try {
      const res = await fetch("https://invoice.njpurchase.com/api/car-auction-master/auction-cars", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })
      const data = await res.json()
      if (data.success) {
        const formatted = data.data.flatMap(auction =>
          auction.car_details.map(car => ({
            ...car,
            auction_date: auction.auction_date,
          }))
        )
        setCars(formatted)
      }
    } catch (err) {
      console.error("Failed to fetch cars", err)
    }
  }

  if (!tokenExists || cars.length === 0) return null

  const car = cars[currentIndex]

  return (
    <div className="w-full h-screen flex flex-col bg-black text-white relative">
      {/* Header */}
      <div
        className="flex p-3 w-full items-center justify-center"
        style={{
          opacity: fade ? 1 : 0,
          transition: "opacity 0.5s ease-in-out",
        }}
      >
        <h1 className="text-7xl">Stock No. {car.lot_no}</h1>
      </div>

      {/* Main Content */}
      <div
        className="flex-1 flex w-full"
        style={{
          opacity: fade ? 1 : 0,
          transition: "opacity 0.5s ease-in-out",
        }}
      >
        <div className="w-full flex h-fit">
          <div className="w-[50%] mt-3 ml-10 max-[1030px]:ml-2 flex justify-between">
            <div className="w-full">
              <div className="text-center">
                <h1 className="text-7xl text-yellow-600">{car.chassis_no}</h1>
                <h1 className="text-6xl text-red-500">{car.maker} {car.model}</h1>
              </div>

              <div className="flex flex-col mt-5 gap-3">
                {[
                  { label: "AUCTION DATE", value: car.auction_date },
                  { label: "YEAR", value: car.registration_year },
                  { label: "COLOR", value: car.color_name },
                  { label: "TRANSMISSION", value: car.transmission_name },
                  { label: "DRIVE", value: car.drive_name },
                  { label: "CC", value: car.engine_size },
                  { label: "MILEAGE", value: car.mileage },
                  { label: "STEERING", value: car.steering_name },
                  { label: "DOORS", value: car.doors },
                  { label: "SEATS", value: car.seats },
                ].map((item, idx) => (
                  <div className="flex w-full" key={idx}>
                    <div className="w-full px-3">
                      <h1 className="text-5xl max-[1600px]:text-3xl">{item.label}</h1>
                    </div>
                    <div className="w-full ml-10">
                      <h1 className="text-5xl text-left max-[1600px]:text-3xl">: {item.value}</h1>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="w-[50%] flex items-center justify-center flex-col mt-10 gap-5">
            {car.images?.slice(0, 2).map((img, i) => (
              <Image key={i} src={img} alt="car" width={450} height={600} className="max-[1600px]:w-[400px]" />
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        className="w-full flex py-4 items-center justify-center gap-2"
        style={{
          opacity: fade ? 1 : 0,
          transition: "opacity 0.5s ease-in-out",
        }}
      >
        <Image src="/logo.png" height={120} width={120} alt="logo" />
        <h1 className="text-4xl text-yellow-600">WWW.NAZARJAPAN.COM</h1>
      </div>

      {/* Video Overlay */}
      {showVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50">
          <video
            ref={videoRef}
            src="/videos/dubai_auction_promotion.mp4"
            className="max-w-full max-h-full rounded-md shadow-lg"
            controls={true}
            autoPlay
            onEnded={() => setShowVideo(false)}
          />
        </div>
      )}
    </div>
  )
}
